const models = require('../models');
const async = require('async');

module.exports = {
	popular: callback => {
		models.Image.find({}, {}, { limit: 9, sort: { likes: -1 } })
			.then(images => {
				callback(null, images);
			})
			.catch(err => callback(err));
	},
};