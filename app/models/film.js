var db = require('../../db.js');
var dbTable = 'films';

exports.getAll = function () {
	return new Promise(function (resolve, reject) {
		var sql = `
			SELECT films.id AS id, films.title AS title, films.year AS year, films.poster_image AS poster_image, categories.name AS category 
			FROM ${dbTable}
			LEFT JOIN category_film ON category_film.film_id = films.id 
			LEFT JOIN categories ON categories.id = category_film.category_id
		`;
		db.get().query(sql, function (error, results, fields) {
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

exports.addCategory = function (filmId, categoryId) {
	return new Promise(function (resolve, reject) {
		db.get().query(`INSERT INTO category_film SET ?`, { category_id: categoryId, film_id: filmId }, function (error, results, fields) {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
};
