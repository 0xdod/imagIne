const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const Comment = require('./comment');

const Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

const image = {
	user_id: ObjectId,
	user: Object,
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

module.exports = mongoose.model('Image', ImageSchema);
