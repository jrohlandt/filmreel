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
			title: 'Films',
			films: await film.getAll({limit}),
			categories: await categoryModel.getAll(),
			offset: offsetIncrement
		});
	},

	/*
	|-------------------------------------------------------------------------------
	| BY CATEGORY
	|-------------------------------------------------------------------------------
	*/
	async byCategory (req, res) {
		res.render('frontend/films/index', {
			title: 'Films',
			films: await film.getByCategory(req.params.categoryName),
			categories: await categoryModel.getAll(),
			category: req.params.categoryName
		});
	},

	/*
	|-------------------------------------------------------------------------------
	| GET MORE
	|-------------------------------------------------------------------------------
	*/
	async getMore(req, res) {
		var offset = parseInt(req.params.offset);
		res.json({
			offsetIncrement,
			newOffset: offset + offsetIncrement,
			filmCount: await film.countAll(),
			films: await film.getAll({
				limit, 
				offset 
			})
		});
	}

};


