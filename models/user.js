const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user = new Schema({
	username: String,
	email: String,
	password: String,
	created_at: Date,
});

user.pre('save', function (next) {
	var user = this;
	user.created_at = Date.now();
	next();
});

module.exports = mongoose.model('User', user);
