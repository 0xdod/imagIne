const fs = require('fs');
const path = require('path');
const sidebar = require('../helpers/sidebar');
const models = require('../models');
const MD5 = require('md5.js');

const index = (req, res) => {
	const viewModel = {
		title: '',
		image: {},
		comments: [],
	};
	models.Image.findOne({ filename: { $regex: req.params.image_id } })
		.then(image => {
			if (image) {
				image.views = image.views + 1;
				viewModel.image = image;
				viewModel.title = image.title;
				return image.save();
			} else {
				res.redirect('/');
			}
		})
		.then(image => {
			return models.Comment.find(
				{ image_id: image._id },
				{},
				{ sort: { timestamp: 1 } }
			);
		})
		.then(comments => {
			viewModel.comments = comments;
			sidebar(viewModel, viewModel => {
				res.render('image', viewModel);
			});
		})
		.catch(err => console.log(err));
};

const isExtAllowed = ext => {
	const validExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
	return validExts.includes(ext);
};

const create = (req, res) => {
	if (req.file) {
		const saveImageToDisk = () => {
			return new Promise((resolve, reject) => {
				const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
				let imgUrl = '';

				for (let i = 0; i < 6; i++) {
					imgUrl += possible.charAt(
						Math.floor(Math.random() * possible.length)
					);
				}
				//check if name exists in db
				models.Image.find({ filename: imgUrl }).then(images => {
					if (images.length > 0) {
						saveImage();
					} else {
						let tempPath = req.file.path;
						let ext = path
							.extname(req.file.originalname)
							.toLowerCase();
						let targetPath = path.resolve(
							'./public/upload/' + imgUrl + ext
						);

						if (isExtAllowed(ext)) {
							fs.rename(tempPath, targetPath, err => {
								if (err) reject(err);

								const newImg = new models.Image({
									title: req.body.title,
									description: req.body.description,
									filename: imgUrl + ext,
								});
								resolve(newImg);
							});
						} else {
							fs.unlink(tempPath, err => {
								res.json(500, {
									error: 'Only image files are allowed.',
								});
								reject(err);
							});
						}
					}
				});
			});
		};

		saveImageToDisk()
			.then(image => {
				return image.save();
			})
			.then(image => {
				console.log(`Succesfully saved new image: ${image.filename}`);
				res.redirect('/images/' + image.uniqueID);
			})
			.catch(err => {
				console.log(e);
				fs.unlink(req.file.path, () => {});
			});
	}
};

const like = (req, res) => {
	models.Image.findOne({ filename: { $regex: req.params.image_id } })
		.then(image => {
			if (!image) {
				throw new Error('Cannot find image');
			}
			image.likes++;
			return image.save();
		})
		.then(image => {
			if (image) {
				res.json({ likes: image.likes });
			}
		})
		.catch(err => {
			res.json(err);
		});
};

const comment = (req, res) => {
	models.Image.findOne({ filename: { $regex: req.params.image_id } })
		.then(image => {
			if (image) {
				const newComment = new models.Comment(req.body);
				//	newComment.gravatar = md5(newComment.email);
				//remove, use md5
				newComment.gravatar = new MD5()
					.update(newComment.email)
					.digest('hex');
				newComment.image_id = image._id;
				newComment.image = image;
				return newComment.save();
			} else {
				res.redirect('/');
			}
		})
		.then(comment => {
			res.redirect(`/images/${comment.image.uniqueID}#${comment._id}`);
		})
		.catch(err => {
			console.log(err);
		});
};

module.exports = {
	index,
	create,
	like,
	comment,
};
