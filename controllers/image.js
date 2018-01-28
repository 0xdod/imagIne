const fs = require('fs').promises;
const path = require('path');
const _ = require('lodash');

const sidebar = require('../helpers/sidebar');
const models = require('../models');

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

const like = async (req, res) => {
  try {
    const action = req.body.action;
    const user = req.user;
    var query, update;
    const options = { fields: { likes: user._id, likesCount: 1 }, new: true };
    if (action === 'like') {
      query = { _id: req.params.image_id, likes: { $ne: user._id } };
      update = { $inc: { likesCount: 1 }, $push: { likes: user._id } };
    } else if (action === 'unlike') {
      query = { _id: req.params.image_id, likes: user._id };
      update = { $inc: { likesCount: -1 }, $pull: { likes: user._id } };
    } else {
      res.status(400).send({
        success: false,
        message: 'Request not understood',
      });
      return;
    }
    const image = await ImageService.findAndUpdate({ query, update, options });
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

const comment = async (req, res) => {
  try {
    const user = req.user;
    const image_id = req.body.image_id;
    const query = { _id: image_id };
    var image = await ImageService.get({ query, projection: { likes: 0 } });
    if (!image) {
      res.status(404).render('404');
      return;
    }
    const comment = getCommentParam(user, req.body);
    const newComment = await CommentService.create(comment);
    req.flash('success', `Comment successfully added.`);
    res.redirect(`${image.getAbsoluteUrl()}#${newComment._id}`);
  } catch (err) {
    req.flash(
      'error',
      `Failed to add comment because ${err.message} try again`
    );
    res.redirect(image.getAbsoluteUrl());
    console.log(err);
  }
};

function getCommentParam(user, payload) {
  const author = _.pick(user, ['_id', 'username', 'avatar_url']);
  console.log(author);
  return {
    user_id: user._id,
    user: author,
    image_id: payload.image_id,
    comment: payload.comment,
    timestamp: Date.now(),
  };
}

const remove = async function (req, res) {
  const image = await ImageService.get({
    query: { _id: req.params.image_id },
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
