const logger = require('../../helpers/logger.js');
const filmModel = require('../../models/film');
const categoryModel = require('../../models/category');
const fs = require('fs');
const path = require('path');

module.exports = {

	/*
	|-------------------------------------------------------------------------------
	| INDEX
	|-------------------------------------------------------------------------------
	*/
	async index (req, res) {
		res.render('admin/films/index', {
			title: 'Films',
			films: await filmModel.getAll(),
			success: req.flash('success'),
			categories: await categoryModel.getAll(),
			totalFilmCount: await filmModel.countAll()
		});
	},

	/*
	|-------------------------------------------------------------------------------
	| CREATE
	|-------------------------------------------------------------------------------
	*/
	async create (req, res) {
		var formData = req.flash('formData');
		res.render('admin/films/create', { 
			csrfToken: req.csrfToken(),
			title: 'Film - Create', 
			formData: formData.length > 0 ? formData[0] : {},
			error: req.flash('error'),
			validation_errors: req.flash('validation_errors'),
			success: req.flash('success'),
			categories: await categoryModel.getAll()
		});
	},

	/*
	|-------------------------------------------------------------------------------
	| STORE
	|-------------------------------------------------------------------------------
	*/
	async store (req, res) {

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
		// todo validate duration
		// todo validate description
		// todo validate categories
		if (req.validationErrors()) {
			validationErrors = validationErrors.concat(req.validationErrors());	
		}

		if (validationErrors.length > 0) {
			req.flash('error', 'Please fix the following errors:');
			req.flash('validation_errors', validationErrors);
			req.flash('formData', req.body);
			return res.redirect('back');
		}

		try {
			// format data
			var data = { 
				title: req.body.title, 
				year: req.body.year,
				poster_image: posterImagePath ? posterImagePath : path.join('/', 'images', 'posters', 'placeholder.png'),
				duration: req.body.duration ? req.body.duration : 0,
				description: req.body.description
			};

			// store in database
			var result = await filmModel.create(data);
			if (req.body.categories !== undefined) {
				await filmModel.addCategories(result.insertId, req.body.categories);
			}

			if (posterImagePath) {
				// this uses event emitter (stream) (todo research how to best handle)
				// https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/#usinges7asyncawait
				// Event emitters (like streams) can still cause uncaught exceptions. So make sure you are handling the error event properly.
				moveFile(req.files['poster_image'].file, imgDestination);
			}

			req.flash('success', 'film has been created!');
			res.redirect('/admin/films');

		} catch (err) {
			logger.logError(err);
			req.flash('formData', req.body);
			req.flash('error', 'The film could not be saved.');
			return res.redirect('back');
		}
		
	},

	/*
	|-------------------------------------------------------------------------------
	| EDIT
	|-------------------------------------------------------------------------------
	*/
	async edit (req, res) {

		// TODO CSRF FOR ALL FORMS IN APP (INCLUDING LOGIN PAGE)
		var film = await filmModel.find(req.params.filmId);

		if (film.length < 1) {
			req.flash('error', 'The film could not be found.');
			return res.redirect('/admin/films');
		}

		var formData = req.flash('formData');
		if (formData.length > 0) {
			formData = formData[0];
			// solve body-parser issue/baviour
			// todo research why form array (categories[]) behaves like this.
			if (formData.categories === undefined) {
				formData.categories = [];
			} else {
				formData.categories = formData.categories.map((item) => parseInt(item)); // then just parse to int
				console.log('FORMDATA: ', formData, formData.year, formData.categories);
			}
		} else {
			let categories = await filmModel.getCategories(film.id);
			formData = {...film, categories};
		}

		var data = { 
			csrfToken: req.csrfToken(),
			title: 'Film - Edit', 
			formData,
			error: req.flash('error'),
			validation_errors: req.flash('validation_errors'),
			success: req.flash('success'),
			allCategories: await categoryModel.getAll(),
		};
		// console.log(data); return;
		res.render('admin/films/edit', data);

	},

		/*
	|-------------------------------------------------------------------------------
	| UPDATE
	|-------------------------------------------------------------------------------
	*/
	async update (req, res) {
		
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
		// todo validate duration
		// todo validate description
		// todo validate categories
		if (req.validationErrors()) {
			validationErrors = validationErrors.concat(req.validationErrors());	
		}

		if (validationErrors.length > 0) {
			req.flash('error', 'Please fix the following errors:');
			req.flash('validation_errors', validationErrors);
			req.flash('formData', req.body);
			return res.redirect('back');
		}

		// todo check that id is numeric
		var film = await filmModel.find(req.body.id);
		
		if (film.length < 1) {
			req.flash('error', 'The film could not be found');			
			req.flash('formData', req.body);
			return res.redirect('back');
		}

		try {
			// format data
			var data = { 
				title: req.body.title, 
				year: req.body.year,
				duration: req.body.duration ? req.body.duration : 0,
				description: req.body.description
			};

			if (posterImagePath) {
				data.poster_image = posterImagePath;
			}

			// store in database
			var result = await filmModel.update(film.id, data);
			await filmModel.removeCategories(film.id);
			if (req.body.categories !== undefined) {
				await filmModel.addCategories(film.id, req.body.categories);			
			}

			if (posterImagePath) {
				// this uses event emitter (stream) (todo research how to best handle)
				// https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/#usinges7asyncawait
				// Event emitters (like streams) can still cause uncaught exceptions. So make sure you are handling the error event properly.
				moveFile(req.files['poster_image'].file, imgDestination);
			}

			req.flash('success', 'film has been updated!');
			res.redirect('/admin/films');

		} catch (err) {
			logger.logError(err);
			req.flash('formData', req.body);
			req.flash('error', 'The film could not be saved.');
			return res.redirect('back');
		}
		
	},

	/*
	|-------------------------------------------------------------------------------
	| DELETE
	|-------------------------------------------------------------------------------
	*/
	async delete (req, res) {
		var film = await filmModel.find(req.body.id);
		
		if (film.length < 1) {
			req.flash('error', 'The film could not be found');			
			req.flash('formData', req.body);
			return res.redirect('back');
		}

		try {
			// format data
			var data = { 
				title: req.body.title, 
				year: req.body.year,
			};

			// delete film
			var result = await filmModel.delete(film.id);
			await filmModel.removeCategories(film.id);

			req.flash('success', `film ${film.title} has been deleted!`);
			res.redirect('/admin/films');

		} catch (err) {
			logger.logError(err);
			req.flash('formData', req.body);
			req.flash('error', 'The film could not be deleted.');
			return res.redirect('back');
		}
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
