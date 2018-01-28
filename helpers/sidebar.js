var Stats = require('./stats')
var Images = require('./images')
var Comments = require('./comments')

module.exports = (viewModel, callback) =>{
	viewModel.sidebar = {
		stats: Stats(),
		popular: Images.popular(),
		comments: Comments.newest()
	}
	callback(viewModel)
} 