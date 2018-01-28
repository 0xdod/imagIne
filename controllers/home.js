const index = (req, res) => {
	const viewModel = {
		title: 'Home | imaGine.io',
		images: [
			{
				uniqueID: 1,
				title: 'Image 1',
				description: 'A Sample image',
				filename: 'Sample1.jpg',
				views: '10',
				likes: '1',
				timestamp: Date.now(),
			},
			{
				uniqueID: 2,
				title: 'Image 2',
				description: 'Another Sample image',
				filename: 'Sample2.jpg',
				views: 10,
				likes: '1',
				timestamp: Date.now(),
			},
			{
				uniqueID: 3,
				title: 'Image 3',
				description: 'Yet another Sample image',
				filename: 'Sample3.jpg',
				views: 10,
				likes: 1,
				timestamp: Date.now(),
			},
				{
				uniqueID: 1,
				title: 'Image 1',
				description: 'A Sample image',
				filename: 'Sample1.jpg',
				views: '10',
				likes: '1',
				timestamp: Date.now(),
			},
		],
	};
	res.render('index', viewModel);
};

module.exports = { index };
