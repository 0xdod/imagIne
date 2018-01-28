const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;

const image = {
	title: String,
	description: String,
	filename: String,
	views: {
		type: Number,
		default: 0,
	},
	likes: {
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

module.exports = mongoose.model('Image', ImageSchema);
