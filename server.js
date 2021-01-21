const path = require('path');

const express = require('express');

const config = require('./config/server');
const { mongoose } = require('./config/mongoose');

const port = process.env.PORT || 3000;
const app = config(express());

var server = app.listen(port, function () {
	console.log('Listening on port ' + server.address().port);
});

/*TODO
- add users, auth etc
- add dark mode
- resize all uploaded images
- make comment to use AJAX instead of full reloads
- Check notes on refactoring and improvements
*/
