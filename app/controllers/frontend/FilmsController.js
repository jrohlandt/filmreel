const logger = require('../../helpers/logger.js');
const film = require('../../models/film');
const categoryModel = require('../../models/category');

module.exports = {

	/*
	|-------------------------------------------------------------------------------
	| INDEX
	|-------------------------------------------------------------------------------
	*/
	async index (req, res) {
		res.render('frontend/films/index', {
			title: 'Films',
			films: await film.getAll(),
			categories: await categoryModel.getAll()
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
			categories: await categoryModel.getAll()
		});
	},

};


