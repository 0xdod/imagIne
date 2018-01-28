const async = require('async');

const sidebar = require('../helpers/sidebar');

const { CommentService, UserService } = require('../services');

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
		images: [],
		sortBy,
		user: req.user,
	};
	switch (sortBy) {
		case 'likes':
			sortOptions = { likes: -1 };
			break;
		default:
			sortOptions = { timestamp: -1 };
			break;
	}
	try {
		const images = await UserService.getMany({
			options: { sort: sortOptions },
		});
		viewModel.images = images;
		async.each(images, setCommentCounts, err => {
			if (err) throw err;
			sidebar(viewModel, viewModel => {
				res.locals.showSidebar = true;
				res.render('index', viewModel);
			});
		});
	} catch (err) {
		console.log(err.stack);
	}
};

module.exports = { index };
