const passport = require('passport');
const LocalStrategy = require('passport-local');
const { connection } = require('./mongoose');

const { validatePassword } = require('../utils/passwordUtils');

const User = require('../models/user');

const verifyCallback = async (username, password, done) => {
	try {
		let user = await User.findOne({ username });
		if (!user) {
			user = await User.findOne({ email: username });
		}
		if (!user) {
			return done(null, false, {
				message: 'User not found.',
			});
		}
		const isValid = await validatePassword(password, user.password);
		if (!isValid) {
			return done(null, false, {
				message: 'Password incorrect.',
			});
		}
		return done(null, user);
	} catch (err) {
		done(err);
	}
};

passport.use(new LocalStrategy(verifyCallback));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
	try {
		const user = await User.findById(userId);
		done(null, user);
	} catch (err) {
		done(err);
	}
});

module.exports = { passport };
