const { User } = require('../models');

const { generatePasswordHash } = require('../utils/passwordUtils');

async function create(user) {
	const newUser = new User(user);
	const hash = await generatePasswordHash(user.password);
	user.password = hash;
	user.email = user.email.toLowerCase();
	user.username = user.username.toLowerCase();
	return await newUser.save();
}

async function find(query, options) {
	return await User.findOne(query, {}, options);
}

async function getAll(options) {
	return await User.find({}, {}, options);
}

async function filter(query, options) {
	return await User.find(query, {}, options);
}

async function update(query, update, options) {
	return await User.updateOne(query, options);
}

async function remove(query, options) {
	return await User.deleteOne(query, options);
}

module.exports = {
	create,
	find,
	getAll,
	filter,
	update,
	remove,
};
