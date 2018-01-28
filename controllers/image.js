const fs = require('fs/promises');
const path = require('path');
const sidebar = require('../helpers/sidebar');
const models = require('../models');
const MD5 = require('md5.js');

const { CommentService, ImageService } = require('../services');

const errors = require('../lib/errors');

const detail = async (req, res) => {
  const viewModel = {};
  try {
    const image = await ImageService.get({
      query: { filename: { $regex: req.params.image_id } },
    });
    if (!image) {
      res.render('404', { showSidebar: false });
      return;
    }
    image.views += 1;
    viewModel.image = image;
    viewModel.title = image.title;
    console.log(image);
    await image.save();
    const comments = await CommentService.getMany({
      query: { image_id: image._id },
      options: { sort: { timestamp: 1 } },
    });
    viewModel.comments = comments;
    sidebar(viewModel, viewModel => {
      res.render('image_detail', viewModel);
    });
  } catch (err) {
    console.error(err.stack);
  }
};

const create = async (req, res) => {
  const Image = ImageService.getModel();
  if (!req.file) {
    res.render('/');
    return;
  }
  try {
    var uploadStrategy =
      req.app.get('env') === 'production' ? 'cloudinary' : 'local';
    const result = await Image.upload(
      req.file,
      req.app.get('media'),
      uploadStrategy
    );
    const newImage = await ImageService.create({
      title: req.body.title,
      description: req.body.description,
      filename: result.name,
      url: result.url,
      secureURL: result.secure_url,
    });
    res.redirect(newImage.getAbsoluteUrl());
  } catch (err) {
    fs.unlink(req.file.path)
      .then(() => {
        console.log('[successfully deleted]');
      })
      .catch(err => {
        console.log('[cannot delete file] ' + req.file.path);
      });
    if (err == errors.UnsupportedFileTypeError) {
      res.json(400, {
        error: 'File type unsupported.',
      });
    }
    console.log('[error processing upload]', err);
    // send flash message
    res.send('An error occured');
  }
};

const likee = (req, res) => {
  models.Image.findOne({ filename: { $regex: req.params.image_id } })
    .then(image => {
      if (!image) {
        throw new Error('Cannot find image');
      }
      image.likesCount++;
      return image.save();
    })
    .then(image => {
      if (image) {
        res.json({ likes: image.likesCount });
      }
    })
    .catch(err => {
      res.json(err);
    });
};

const like = async (req, res) => {
  const action = req.body.action;
  const user = req.user;
  if (!user) {
    res.status(403).json({
      success: false,
      message: 'cannot identify user',
    });
  }
  try {
    var image;
    switch (action) {
      case 'like':
        image = await ImageService.findAndUpdate({
          query: { _id: req.params.image_id, likes: { $ne: user._id } },
          update: { $inc: { likesCount: 1 }, $push: { likes: user._id } },
          options: { fields: { likes: user._id, likesCount: 1 }, new: true },
        });
        break;
      case 'unlike':
        image = await ImageService.findAndUpdate({
          query: { _id: req.params.image_id, likes: user._id },
          update: { $inc: { likesCount: -1 }, $pull: { likes: user._id } },
          options: { fields: { likes: user._id, likesCount: 1 }, new: true },
        });
        break;
      default:
        res.status(400).send({
          success: false,
          message: 'Request not understood',
        });
        return;
    }
    console.log(image);
    console.log(action);
    if (!image) {
      res.status(404).json({
        success: false,
        message: 'cannot find image',
      });
      return;
    }
    res.json({
      success: true,
      likes: image.likesCount,
      action,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};

const comment = (req, res) => {
  var localImage = {};
  models.Image.findOne({ filename: { $regex: req.params.image_id } })
    .then(image => {
      if (image) {
        const newComment = new models.Comment(req.body);
        //  newComment.gravatar = md5(newComment.email);
        //remove, use md5
        newComment.gravatar = new MD5().update(newComment.email).digest('hex');
        newComment.image_id = image._id;
        localImage = image;
        return newComment.save();
      } else {
        res.redirect('/');
      }
    })
    .then(comment => {
      res.redirect(`/images/${localImage.uniqueID}#${comment._id}`);
    })
    .catch(err => {
      console.log(err);
    });
};

const remove = async function (req, res) {
  const image = await ImageService.get({
    query: { filename: { $regex: req.params.image_id } },
  });
  try {
    let file = path.resolve(req.app.get('media') + image.filename);
    await fs.unlink(file);
    await CommentService.deleteMany({ query: { image_id: image._id } });
    let result = await ImageService.delete({ query: { _id: image._id } });
    return result.ok === 1 ? res.json(true) : res.json(false);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send();
  }
};

module.exports = {
  detail,
  create,
  like,
  comment,
  remove,
};
