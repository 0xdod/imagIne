const http = require('http');

const app = require('./app');
const db = require('./db');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

db.init();

var listener = server.listen(port, function () {
	console.log('Listening on port ' + listener.address().port);
});

/*TODO
- add users, auth etc
- add dark mode
- resize all uploaded images
- make comment to use AJAX instead of full reloads
- Check notes on refactoring and improvements
*/
