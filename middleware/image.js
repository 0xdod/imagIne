const fs = require('fs').promises;
const path = require('path');

const imageThumbnail = require('image-thumbnail');
const sizeOf = require('image-size');

exports.checkFile = (req, res, next) => {
	if (!req.file) {
		req.flash('error', 'Error getting file');
		res.redirect('/');
		return;
	}
	next();
};

// req.url = /thumbs/i/filename.jpg?h=whatever&w=whatever
// in production this would not be called.
// filename?q : fileondisk

const thumbsCache = {};

exports.sendThumbnail = async (req, res, next) => {
	var imageFilename = extractImageName(req.url);
	var imagePath = path.join(req.app.get('media'), imageFilename);
	var extname = path.extname(imageFilename);
	var thumbsDir = path.join(req.app.get('media'), 'thumbs');
	if (thumbsCache[path.basename(req.url)]) {
		res.sendFile(path.join(thumbsDir, thumbsCache[path.basename(req.url)]));
		return;
	}
	try {
		var options = buildThumbnailOptionsFromQuery(req.query);
		var thumbnail = await imageThumbnail(imagePath, options);
		var { width, height } = sizeOf(thumbnail);

		var thumbnailFilename = `${path.basename(
			imageFilename,
			extname
		)}_${width}x${height}${extname}`;
		await fs.writeFile(path.join(thumbsDir, thumbnailFilename), thumbnail, {
			flag: 'wx',
		});
		res.sendFile(path.join(thumbsDir, thumbnailFilename));
	} catch (err) {
		if (err.code === 'ENOENT') {
			await fs.mkdir(thumbsDir).then(async () => {
				await fs.writeFile(
					path.join(thumbsDir, thumbnailFilename),
					thumbnail,
					{
						flag: 'wx',
					}
				);
				res.sendFile(path.join(thumbsDir, thumbnailFilename));
			});
		} else if (err.code === 'EEXIST') {
			//pass
			res.sendFile(path.join(thumbsDir, thumbnailFilename));
		} else {
			console.error(err.stack);
			next();
		}
	} finally {
		thumbsCache[path.basename(req.url)] = thumbnailFilename;
	}
};

function extractImageName(url) {
	const basename = path.basename(url);
	const i = basename.indexOf('?');
	return basename.slice(0, i);
}

function buildThumbnailOptionsFromQuery(params) {
	const allOptions = {
		height: Number(params.h),
		percentage: Number(params.p),
		width: Number(params.w),
	};

	const options = {};
	for (let prop in allOptions) {
		if (allOptions[prop]) {
			options[prop] = allOptions[prop];
		}
	}
	return options;
}
