const path = require('path');

const router = require('express').Router(),
	multer = require('multer');

const image = require('../controllers/image'),
	{ authorize } = require('../middleware/auth'),
	{ checkFile, sendThumbnail } = require('../middleware/image');

const uploads = multer({ dest: path.join(__dirname, '../media') });

module.exports = () => {
	router.use('/thumbs/i/', sendThumbnail);
	router.get('/', image.create);
	router.get('/:image_id', image.detail);
	router.use(authorize);
	router.post('/', uploads.single('file'), checkFile, image.create);
	router.post('/:image_id/like', image.like);
	router.post('/:image_id/comment', image.comment);
	router.delete('/:image_id', image.remove);
	return router;
};
