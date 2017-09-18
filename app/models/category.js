var db = require('../../db.js');
var dbTable = 'categories';

exports.getAll = function () {
	return new Promise(function (resolve, reject) {
		db.get().query(`SELECT * FROM ${dbTable}`, function (error, results, fields) {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
};

// exports.create = function (data) {
// 	return new Promise(function (resolve, reject) {
// 		db.get().query(`INSERT INTO ${dbTable} SET ?`, data, function (error, results, fields) {
// 			if (error) {
// 				reject(error);
// 			}
// 			resolve(results);
// 		});
// 	});
// };
