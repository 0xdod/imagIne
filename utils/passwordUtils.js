const bcrypt = require('bcrypt');
const saltRounds = 10;

//used during signup
module.exports.generatePasswordHash = password => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(saltRounds, function (err, salt) {
			bcrypt.hash(password, salt, function (err, hash) {
				if (err) {
					reject(err);
				} else {
					resolve(hash);
				}
			});
		});
	});
};

//used during login
module.exports.validatePassword = (password, hash) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, hash, (err, res) => {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	});
};
