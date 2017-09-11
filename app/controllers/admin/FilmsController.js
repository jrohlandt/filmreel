const logger = require('../../helpers/logger.js');
const film = require('../../models/film');

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
				success: req.flash('success')
				// categories: await categories.getAll()
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
		
		var formData = req.flash('formData');
		// console.log('formdata', formData);
		var data = { 
			title: 'Film - Create', 
			formData: formData.length > 0 ? formData[0] : {},
			error: req.flash('error'),
			validation_errors: req.flash('validation_errors'),
			success: req.flash('success')
		};
		// console.log('data: ', data);
		return res.render('admin/films/create', data);
	},

	/*
	|-------------------------------------------------------------------------------
	| STORE
	|-------------------------------------------------------------------------------
	*/
	store (req, res) {

		// validate form data
		req.checkBody('title', 'Please enter a title').notEmpty();
		req.checkBody('year', 'Please specify the year the film was released').notEmpty();
	
		if (req.validationErrors()) {
			req.flash('error', 'Please fix the following errors:');
			req.flash('validation_errors', req.validationErrors());
			req.flash('formData', req.body);
			return res.redirect('back');
		}

		// format data
		var data = { 
			title: req.body.title, 
			year: req.body.year
		};
		
		// store in database
		return film.create(data)
			.then(result => {
				req.flash('success', 'film has been created!');
				return res.redirect('/admin/films');
			})
			.catch(error => {
				console.log(error);
				req.flash('error', 'The film could not be saved.');
				return res.redirect('back');
			});
	}

};
