const path = require('path');

const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const logger = require('morgan');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);

const passport = require('./config/passport');
const hbs = require('./config/hbs');
const router = require('./routes');

const connection = require('./db').getConnection();

const mongoStore = new MongoStore({
	mongooseConnection: connection,
	collection: 'sessions',
});

const app = express();

const sessionOptions = app => {
	const secret = process.env.SESSION_SECRET || 'some-secret-value-here';
	const opts = {
		secret,
		name: 'session.id',
		resave: false,
		saveUninitialized: true,
		store: mongoStore,
		cookie: {
			maxAge: 14 * 1000 * 60 * 60 * 24,
		},
	};
	if (app.get('env') === 'production') {
		opts.cookie.secure = true;
		//opts.cookie.domain = 'imagepload.herokuapp.com';
	}
	return opts;
};

//----- Application settings----------------
app.set('views', path.join(__dirname, '/views/'));
app.set('static', path.join(__dirname, '/static/'));
app.set('static_url', '/static/');
app.set('media', path.join(__dirname, '/media/'));
app.set('view engine', '.hbs');
app.engine('.hbs', hbs.setup(app).engine);

//-------Middlewares-------------------------
app.use(logger('dev'));
if (app.get('env') === 'production') {
	app.set('trust proxy', 1);
	app.use(helmet());
	app.disable('x-powered-by');
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride());
app.use(session(sessionOptions(app)));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// useful for accessing user object in template
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});
app.use((req, res, next) => {
	res.locals.messages = req.flash();
	next();
});
app.use(router());
app.use('/static/', express.static(app.get('static')));
app.use('/media/', express.static(app.get('media')));
if (app.get('env') === 'development') {
	app.use(errorHandler());
}

// 404 - errors
app.use((req, res, next) => {
	res.locals.hideSidebar = true;
	res.status(404).render('404');
});

app.use((error, req, res, next) => {
	res.locals.hideSidebar = true;
	res.status(500).render('error', { error });
});
module.exports = app;
