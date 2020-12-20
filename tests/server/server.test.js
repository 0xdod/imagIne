var proxyquire,
	expressStub,
	configStub,
	mongooseStub,
	app,
	server = function () {
		proxyquire('../../server', {
			express: expressStub,
			'./server/configure': configStub,
			mongoose: mongooseStub,
		});
	};

describe('Server', () => {
	beforeEach(() => {
		(proxyquire = require('proxyquire')),
			(app = {
				set: sinon.spy(),
				get: sinon.stub().returns(3000),
				listen: sinon.spy(),
			}),
			(expressStub = sinon.stub().returns(app)),
			(configStub = sinon.stub().returns(app)),
			(mongooseStub = {
				connect: sinon.spy(),
				connection: {
					on: sinon.spy(),
				},
			});
		delete process.env.PORT;
	});
	// to do: write tests...

	describe('Bootstrapping', function () {
		it('should create the app', function () {
			server();
			expect(expressStub).to.be.called;
		});
		it('should set the views', function () {
			server();
			expect(app.set.firstCall.args[0]).to.equal('views');
		});
	});
	it('should configure the app', function () {
		server();
		expect(configStub).to.be.calledWith(app);
	});
	it('should connect with mongoose', function () {
		server();
		expect(mongooseStub.connect).to.be.calledWith(sinon.match.string);
	});
	it('should launch the app', function () {
		server();
		expect(app.listen).to.be.calledWith(3000, sinon.match.func);
	});
});
