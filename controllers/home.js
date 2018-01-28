const sidebar = require('../helpers/sidebar');
const Image = require('../models').Image;

const index = (req, res) => {
	const viewModel = {
		title: 'Home | imaGine.io',
		images: [],
	};

	Image.find({}, {}, { sort: { timestamp: -1 } })
		.then(images => {
			viewModel.images = images;
			sidebar(viewModel, viewModel => {
				res.render('index', viewModel);
			});
		})
		.catch(err => console.log(err));
};

module.exports = { index };
