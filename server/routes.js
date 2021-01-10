const path = require('path');

const express = require('express'),
	router = express.Router(),
	home = require('../controllers/home'),
	image = require('../controllers/image'),
	user = require('../controllers/user'),
	multer = require('multer');

const uploads = multer({ dest: path.join(__dirname, '../public/upload/temp') });

module.exports = app => {
	router.get('/', home.index);
	router.get('/images/:image_id', image.index);
	router.post('/images', uploads.single('file'), image.create);
	router.post('/images/:image_id/like', image.like);
	router.post('/images/:image_id/comment', image.comment);
	router.delete('/images/:image_id', image.remove);
	router.all('/signup', user.signup);
	router.all('/signin', user.login);
	app.use(router);
};
