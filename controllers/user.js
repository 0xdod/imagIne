const userService = require('../services/user');

const signup = async (req, res) => {
	try {
		if (req.method === 'POST') {
			await userService.create(req.body);
			console.log('Succesfully created user: ', user);
			res.redirect('/');
			return;
		}
		res.render('signup', {});
	} catch (err) {
		res.status(400).render('error', {
			error: err,
			message: 'Bad request',
		});
	}
};

//TODO use flash message to display login error
const login = async (req, res) => {
	if (req.method === 'POST') {
		if (req.isAuthenticated) {
			var next = req.body.next || '/';
			res.redirect(next);
			return;
		}
	}
	var error =
		req.query.auth === 'false'
			? {
					message: 'Invalid login details, try again',
			  }
			: null;
	var next = req.query.next;
	res.render('login', { error, next });
};

const logout = (req, res) => {
	req.logout();
	res.redirect('/');
};

module.exports = { signup, login, logout };
