const path = require('path');

const router = require('express').Router(),
	multer = require('multer'),
	passport = require('passport');

const home = require('../controllers/home'),
	image = require('../controllers/image'),
	user = require('../controllers/user'),
	{ isAuth } = require('../middleware/auth');

const uploads = multer({ dest: path.join(__dirname, '../public/upload/temp') });

module.exports = app => {
	router.use('/images/', isAuth);

	router.get('/', home.index);
	router.get('/images/:image_id', image.index);
	router.post('/images', uploads.single('file'), image.create);
	router.post('/images/:image_id/like', image.like);
	router.post('/images/:image_id/comment', image.comment);
	router.delete('/images/:image_id', image.remove);
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
	app.use(router);
};
