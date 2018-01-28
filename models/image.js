const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const Comment = require('./comment');

const Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

const { generateRandomName } = require('../utils/utils');

const errors = require('../lib/errors');

const image = {
	user_id: ObjectId,
	title: {
		type: String,
		required: true,
	},
	description: String,
	filename: {
		type: String,
		unique: true,
	},
	url: {
		type: String,
		required: true,
	},
	secureURL: String,
	views: {
		type: Number,
		default: 0,
	},
	likes: {
		type: Array,
		default: [],
	},
	likesCount: {
		type: Number,
		default: 0,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
};

const ImageSchema = new Schema(image);

ImageSchema.virtual('uniqueID').get(function () {
	return this.filename.replace(path.extname(this.filename), '');
});

ImageSchema.virtual('commentsCount')
	.get(function () {
		return this._commentsCount;
	})
	.set(function (count) {
		this._commentsCount = count;
	});

ImageSchema.methods.getAbsoluteUrl = function () {
	return `/images/${this.uniqueID}`;
};

ImageSchema.pre('deleteOne', async function () {
	const image = this;
	await Comment.deleteMany({ image_id: image._id });
});

ImageSchema.statics.upload = async function (file, destDir, uploadStrategy) {
	const Image = this;
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

function Uploader(file) {
	this.filename = file.name;
	this.filepath = file.path;
	return this;
}

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

var cloudinary = require('cloudinary').v2;

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

module.exports = mongoose.model('Image', ImageSchema);
