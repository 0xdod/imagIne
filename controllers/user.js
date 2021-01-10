const user = require('../models/user');

const signup = (req, res) => {
	if (req.method == "POST") {
		return
	}
	res.render('signup')
}

const login = (req, res) => {
	if (req.method == "POST") {
		return
	}
	res.render('login')
}

module.exports = {signup, login}