const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/user');

const { validatePassword } = require('../utils/passwordUtils');

const verifyCallback = async (req, username, password, done) => {
	try {
		let user = await User.findOne({ username });
		if (!user) {
			user = await User.findOne({ email: username });
		}
		if (!user) {
			req.flash('error', 'Login details incorrect, please try again');
			return done(null, false);
		}
		const isValid = await validatePassword(password, user.password);
		if (!isValid) {
			req.flash('error', 'Invalid login details, please try again');
			return done(null, false);
		}
		return done(null, user);
	} catch (err) {
		done(err);
	}
};

passport.use(new LocalStrategy({ passReqToCallback: true }, verifyCallback));

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

module.exports = passport;
