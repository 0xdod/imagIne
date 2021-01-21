const path = require('path');

const express = require('express');
//const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('morgan');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');
const moment = require('moment');
const MongoStore = require('connect-mongo')(session);

const mongoose = require('./mongoose');
const passport = require('./passport');
const hbs = require('./hbs');
const router = require('../routes');

const mongoStore = new MongoStore({
	mongooseConnection: mongoose.connection,
	collection: 'sessions',
});

const sessionOptions = app => {
	const secret = process.env.SESSION_SECRET || 'some-secret-value-here';
	const opts = {
		secret,
		resave: false,
		saveUninitialized: true,
		store: mongoStore,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
		},
	};

	if (app.get('env') === 'production') {
		opts.cookie.secure = true;
	}
	return opts;
};

module.exports = app => {
	app.set('views', path.join(__dirname, '../views'));
	app.set('static', path.join(__dirname, '../static'));
	app.set('static_url', '/static/');
	app.set('media', path.join(__dirname, '../media'));
	app.set('view engine', '.hbs');
	app.engine('.hbs', hbs(app).engine);
	app.use(logger('dev'));
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(methodOverride());
	app.use(session(sessionOptions(app)));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(router());
	app.use('/static/', express.static(app.get('static')));
	app.use('/media/', express.static(app.get('media')));
	if (app.get('env') === 'development') {
		app.use(errorHandler());
	}
	return app;
};
