const { UserService } = require('../services/');

const signup = async (req, res) => {
	try {
		if (req.method === 'POST') {
			const user = await UserService.create(req.body);
			console.log('Succesfully created user: ', user);
			req.flash('success', 'Account created, enter your login details.');
			res.redirect('/login');
			return;
		}
		res.locals.hideSidebar = true;
		res.render('signup', {});
	} catch (err) {
		req.flash('error', `Cannot create new account because ${err.message}.`);
		res.redirect('/signup');
	}
};

const login = async (req, res) => {
	if (req.method === 'POST') {
		if (req.isAuthenticated()) {
			var next = req.body.next || '/';
			req.flash('success', `Welcome ${req.user.username}`);
			res.redirect(next);
			return;
		}
	}

	var next = req.query.next;
	res.locals.hideSidebar = true;
	res.render('login', { next });
};

const logout = (req, res) => {
	req.logout();
	res.redirect('/');
};

module.exports = { signup, login, logout };
