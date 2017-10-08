const logger = require('../../helpers/logger.js');
const film = require('../../models/film');
const categoryModel = require('../../models/category');
const limit = 10;
const offsetIncrement = 10;

module.exports = {

	/*
	|-------------------------------------------------------------------------------
	| INDEX
	|-------------------------------------------------------------------------------
	*/
	async index (req, res) {
		res.render('frontend/films/index', {
			csrfToken: req.csrfToken(),
			title: 'Films',
			films: await film.getAll({limit}),
			categories: await categoryModel.getAll(),
			offset: offsetIncrement,
			showSearch: true
		});
	},

	/*
	|-------------------------------------------------------------------------------
	| BY CATEGORY
	|-------------------------------------------------------------------------------
	*/
	// async byCategory (req, res) {
	// 	res.render('frontend/films/index', {
	// 		title: 'Films',
	// 		films: await film.getByCategory(req.params.categoryName),
	// 		categories: await categoryModel.getAll(),
	// 		category: req.params.categoryName
	// 	});
	// },

	/*
	|-------------------------------------------------------------------------------
	| GET MORE
	|-------------------------------------------------------------------------------
	*/
	// async getMore(req, res) {
	// 	var offset = parseInt(req.params.offset);
	// 	res.json({
	// 		offsetIncrement,
	// 		newOffset: offset + offsetIncrement,
	// 		filmCount: await film.countAll(),
	// 		films: await film.getAll({
	// 			limit, 
	// 			offset 
	// 		})
	// 	});
	// }

	async getMore(req, res) {
		
		// validate post data
		req.checkBody('category', 'No message').isInt();
		req.checkBody('offset', 'No message').isInt();
		// req.checkBody('year', 'No message').isInt();
		if (req.validationErrors()) {
			return res.status(500);
		}

		var offset = parseInt(req.body.offset);
		var categoryId = req.body.category == 0 ? false : parseInt(req.body.category);
		var year = false;
		
		res.json({
			offsetIncrement,
			newOffset: offset + offsetIncrement,
			filmCount: await film.countFiltered({
				categoryId,
				year 
			}),
			films: await film.getFiltered({
				categoryId,
				year,
				limit, 
				offset 
			})
		});
	},

	/*
	|-------------------------------------------------------------------------------
	| QUICK SEARCH
	|-------------------------------------------------------------------------------
	*/
	async quickSearch(req, res) {

		req.checkBody('offset', 'No message').isInt();
		req.checkBody('search_term', 'No message').isAlphanumeric().isLength({min: 3, max: 30});
		// req.checkBody('year', 'No message').isInt();
		if (req.validationErrors()) {
			// if validation fails, just return a empty film array
			return res.json({
				offsetIncrement,
				newOffset: 0,
				filmCount: 0,
				films: []
			});
		}

		var offset = parseInt(req.body.offset);			
		var searchTerm = req.body.search_term;
		
		res.json({
			offsetIncrement,
			newOffset: offset + offsetIncrement,
			filmCount: await film.countQuickSearch({
				searchTerm
			}),
			films: await film.getQuickSearch({
				searchTerm,
				limit, 
				offset 
			})
		});
	}

};


