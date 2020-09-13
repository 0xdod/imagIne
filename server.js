const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const config = require('./server/configure');

const port = process.env.PORT || 3000;
let app = express();

app = config(app);
mongoose.connect(
	process.env.MONGOLAB_AMBER_URI || 'mongodb://localhost:27017/imaGine',
	{
		useNewUrlParser: true,
	}
);
mongoose.connection.on('open', () => console.log('Mongoose connected'));

app.listen(port, () => console.log(`Server running on localhost:${port}`));

/*TODO
- add users, auth etc
- add dark mode
- resize all uploaded images
- make comment to use AJAX instead of full reloads
- update dependencies: MD5, async
- Check notes on refactoring and improvements
*/
