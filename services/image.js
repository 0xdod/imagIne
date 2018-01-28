const { Image } = require('../models');

function ImageService() {
	return this;
}

const defaultFilter = {
	query: {},
	projection: {},
	options: {},
	update: {},
};

ImageService.prototype.get = async function (filter = defaultFilter) {
	const { query, projection, options } = filter;
	return Image.findOne(query, projection, options);
};

ImageService.prototype.getMany = async function (filter = defaultFilter) {
	const { query, projection, options } = filter;
	return await Image.find(query, projection, options);
};

ImageService.prototype.update = async function (filter = defaultFilter) {
	const { query, update, options } = filter;
	return await Image.updateOne(query, update, options);
};

ImageService.prototype.findAndUpdate = async function (filter = defaultFilter) {
	const { query, update, options } = filter;
	return await Image.findOneAndUpdate(query, update, options);
};

ImageService.prototype.delete = async function (filter = defaultFilter) {
	const { query, options } = filter;
	return await Image.deleteOne(query, options);
};

ImageService.prototype.create = async function (image) {
	const newImage = new Image(image);
	return await newImage.save();
};

ImageService.prototype.getModel = function () {
	return Image;
};

module.exports = new ImageService();
