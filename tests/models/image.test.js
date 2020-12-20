var ImageModel = require('../../models/image');

describe('Image Model', () => {
	var image;
	it('should have a mongoose schema', function () {
		expect(ImageModel.schema).not.to.be.undefined;
	});

	beforeEach(() => {
		image = new ImageModel({
			title: 'Test',
			description: 'Testing',
			filename: 'testfile.jpg',
		});
	});
	// to do: write tests...

	describe('Schema', function () {
		it('should have a title string', function () {
			expect(image.title).not.to.be.undefined;
		});
		it('should have a description string', function () {
			expect(image.description).not.to.be.undefined;
		});
		it('should have a filename string', function () {
			expect(image.filename).not.to.be.undefined;
		});
		it('should have a views number default to 0', function () {
			expect(image.views).not.to.be.undefined;
			expect(image.views).to.equal(0);
		});
		it('should have a likes number default to 0', function () {
			expect(image.likes).not.to.be.undefined;
			expect(image.likes).to.equal(0);
		});
		it('should have a timestamp date', function () {
			expect(image.timestamp).not.to.be.undefined;
		});
	});

	describe('Virtuals', function () {
		describe('uniqueId', function () {
			it('should be defined', function () {
				expect(image.uniqueID).not.to.be.undefined;
			});
			it('should get filename without extension', function () {
				expect(image.uniqueID).to.equal('testfile');
			});
		});
	});
});
