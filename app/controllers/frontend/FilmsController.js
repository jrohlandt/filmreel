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
		
		var offset = req.body.offset !== undefined ? parseInt(req.body.offset) : 0;	
		// todo sanitize these
		var category = (req.body.category !== undefined && req.body.category !== 'none') 
			? req.body.category 
			: false;
		var year = req.body.year !== undefined ? req.body.year : false;

		// if (category === false && year === false) {
		// 	filmCount = await film.countAll();
		// 	films = await film.getAll({
		// 		limit, 
		// 		offset 
		// 	});
		// } else {
		// 	filmCount = await film.countAll();
		// 	films = await film.getAll({
		// 		limit, 
		// 		offset 
		// 	});
		// }
		
		res.json({
			offsetIncrement,
			newOffset: offset + offsetIncrement,
			filmCount: await film.countFiltered({
				category,
				year 
			}),
			films: await film.getFiltered({
				category,
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
		var offset = req.body.offset !== undefined ? parseInt(req.body.offset) : 0;			
		var searchTerm = (req.body.search_term !== undefined && req.body.search_term.length > 2)
			? req.body.search_term 
			: false;
		// return res.json({'message': 'success', 'searchTerm': searchTerm});
		
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


