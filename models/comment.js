const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const comment = {
	image_id: ObjectId,
	user_id: ObjectId,
	user: Object,
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
