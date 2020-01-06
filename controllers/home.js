const async = require('async');

const sidebar = require('../helpers/sidebar');
const Image = require('../models').Image;
const Comment = require('../models').Comment;

const setCommentCounts = function (image, next) {
	Comment.countDocuments({ image_id: image._id }, (err, counts) => {
		image.commentsCount = counts;
		next();
	}).catch(err => next(err));
};

const index = (req, res) => {
	const viewModel = {
		title: 'Home | imaGine.io',
		images: [],
	};
	let sortBy = req.query.sort
	Image.find({}, {}, { sort: { timestamp: -1 } })
		.then(images => {
			viewModel.images = images;
			async.each(images, setCommentCounts, err => {
				if (err) throw err;
				sidebar(viewModel, viewModel => {
					res.render('index', viewModel);
				});
			});
		})
		.catch(err => console.log(err));
};

module.exports = { index };
