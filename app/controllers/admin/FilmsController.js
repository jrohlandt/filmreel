const logger = require('../../helpers/logger.js');
const film = require('../../models/film');
const categoryModel = require('../../models/category');
const fs = require('fs');
const path = require('path');

module.exports = {

	/*
	|-------------------------------------------------------------------------------
	| INDEX
	|-------------------------------------------------------------------------------
	*/
	index (req, res) {
		async function getData () {
			var films = film.getAll();
			return {
				title: 'Films',
				films: await films,
				success: req.flash('success'),
				categories: await categoryModel.getAll()
			};
		}

		return getData()
			.then(data => {
				res.render('admin/films/index', data);
			})
			.catch(error => {
				logger.logError(error); // todo change logger appendsync function to use async version
				req.flash('error', 'a Server error occurred, please contact support.');
				return res.redirect('back');
			});
	},

	/*
	|-------------------------------------------------------------------------------
	| CREATE
	|-------------------------------------------------------------------------------
	*/
	create (req, res) {

		async function getData() {
			var formData = req.flash('formData');
			return { 
				title: 'Film - Create', 
				formData: formData.length > 0 ? formData[0] : {},
				error: req.flash('error'),
				validation_errors: req.flash('validation_errors'),
				success: req.flash('success'),
				categories: await categoryModel.getAll()
			};
		}
		
		// console.log('data: ', data);
		return getData()
			.then(data => {
				return res.render('admin/films/create', data);
			})
			.catch(error => {
				logger.logError(error); // todo change logger appendsync function to use async version
				req.flash('error', 'a Server error occurred, please contact support.');
				return res.redirect('back');
			})
	},

	/*
	|-------------------------------------------------------------------------------
	| STORE
	|-------------------------------------------------------------------------------
	*/
	store (req, res) {

		var validationErrors = [];

		// check if image is valid and generate image path and file name
		var posterImagePath = false;
		if (req.files['poster_image']) {
			let file = req.files['poster_image'];
			let ext = getValidExtension(file.mimetype);
			if (!ext) {
				console.log('invalid ext');
				// todo if ext is false then add ivalid image error to validation errors
				validationErrors = validationErrors.concat( { param: 'poster_image', msg: 'Poster image is invalid'} );
			} else {
				posterImagePath = path.join('/', 'images', 'posters', file.uuid + ext);
				var imgDestination = path.join(appRoot, 'public', 'images', 'posters', file.uuid + ext);
			}
		}

		// validate form data
		req.checkBody('title', 'Please enter a title').notEmpty();
		req.checkBody('year', 'Please specify the year the film was released').notEmpty();
		// todo validate categories
		if (req.validationErrors()) {
			validationErrors = validationErrors.concat(req.validationErrors());	
		}
		console.log('valer: ', validationErrors);
		if (validationErrors.length > 0) {
			req.flash('error', 'Please fix the following errors:');
			req.flash('validation_errors', validationErrors);
			req.flash('formData', req.body);
			return res.redirect('back');
		}

		// format data
		var data = { 
			title: req.body.title, 
			year: req.body.year,
			poster_image: posterImagePath ? posterImagePath : path.join('images', 'posters', 'placeholder.png')
		};
		
		// store in database
		return film.create(data)
			.then(result => {
				console.log('film result', result);
				return film.addCategories(result.insertId, req.body.categories)
					.then(result => {
						if (posterImagePath) {
							moveFile(req.files['poster_image'].file, imgDestination);
						}
						req.flash('success', 'film has been created!');
						return res.redirect('/admin/films');
					});
			})
			.catch(error => {
				// console.log(error);
				req.flash('error', 'The film could not be saved.');
				return res.redirect('back');
			});
	}
};

function getValidExtension(mimetype) {
	var mimeTypes = {
		'image/jpeg': '.jpg',
		'image/png': '.png',
		'image/gif': '.gif'
	};
	
	return mimeTypes.hasOwnProperty(mimetype) ? mimeTypes[mimetype] : false;
}

function moveFile(src, dest) {
	
	  let readStream = fs.createReadStream(src);
	
	  readStream.once('error', (err) => {
		console.log(err);
	  });
	
	  readStream.once('end', () => {
		fs.unlinkSync(src);
		// todo also remove the dir fs.rmdir()
		console.log('done copying');
	  });
	
	  readStream.pipe(fs.createWriteStream(dest));
	}
