const router = require('express').Router();

const home = require('../controllers/home');
const user = require('../controllers/user');
const passport = require('../config/passport');

module.exports = () => {
	router.get('/', home.index);
	router.get('/login', user.login);
	router.post(
		'/login',
		passport.authenticate('local', {
			failureRedirect: '/login',
			failureFlash: true,
		}),
		user.login
	);
	router.get('/signup', user.signup);
	router.post('/signup', user.signup);
	router.get('/logout', user.logout);

	return router;
};

// TEST ROUTING WORKS.
