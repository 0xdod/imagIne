const fs = require('fs');
const path = require('path');

var cloudinary = require('cloudinary').v2;

const { Image } = require('../models');
const { generateRandomName } = require('../utils/utils');

const errors = require('../lib/errors');

function ImageService() {
	return this;
}

function Uploader(file) {
	this.filename = file.name;
	this.filepath = file.path;
	return this;
}

const defaultFilter = {
	query: {},
	projection: {},
	options: {},
	update: {},
};

ImageService.prototype.get = async function (filter = defaultFilter) {
	const { query, projection, options } = filter;
	return Image.findOne(query, projection, options);
};

ImageService.prototype.getMany = async function (filter = defaultFilter) {
	const { query, projection, options } = filter;
	return await Image.find(query, projection, options);
};

ImageService.prototype.update = async function (filter = defaultFilter) {
	const { query, update, options } = filter;
	return await Image.updateOne(query, update, options);
};

ImageService.prototype.findAndUpdate = async function (filter = defaultFilter) {
	const { query, update, options } = filter;
	return await Image.findOneAndUpdate(query, update, options);
};

ImageService.prototype.delete = async function (filter = defaultFilter) {
	const { query, options } = filter;
	return await Image.deleteOne(query, options);
};

ImageService.prototype.create = async function (image) {
	const newImage = new Image(image);
	return await newImage.save();
};

ImageService.prototype.getModel = function () {
	return Image;
};

ImageService.prototype.upload = async function (file, destDir, uploadStrategy) {
	const randName = generateRandomName(6);
	const images = Image.find({ filename: { $regex: randName } });
	if (images.length > 0) {
		Image.upload();
		return;
	}
	let tempPath = file.path;
	let ext = path.extname(file.originalname).toLowerCase();
	let targetPath = path.join(destDir, randName + ext);
	const validExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
	if (!validExts.includes(ext)) {
		fs.unlink(tempPath, err => {
			console.log('removed unsupported file type');
		});
		throw errors.UnsupportedFileTypeError;
		return;
	}
	var uploader = new Uploader({ name: randName + ext, path: tempPath });
	uploadStrategy = uploadStrategy || 'local';
	var result;
	switch (uploadStrategy) {
		case 'local':
			result = uploader.local(targetPath);
			break;
		case 'cloudinary':
			result = uploader.cloudinary();
			break;
	}
	return await result;
};

Uploader.prototype.local = function (dest) {
	let filepath = this.filepath;
	let format = path.extname(filepath).toLowerCase().replace('.', '');
	let url = dest.substring(dest.indexOf('/media/'));
	return new Promise((resolve, reject) => {
		fs.rename(filepath, dest, err => {
			if (err) {
				reject(err);
			} else {
				resolve({
					//width: 200,
					//height: 200,
					name: this.filename,
					format,
					resource_type: 'image',
					url,
					//TODO don't hardcode this.
					secure_url: '',
				});
			}
		});
	});
};

Uploader.prototype.cloudinary = function () {
	const filepath = this.filepath;
	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload(filepath, (err, result) => {
			if (err) {
				reject(err);
			} else {
				result.name = this.filename;
				resolve(result);
			}
		});
	});
};

module.exports = new ImageService();
