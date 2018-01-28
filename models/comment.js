const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const comment = {
	image_id: { type: ObjectId },
	email: String,
	name: String,
	gravatar: String,
	comment: String,
	timestamp: {
		type: Date,
		default: Date.now,
	},
};

const CommentSchema = new Schema(comment);

CommentSchema.virtual('image')
	.set(function (image) {
		this._image = image;
	})
	.get(function () {
		return this._image;
	});

module.exports = mongoose.model('Comment', CommentSchema);
