// 'use strict';
//
// module.exports = function(sequelize, DataTypes) {
//   var user = sequelize.define('user', {
//     name: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password: DataTypes.STRING,
//     profileImage: DataTypes.STRING,
//   }, {
//     classMethods: {
//       associate: function(models) {
//         // associations can be defined here
//       }
//     }
//   });
//   return user;
// };

var db = require('../../db.js')

exports.findByEmail = function (email) {
  return new Promise((resolve, reject) => {
    db.get().query('SELECT * FROM webinars WHERE email = ? LIMIT 1', email, (error, results, fields) => {
      if (error) {
        reject(error)
      }
      resolve(results[0])
    })
  })
}

exports.findById = function (id) {
  return new Promise((resolve, reject) => {
    db.get().query('SELECT * FROM webinars WHERE id = ? LIMIT 1', id, (error, results, fields) => {
      if (error) {
        reject(error)
      }
      resolve(results[0])
    })
  })
}

exports.checkPassword = (p1, p2) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, function (error, isMatch) {
      if (error) {
          reject(error)
      }

      if (!isMatch) {
          console.log('password is incorrect')
          return done(null, false, {message: 'Invalid Password'})
      }
  })
}
