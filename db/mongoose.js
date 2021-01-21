const mongoose = require('mongoose');

const mongouri = process.env.MONGO_URI || 'mongodb://localhost:27017/imaGine';
const dbOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
};

mongoose.connect(mongouri, dbOptions);
mongoose.connection.on('open', () => console.log('Mongoose connected'));

module.exports = mongoose;
