const User = require('../models/user');
const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

const signup = (req, res) => {
	if (req.method == 'POST') {
		return;
	}
	res.render('signup', { layout: 'login' });
};

const login = (req, res) => {
	//const { username, password } = req.body;
	if (req.method === 'POST') {
		passport.use(
			new LocalStrategy((username, password, done) => {
				User.findOne({ email: username }, (err, user) => {
					if (err) return done(err);
					if (!user) {
						User.findOne({ username: username }).then(user => {
							if (!user) {
								return done(null, false, {
									message: 'User not found.',
								});
							}
							if (!user.validPassword(password)) {
								return done(null, false, {
									message: 'Password incorrect.',
								});
							}

							return done(null, user);
						});
					}
				});
			})
		);
		return;
	}
	res.render('login', { layout: 'login' });
};

module.exports = { signup, login };
