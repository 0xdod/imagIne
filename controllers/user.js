const _ = require('lodash');
const ObjectId = require('mongodb').ObjectId;

const userService = require('../services/user');

const create = (req, res) => {
	const data = _.pick[(req.body, ['username', 'email', 'password'])];
	userService.createUser(req.body).then(user => {
		res.status(201).json(user);
	});
};

const getUser = (req, res) => {
	const id = req.params.id;
	if (ObjectId.isValid(id)) {
		userService.findByID(id).then(user => res.json(user));
	}
};

const remove = (req, res) => {
	const id = req.params.id;
	if (ObjectId.isValid(id)) {
		userService.deleteUser(id).then(user => res.json(user));
	}
};

const update = (req, res) => {
	const id = req.params.id;
	var body = _.pick(req.body, ['username', 'email', 'updated_at']);
	if (ObjectId.isValid(id)) {
		userService.updateUser(id, body).then(user => {
			if (!user) {
				res.status(404).json({ error: 'entry not found' });
			} else {
				res.json(user);
			}
		});
	}
};

const login = (req, res) => {
	if (req.method === 'GET') {
		res.render('login');
	}
};

module.exports = {
	create,
	getUser,
	update,
	remove,
	login,
};
