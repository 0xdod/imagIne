const User = require('../models').User,
	_ = require('lodash');

const createUser = reqData => {
	//validate request body data
	var user = new User(reqData);
	user.password = '';

	return new Promise((resolve, reject) => {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(reqData.password, salt, (err, hash) => {
				if (err) {
					reject(err);
				} else {
					user.password = hash;
					user.created_at = Date.now();
					user.save();
					resolve(_.pick(user, ['username', 'email']));
				}
			});
		});
	});
};

const findByID = id => {
	return User.findOne({ _id: id }).then(user => {
		return _.pick(user, ['username', 'email']);
	});
};

const deleteUser = id => {
	return User.deleteOne({ _id: id })
		.then(user => {
			return _.pick(user, ['username', 'email']);
		})
		.catch(e => {
			console.log('cannot delete!');
		});
};

const updateUser = (id, data) => {
	data.updated_at = Date.now();
	return User.findOneAndUpdate(
		{ _id: id },
		{ $set: data },
		{ new: true }
	).then(user => _.pick(user, ['username', 'email', 'updated_at']));
};

module.exports = {
	createUser,
	findByID,
	updateUser,
	deleteUser,
};
