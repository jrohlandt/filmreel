const logger = require('../../helpers/logger.js');
const film = require('../../models/film');
const categoryModel = require('../../models/category');

module.exports = {

	/*
	|-------------------------------------------------------------------------------
	| INDEX
	|-------------------------------------------------------------------------------
	*/
	index (req, res) {
		async function getData () {
			try {
				var data = {
					title: 'Films',
					films: await film.getAll(),
					categories: await categoryModel.getAll()
				};
			} catch(e) {
				console.log(e);
				logger.logError(e);
			}
			
			res.render('frontend/films/index', data);
		}

		return getData();
	},

	/*
	|-------------------------------------------------------------------------------
	| BY CATEGORY
	|-------------------------------------------------------------------------------
	*/
	byCategory (req, res) {
		async function getData () {
			try {
				var data = {
					title: 'Films',
					films: await film.getByCategory(req.params.categoryName),
					categories: await categoryModel.getAll()
				};
			} catch(e) {
				console.log(e);
			}

			res.render('frontend/films/index', data);
		}

		return getData();
	},

};


