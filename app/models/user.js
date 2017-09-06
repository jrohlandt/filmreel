var db = require('../../db.js')
const bcrypt = require('bcrypt-nodejs')
const fillable = ['name', 'email', 'password', 'profileImage']

exports.findByEmail = function (email) {
  return new Promise((resolve, reject) => {
    var sql = 'SELECT * FROM users WHERE email = ? LIMIT 1'
    db.get().query(sql, email, (error, results, fields) => {
      if (error) {
        reject(error)
      }

      if (results[0] === undefined) {
        resolve(false)
      }
      resolve(results[0])
    })
  })
}

exports.findById = function (id) {
  return new Promise((resolve, reject) => {
    var sql = 'SELECT * FROM users WHERE id = ? LIMIT 1'
    db.get().query(sql, id, (error, results, fields) => {
      if (error) {
        reject(error)
      }
      resolve(results[0])
    })
  })
}

// ----------------------------------------------------------------------------
//  GET FILLABLE FIELDS
// ----------------------------------------------------------------------------
function getFillableFields (input) {
  var fillableData = {}
  for (var i = 0; i < fillable.length; i++) {
    if (input[fillable[i]]) {
      fillableData[fillable[i]] = input[fillable[i]].trim()
    }
  }

  return fillableData
}

exports.create = function (data) {
  return new Promise(function (resolve, reject) {
    var fillableData = getFillableFields(data)
    db.get().query('INSERT INTO users SET ?', fillableData, function (error, results, fields) {
      if (error) {
        reject(error)
      }
      resolve(results)
    })
  })
}

exports.hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, null, null, (error, hash) => {
      if (error) {
        reject(error)
      }

      resolve(hash)
    })
  })
}

exports.checkPassword = (p1, p2) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(p1, p2, function (error, isMatch) {
      if (error) {
        reject(error)
      }
      isMatch ? resolve(true) : resolve(false)
    })
  })
}
