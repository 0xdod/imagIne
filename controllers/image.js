const index = (req, res) => {
	const viewModel = {
		title: 'Gopher',
		image: {
			uniqueID: 1,
			title: 'gOPHER',
			description: 'gOPHER',
			filename: 'Sample1.jpg',
			views: 100,
			likes: 1,
			timestamp: Date.now(),
		},
		comments: [
			{
				image_id: '1',
				email: 'email@testing.com',
				name: 'Tester',
				gravatar: 'testingbaby@testo.com',
				comment: 'Testing microphone 1 2 3!',
				timestamp: Date.now(),
			},
			{
				image_id: '1',
				email: 'email@testing.com',
				name: 'Tester',
				gravatar: 'testingbaby@testo.com',
				comment: 'Hello tueh tueh hello!!',
				timestamp: Date.now(),
			},
		],
	};
	res.render('image', viewModel);
};

const create = (req, res) =>{
	res.send('The image:create POST controller');
}

const like = (req, res) =>{
	res.send('The image:like POST controller');
}

const comment = (req, res) =>{
	res.send('The image:comment POST controller');
}

module.exports = {
	index,
	create,
	like,
	comment
};
