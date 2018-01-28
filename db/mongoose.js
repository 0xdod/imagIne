const mongoose = require('mongoose');

const mongouri = process.env.MONGO_URI || 'mongodb://localhost:27017/imaGine';
const dbOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
};

function init() {
	mongoose.connect(mongouri, dbOptions);
	mongoose.connection.on('open', () => console.log('Mongoose connected'));
	return mongoose;
}

function getConnection() {
	return mongoose.connection;
}

module.exports = {
	init,
	getConnection,
	mongoose,
};
