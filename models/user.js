const mongoose = require('mongoose');
bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
//implement social auth
const userSchema = new Schema({
	username: String, // unique
	email: String, //unique
	password: String,
	created_at: Date,
	updated_at: Date,
	deleted_at: Date,
});

// userSchema.pre('save', function (next) {
// 	var user = this;
// 	user.created_at = Date.now();
// 	next();
// });

module.exports = mongoose.model('User', userSchema);

// bcrypt.genSalt(10, (err, salt) => {
// 	bcrypt.hash(password, salt, (err, hash) => {});
// });

//login
// bcrypt.compare(password, hashedPassword, (err, res) => {
// 	console.log(res);
// });
