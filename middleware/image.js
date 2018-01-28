const fs = require('fs/promises');
const path = require('path');

const imageThumbnail = require('image-thumbnail');
const sizeOf = require('image-size');

exports.checkFile = (req, res, next) => {
	if (!req.file) {
		req.flash('error', 'Error getting file');
		res.redirect('/');
		return;
	}
	next();
};
