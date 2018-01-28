var models = require('../models');
var async = require('async');

const attachImage = function (comment, next) {
	models.Image.findOne({ _id: comment.image_id })
		.then(image => {
			comment.image = image;
			next();
		})
		.catch(err => next(err));
};

module.exports = {
	newest: function (callback) {
		models.Comment.find({}, {}, { limit: 5, sort: { timestamp: -1 } }).then(
			comments => {
				async.each(comments, attachImage, err => {
					if (err) throw err;
					callback(err, comments);
				});
			}
		);
	},
};
