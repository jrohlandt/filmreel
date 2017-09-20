var db = require('../../db.js');
var dbTable = 'films';

exports.getAll = function () {
	return new Promise(function (resolve, reject) {
		var sql = `
			SELECT f.id, f.title, f.year, f.poster_image, GROUP_CONCAT(c.name SEPARATOR ' ' ) AS categories 
			FROM films AS f
			LEFT JOIN category_film AS cf ON cf.film_id = f.id 
			LEFT JOIN categories AS c ON c.id = cf.category_id 
			GROUP BY f.id;
		`;
		db.get().query(sql, function (error, results, fields) {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
};

exports.getByCategory = function (categoryName) {
	return new Promise(function (resolve, reject) {
		var sql = `
			SELECT f.id, f.title, f.year, f.poster_image, GROUP_CONCAT(c.name SEPARATOR ' ' ) AS categories 
			FROM films AS f
			LEFT JOIN category_film AS cf ON cf.film_id = f.id 
			LEFT JOIN categories AS c ON c.id = cf.category_id 
			WHERE c.name = ?  
			GROUP BY f.id;
		`;
		db.get().query(sql, [categoryName], function (error, results, fields) {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
};

exports.create = function (data) {
	return new Promise(function (resolve, reject) {
		db.get().query(`INSERT INTO ${dbTable} SET ?`, data, function (error, results, fields) {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
};

exports.addCategories = function (filmId, categoryIds) {

	var ids = categoryIds.map((catId) => {
		return [catId, filmId];
	});

	return new Promise(function (resolve, reject) {
		db.get().query(`INSERT INTO category_film (category_id, film_id) VALUES ?`, [ids], function (error, results, fields) {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
};
