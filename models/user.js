const mongoose = require('mongoose');

const Image = require('./image');

const Schema = mongoose.Schema;

const user = {
	firstname: String,
	lastname: String,
	username: {
		type: String,
		unique: true,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	avatar_url: String,
	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
	},
	deleted_at: {
		type: Date,
	},
};

const userSchema = new Schema(user);

userSchema.virtual('fullname').get(function () {
	return `${this.firstname} ${this.lastname}`;
});

userSchema.methods.hasLiked = function (image) {
	const hasLiked = image.likes.includes(this._id);
	return hasLiked;
};

module.exports = mongoose.model('User', userSchema);
