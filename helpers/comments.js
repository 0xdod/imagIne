module.exports = {
	newest: function () {
		var comments = [
			{
				image_id: '1',
				email: 'email@testing.com',
				name: 'Tester',
				gravatar: 'testingbaby@testo.com',
				comment: 'Testing microphone 1 2 3!',
				timestamp: Date.now(),
				image: {
					uniqueID: 1,
					title: 'gOPHER',
					description: 'gOPHER',
					filename: 'Sample1.jpg',
					views: 100,
					likes: 1,
					timestamp: Date.now(),
				},
			},
			{
				image_id: '1',
				email: 'email@testing.com',
				name: 'Tester',
				gravatar: 'testingbaby@testo.com',
				comment: 'Hello tueh tueh hello!!',
				timestamp: Date.now(),
				image: {
					uniqueID: 1,
					title: 'gOPHER',
					description: 'gOPHER',
					filename: 'Sample1.jpg',
					views: 100,
					likes: 1,
					timestamp: Date.now(),
				},
			},
		];

		return comments;
	},
};
