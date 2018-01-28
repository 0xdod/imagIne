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
- add users, password reset, password change password, user profiles. etc
- add dark mode, light mode.
- resize all uploaded images
- Check notes on refactoring and improvements
*/
