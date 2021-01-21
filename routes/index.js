const router = require('express').Router();

const home = require('./home'),
	images = require('./images');
//users = require('./users');

module.exports = app => {
	router.use('/', home());
	router.use('/images', images());
	//router.use('/', users());
	app.use(router);
};
