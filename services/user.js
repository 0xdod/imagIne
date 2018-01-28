const { User } = require('../models');

const { generatePasswordHash } = require('../utils/passwordUtils');

function UserService() {
	return this;
}

const defaultFilter = {
	query: {},
	projection: {},
	options: {},
	update: {},
};

UserService.prototype.get = async function (filter = defaultFilter) {
	const { query, projection, options } = filter;
	return User.findOne(query, projection, options);
};

UserService.prototype.getMany = async function (filter = defaultFilter) {
	const { query, projection, options } = filter;
	return await User.find(query, projection, options);
};

UserService.prototype.update = async function (filter = defaultFilter) {
	const { query, update, options } = filter;
	return await User.updateOne(query, update, options);
};

UserService.prototype.delete = async function (filter = defaultFilter) {
	const { query, options } = filter;
	return await User.deleteOne(query, options);
};

UserService.prototype.create = async function (user) {
	const newUser = new User(user);
	const hash = await generatePasswordHash(user.password);
	newUser.password = hash;
	newUser.email = newUser.email.toLowerCase();
	newUser.username = newUser.username.toLowerCase();
	return await newUser.save();
};

UserService.prototype.getModel = function () {
	return User;
};

module.exports = new UserService();
