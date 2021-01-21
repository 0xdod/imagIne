const router = require('express').Router();

const passport = require('passport');

const home = require('../controllers/home');
const user = require('../controllers/user');

module.exports = () => {
	router.get('/', home.index);
	router.get('/login', user.login);
	router.post(
		'/login',
		passport.authenticate('local', {
			failureRedirect: '/login?auth=false',
		}),
		user.login
	);
	router.get('/signup', user.signup);
	router.post('/signup', user.signup);
	router.get('/logout', user.logout);

	return router;
};
