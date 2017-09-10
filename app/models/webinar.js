var db = require('../../db.js')

// exports.create = function (userId, text, done) {
//   var values = [userId, text, new Date().toISOString()]
//
//   db.get().query('INSERT INTO comments (user_id, text, date) VALUES(?, ?, ?)', values, function (err, result) {
//     if (err) return done(err)
//     done(null, result.insertId)
//   })
// }

// exports.getAll = function (done) {
//   db.get().query('SELECT * FROM webinars', function (err, rows) {
//     if (err) return done(err)
//     done(null, rows)
//   })
// }

exports.getAllByUser = function (userId, done) {

	db.get().query('SELECT * FROM comments WHERE user_id = ?', userId, function (err, rows) {
		if (err) {
			return done(err);
		}
		done(null, rows);
	});
};

exports.getAll = function () {
	return new Promise(function (resolve, reject) {
		db.get().query('SELECT * FROM webinars', function (error, results, fields) {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
};

exports.create = function (data) {
	return new Promise(function (resolve, reject) {
		db.get().query('INSERT INTO webinars SET ?', data, function (error, results, fields) {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
};
