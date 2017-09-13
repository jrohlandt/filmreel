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
				// categories: await categories.getAll()
			};
		}

		return getData()
			.then(data => {
				res.render('frontend/films/index', data);
			})
			.catch(error => {
				logger.logError(error); // todo change logger appendsync function to use async version
				// req.flash('error', 'a Server error occurred, please contact support.');
				// return res.redirect('back');
			});
	},

};


