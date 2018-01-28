const { Comment } = require('../models');

function CommentService() {
	return this;
}

const defaultFilter = {
	query: {},
	projection: {},
	options: {},
	update: {},
};

CommentService.prototype.get = async function (filter = defaultFilter) {
	const { query, projection, options } = filter;
	return Comment.findOne(query, projection, options);
};

CommentService.prototype.getMany = async function (filter = defaultFilter) {
	const { query, projection, options } = filter;
	return await Comment.find(query, projection, options);
};

CommentService.prototype.update = async function (filter = defaultFilter) {
	const { query, update, options } = filter;
	return await Comment.updateOne(query, update, options);
};

CommentService.prototype.delete = async function (filter = defaultFilter) {
	const { query, options } = filter;
	return await Comment.deleteOne(query, options);
};

CommentService.prototype.create = async function (comment) {
	const newComment = new Comment(comment);
	return await newComment.save();
};

CommentService.prototype.getModel = function () {
	return Comment;
};

module.exports = new CommentService();
