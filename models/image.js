const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

const { generateRandomName } = require('../utils/utils');

const image = {
	user_id: { type: ObjectId },
	title: String,
	description: String,
	filename: String,
	url: String,
	secureURL: String,
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

ImageSchema.virtual('commentsCount')
	.get(function () {
		return this._commentsCount;
	})
	.set(function (count) {
		this._commentsCount = count;
	});

module.exports = mongoose.model('Image', ImageSchema);
