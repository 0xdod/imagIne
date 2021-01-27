const fs = require('fs').promises;
const path = require('path');
const _ = require('lodash');

const sidebar = require('../helpers/sidebar');

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
  if (req.method === 'POST') {
    await createImagePost(req, res);
    return;
  }
  res.render('image_create', {});
};

async function createImagePost(req, res) {
  try {
    var uploadStrategy =
      req.app.get('env') === 'production' ? 'cloudinary' : 'local';
    const result = await ImageService.upload(
      req.file,
      req.app.get('media'),
      uploadStrategy
    );
    const payload = {
      title: req.body.title,
      description: req.body.description,
      filename: result.name,
      url: result.url,
      secureURL: result.secure_url,
    };
    const image = NewImage(req.user, payload);
    const newImage = await ImageService.create(image);
    req.flash('success', 'Image posted');
    res.redirect(newImage.getAbsoluteUrl());
  } catch (err) {
    await fs.unlink(req.file.path);
    if (err == errors.UnsupportedFileTypeError) {
      res.json(400, {
        error: 'File type unsupported.',
      });
    }
    console.log('[error processing upload]', err);
    req.flash(
      'error',
      `Error: Image cannot be uploaded because ${err.message}`
    );
    res.redirect('/');
  }
}

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
      res.status(404).json({
        success: false,
        message: 'image not found.',
      });
      return;
    }
    const comment = NewComment(user, req.body);
    const newComment = await CommentService.create(comment);
    res.json({
      success: true,
      newComment: newComment,
    });
    //req.flash('success', `Your comment added.`);
    //res.redirect(`${image.getAbsoluteUrl()}#${newComment._id}`);
  } catch (err) {
    // req.flash(
    //   'error',
    //   `Failed to add comment because ${err.message}, please try again`
    // );
    // res.redirect(image.getAbsoluteUrl());

    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
    console.error(err.stack);
  }
};

const remove = async function (req, res) {
  try {
    const query = { _id: req.params.image_id };
    const image = await ImageService.get({ query });
    if (image.user_id !== req.user._id) {
      res.status(401);
      res.json({
        error: 'Unauthorized',
      });
      return;
    }
    let file = path.resolve(req.app.get('media') + image.filename);
    //delete file from cloudinary if possible.
    await fs.unlink(file);
    let result = await ImageService.delete({ query: { _id: image._id } });
    req.flash('success', 'image successfully deleted.');
    return result.ok === 1
      ? res.json({ deleted: true })
      : res.json({ deleted: false });
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

function NewComment(user, payload) {
  const author = _.pick(user, ['_id', 'username', 'avatar_url']);
  return {
    user_id: user._id,
    user: author,
    image_id: payload.image_id,
    comment: payload.comment,
    timestamp: Date.now(),
  };
}

function NewImage(user, payload) {
  const author = _.pick(user, ['_id', 'username', 'avatar_url']);
  return {
    user_id: user._id,
    user: author,
    title: payload.title,
    description: payload.description,
    url: payload.secureURL,
    filename: payload.filename,
    secureURL: payload.secureURL,
  };
}
