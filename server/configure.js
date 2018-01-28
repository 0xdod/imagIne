const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expSession = require('express-session');
const mongoStore = require('connect-mongo');
const logger = require('morgan');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');
const moment = require('moment');
const passport = require('passport');

const routes = require('./routes');

var blocks = {};

const hbs = app =>
	exphbs.create({
		extname: '.hbs',
		defaultLayout: 'main',
		layoutsDir: app.get('views') + '/layouts',
		partialsDir: [app.get('views') + '/partials'],
		runtimeOptions: {
			allowProtoPropertiesByDefault: true,
			allowProtoMethodsByDefault: true,
		},
		helpers: {
			block: function (name) {
				var val = (blocks[name] || []).join('\n');
				blocks[name] = [];
				return val;
			},
			eq: (a, b) => a === b,
			extend: function (name, options) {
				var block = blocks[name];
				if (!block) {
					block = blocks[name] = [];
				}
				block.push(options.fn(this));
			},
			timeago: ts => moment(ts).startOf('minute').fromNow(),
			print: a => {
				console.log(a);
			},
		},
	});

module.exports = app => {
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', '.hbs');
	app.engine('.hbs', hbs(app).engine);

	app.use(logger('dev'));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(expSession({ secret: 'some-secret-value-here' }));
	app.use(passport.initialize());
	app.use(passport.session());
	routes(app);
	app.use('/public/', express.static(path.join(__dirname, '../public')));
	if ('development' === app.get('env')) {
		app.use(errorHandler());
	}
	return app;
};
