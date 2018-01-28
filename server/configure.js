const path = require('path');

const hbs = require('hbs');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');
const moment = require('moment');

const routes = require('./routes');

module.exports = app => {
	app.use(logger('dev'));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(cookieParser('some-secret-value-here'));
	routes(app);
	app.use('/public/', express.static(path.join(__dirname, '../public')));
	if ('development' === app.get('env')) {
		app.use(errorHandler());
	}
	app.set('views', path.join(__dirname, '../views'));
	hbs.registerHelper('timeago', function (timestamp) {
		return moment(timestamp).startOf('minute').fromNow();
	});
	hbs.registerPartials(app.get('views') + '/layouts');
	hbs.registerPartials(app.get('views') + '/partials');
	app.set('view engine', 'hbs');
	return app;
};
