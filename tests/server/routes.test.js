var proxyquire = require('proxyquire');
var home = require('../../controllers/home'),
	image = require('../../controllers/image');

var app = {
	use: sinon.spy(),
};

var expressStub = {
	Router: () => ({
		get: sinon.spy(),
		post: sinon.spy(),
		delete: sinon.spy(),
		put: sinon.spy(),
	}),
};

var routes = proxyquire('../../server/routes', {
	express: expressStub,
});

describe('Routes', () => {
	// var app = {
	// 	get: sinon.spy(),
	// 	post: sinon.spy(),
	// 	delete: sinon.spy(),
	// };
	var router = expressStub.Router();
	beforeEach(() => {
		routes(app);
	});

	// todo: write tests...
	describe('GETs', () => {
		it('should handle /', () => {
			expect(router.get).to.be.calledWith('/', home.index);
		});

		it('should handle /images/:image_id', () => {
			expect(router.get).to.be.calledWith(
				'/images/:image_id',
				image.index
			);
		});
	});

	describe('POSTs', () => {
		it('should handle /images', () => {
			expect(router.post).to.be.calledWith('/images', image.create);
		});

		it('should handle /images/:image_id/like', () => {
			expect(router.post).to.be.calledWith(
				'/images/:image_id/like',
				image.like
			);
		});

		it('should handle /images/:image_id/comment', () => {
			expect(router.post).to.be.calledWith(
				'/images/:image_id/comment',
				image.comment
			);
		});
	});

	describe('DELETEs', () => {
		it('should handle /images/:image_id', () => {
			expect(router.delete).to.be.calledWith(
				'/images/:image_id',
				image.remove
			);
		});
	});
});
