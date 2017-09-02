// const Webinar = require('../../models').webinar
const logger = require('../../helpers/logger.js')
const mysql = require('mysql')

function getWebinars () {
  return new Promise(function (resolve, reject) {
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'homestead',
      password: 'secret',
      database: 'node_mysql',
    })

    connection.connect(function (err) {
      if (err) {
        return reject('error connecting: ' + err.stack)
      }
      console.log('connected as id ' + connection.threadId)
    })

    connection.query(`SELECT * FROM webinars`, function (error, results, fields) {
      if (error) {
        return reject(error)
      }
      resolve(results)
    })

    connection.end()
  })
}

function storeWebinar (data) {
  return new Promise(function (resolve, reject) {
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'homestead',
      password: 'secret',
      database: 'node_mysql',
    })

    connection.connect(function (err) {
      if (err) {
        return reject('error connecting: ' + err.stack)
      }
      console.log('connected as id ' + connection.threadId)
    })

    connection.query('INSERT INTO webinars SET ?', data, function (error, results, fields) {
      if (error) {
        return reject(error)
      }
      resolve(results)
    })

    connection.end()
  })
}

module.exports = {

/*
|-------------------------------------------------------------------------------
| INDEX
|-------------------------------------------------------------------------------
*/
  index (req, res) {
    async function getData () {
      var webinars = getWebinars()
      return { title: 'Webinars', webinars: await webinars }
    }

    return getData()
      .then(data => {
        res.render('admin/webinars/index', data)
      })
      .catch(error => {
        logger.logError(error)
        req.flash('error', 'a Server error occurred, please contact support.')
        return res.redirect('back')
      })
  },

/*
|-------------------------------------------------------------------------------
| CREATE
|-------------------------------------------------------------------------------
*/
  create (req, res) {
    return res.render('admin/webinars/create', { title: 'Webinar - Create' })
  },

/*
|-------------------------------------------------------------------------------
| STORE
|-------------------------------------------------------------------------------
*/
  store (req, res) {
    console.log('posting ', req.body, req.user.id)
    var data = { title: req.body.title, user_id: req.user.id }
    return storeWebinar(data)
      .then(result => {
        req.flash('success', 'Webinar has been created!')
        return res.redirect('/admin/webinars')
      })
      .catch(error => {
        console.log(error)
        req.flash('error', 'The webinar could not be saved.')
        return res.redirect('back')
      })
  }

}
