var db = require('../../db.js');
var dbTable = 'films';

exports.countAll = function () {
	return new Promise(function (resolve, reject) {
		var sql = 'SELECT COUNT(id) AS count FROM films';

		db.get().query(sql, function (error, results, fields) {
			if (error) {
				reject(error);
			}

			if (results[0] !== undefined) {
				resolve(results[0]['count']);
			} else {
				resolve(0);
			}
		});
	});
}


exports.getAll = function (options = {}) {
	var limit = 100;
	var offset = 0;
	if (options.limit !== undefined) {
		limit = options.limit;
	}

	if (options.offset !== undefined) {
		offset = options.offset;
	}
	return new Promise(function (resolve, reject) {
		var sql = `
			SELECT f.id, f.title, f.year, f.poster_image, f.duration, f.description, GROUP_CONCAT(c.name SEPARATOR ' ' ) AS categories 
			FROM films AS f
			LEFT JOIN category_film AS cf ON cf.film_id = f.id 
			LEFT JOIN categories AS c ON c.id = cf.category_id 
			GROUP BY f.id 
			LIMIT ? 
			OFFSET ?;
		`;
		db.get().query(sql, [limit, offset], function (error, results, fields) {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
};

exports.find = function (filmId) {
	return new Promise(function(resolve, reject) {
		var sql = `
			SELECT f.id, f.title, f.year, f.poster_image, f.duration, f.description 
			FROM films AS f 
			WHERE id = ? 
			LIMIT 1;
		`;
		db.get().query(sql, [filmId], function (error, result) {
			if (error) {
				reject(error);
				// todo return function here, check all promises in this project
			}

			if (result[0] === undefined) {
				resolve(result);
			} else {
				resolve(result[0]);
			}
		});	
	});
}

exports.getCategories = function (filmId) {
	return new Promise(function(resolve, reject) {
		var sql = `
			SELECT DISTINCT category_id 
			FROM category_film  
			WHERE film_id = ?
		`;
		db.get().query(sql, [filmId], function (error, results) {
			if (error) {
				reject(error);
			}

			if (results[0] === undefined) {
				resolve([]);
			} else {
				resolve(results.map((obj) => obj.category_id));
			}
			
		});	
	});
}

exports.getFiltered = function (options) {
	var limit = 100;
	var offset = 0;
	if (options.limit !== undefined) {
		limit = options.limit;
	}

	if (options.offset !== undefined) {
		offset = options.offset;
	}

	var sqlOptions = [limit, offset];
	// if (options.year) {
	// 	sqlOptions.unshift(options.year);
	// } 
	if (options.categoryId) {
		sqlOptions.unshift(options.categoryId);
	}

	return new Promise(function (resolve, reject) {
		var sql = 'SELECT f.id, f.title, f.year, f.poster_image, f.duration, f.description, GROUP_CONCAT(c.name SEPARATOR " " ) AS categories ';
			sql += 'FROM films AS f ';
			sql += 'LEFT JOIN category_film AS cf ON cf.film_id = f.id ';
			sql += 'LEFT JOIN categories AS c ON c.id = cf.category_id ';
			if (options.categoryId) {
				sql += 'WHERE f.id IN (SELECT DISTINCT film_id FROM category_film WHERE category_id IN (SELECT id FROM categories WHERE id = ? ) ) ';		
			}
			sql += 'GROUP BY f.id ';
			sql += 'LIMIT ? ';
			sql += 'OFFSET ? ';

		db.get().query(sql, sqlOptions, function (error, results, fields) {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
};

exports.countFiltered = function (options) {
	var sqlOptions = [];
	// if (options.year) {
	// 	sqlOptions.unshift(options.year);
	// } 
	if (options.categoryId) {
		sqlOptions.unshift(options.categoryId);
	}

	return new Promise(function (resolve, reject) {
		var sql = 'SELECT COUNT(id) AS count FROM ( ';
			sql += 'SELECT f.id, f.title, f.year, f.poster_image, f.duration, f.description, GROUP_CONCAT(c.name SEPARATOR " " ) AS categories ';
			sql += 'FROM films AS f ';
			sql += 'LEFT JOIN category_film AS cf ON cf.film_id = f.id ';
			sql += 'LEFT JOIN categories AS c ON c.id = cf.category_id ';
			if (options.categoryId) {
				sql += 'WHERE f.id IN (SELECT DISTINCT film_id FROM category_film WHERE category_id IN (SELECT id FROM categories WHERE id = ?) ) ';		
			}
			sql += 'GROUP BY f.id ';
		sql += ' ) AS ddd; ';

		db.get().query(sql, sqlOptions, function (error, results, fields) {
			if (error) {
				reject(error);
			}

			if (results[0] !== undefined) {
				resolve(results[0]['count']);
			} else {
				resolve(0);
			}
		});
	});
}

exports.getQuickSearch = function (options) {
	var limit = 100;
	var offset = 0;
	if (options.limit !== undefined) {
		limit = options.limit;
	}

	if (options.offset !== undefined) {
		offset = options.offset;
	}

	var sqlOptions = [limit, offset];

	if (options.searchTerm) {
		searchTerm = '%' + options.searchTerm + '%';
		sqlOptions.unshift(searchTerm);
	}

	return new Promise(function (resolve, reject) {
		var sql = 'SELECT f.id, f.title, f.year, f.poster_image, f.duration, f.description, GROUP_CONCAT(c.name SEPARATOR " " ) AS categories ';
			sql += 'FROM films AS f ';
			sql += 'LEFT JOIN category_film AS cf ON cf.film_id = f.id ';
			sql += 'LEFT JOIN categories AS c ON c.id = cf.category_id ';
			// if (options.category) {
			// 	sql += 'WHERE f.id IN (SELECT DISTINCT film_id FROM category_film WHERE category_id IN (SELECT id FROM categories WHERE name = ?) ) ';		
			// }
			if (options.searchTerm) {
				sql += 'WHERE f.title LIKE ? ';
			}
			sql += 'GROUP BY f.id ';
			sql += 'LIMIT ? ';
			sql += 'OFFSET ? ';

		db.get().query(sql, sqlOptions, function (error, results, fields) {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
};

exports.countQuickSearch = function (options) {
	
	var sqlOptions = [];

	if (options.searchTerm) {
		searchTerm = '%' + options.searchTerm + '%';
		sqlOptions.unshift(searchTerm);
	}

	return new Promise(function (resolve, reject) {
		var sql = 'SELECT COUNT(id) AS count FROM ( ';
			sql += 'SELECT f.id, f.title, f.year, f.poster_image, f.duration, f.description, GROUP_CONCAT(c.name SEPARATOR " " ) AS categories ';
			sql += 'FROM films AS f ';
			sql += 'LEFT JOIN category_film AS cf ON cf.film_id = f.id ';
			sql += 'LEFT JOIN categories AS c ON c.id = cf.category_id ';
			// if (options.category) {
			// 	sql += 'WHERE f.id IN (SELECT DISTINCT film_id FROM category_film WHERE category_id IN (SELECT id FROM categories WHERE name = ?) ) ';		
			// }
			if (options.searchTerm) {
				sql += 'WHERE f.title LIKE ? ';
			}
			sql += 'GROUP BY f.id ';
		sql += ' ) AS ddd; ';

		db.get().query(sql, sqlOptions, function (error, results, fields) {
			if (error) {
				reject(error);
			}
			if (results[0] !== undefined) {
				resolve(results[0]['count']);
			} else {
				resolve(0);
			}
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

exports.update = function (filmId, data) {
	return new Promise(function (resolve, reject) {
		var sql = `
			UPDATE films  
			SET ? 
			WHERE id = ? 
		`;
		db.get().query(sql, [data, filmId], function (error, results, fields) {
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

exports.removeCategories = function (filmId) {
	return new Promise(function (resolve, reject) {
		var sql = `
			DELETE FROM category_film 
			WHERE film_id = ?
		`;
		db.get().query(sql, [filmId], function (error, results, fields) {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
};

exports.delete = function (filmId) {
	return new Promise(function(resolve, reject) {
		var sql = `
			DELETE 
			FROM films  
			WHERE id = ? 
			LIMIT 1;
		`;
		db.get().query(sql, [filmId], function (error, result) {
			if (error) {
				reject(error);
			}
			resolve(result[0]);
		});	
	});
}
