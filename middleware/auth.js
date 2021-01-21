module.exports.authorize = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect(`/login?next=${req.originalUrl}`);
	}
};
