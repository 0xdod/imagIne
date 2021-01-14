const passport = require('passport');
// LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const { generatePasswordHash } = require('../utils/passwordUtils');

const signup = async (req, res) => {
	try {
		if (req.method === 'POST') {
			const user = new User(req.body);
			const hash = await generatePasswordHash(user.password);
			user.email = user.email.toLowerCase();
			user.username = user.username.toLowerCase();
			user.password = hash;
			await user.save();
			console.log('Succesfully created user: ', user);
			res.redirect('/');
		} else {
			res.render('signup', { layout: 'login' });
		}
	} catch (err) {
		res.status(400).render('error', {
			error: err,
			message: 'Error occured',
		});
	}
};

//TODO use flash message to display login error
const login = async (req, res) => {
	if (req.method === 'POST') {
		if (req.isAuthenticated) {
			var next = req.session.next || req.body.next;
			res.redirect(req.body.next);
			return;
		}
	}
	var error =
		req.query.auth === 'false'
			? {
					message: 'Invalid login details, try again',
			  }
			: null;
	var next = req.query.next ? req.query.next : '/';
	req.session.next = next;
	res.render('login', { layout: 'login', error, next });
};

const logout = (req, res) => {
	req.logout();
	res.redirect('/');
};

module.exports = { signup, login, logout };
