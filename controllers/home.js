const async = require('async');

const sidebar = require('../helpers/sidebar');

const { CommentService, ImageService } = require('../services');

const setCommentCounts = function (image, next) {
	CommentService.getModel()
		.countDocuments({ image_id: image._id }, (err, counts) => {
			image.commentsCount = counts;
			next();
		})
		.catch(err => next(err));
};

const index = async (req, res) => {
	let sortBy = req.query.sort;
	const viewModel = {
		title: 'Home | imaGine.io',
		sortBy,
	};
	switch (sortBy) {
		case 'likes':
			sortOptions = { likesCount: -1 };
			break;
		default:
			sortOptions = { timestamp: -1 };
			break;
	}
	try {
		const images = await ImageService.getMany({
			options: { sort: sortOptions },
		});
		viewModel.images = images;
		async.each(images, setCommentCounts, err => {
			if (err) throw err;
			sidebar(viewModel, viewModel => {
				res.render('index', viewModel);
			});
		});
	} catch (err) {
		console.log(err.stack);
	}
};

module.exports = { index };
