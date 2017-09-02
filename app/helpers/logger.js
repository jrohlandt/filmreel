/* global appRoot */
var fs = require('fs')
var path = require('path')
var formattedDate
var formattedTime

function formatErrorMessage (error) {
  return `
|------------------------------------------------------------------------------
| ${formattedDate} ${formattedTime}
|------------------------------------------------------------------------------
${error.stack}
`
}

function formatDate (date) {
  var day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
  var month = date.getMonth() + 1
  month = month < 10 ? ('0' + month) : month

  return `${date.getFullYear()}-${month}-${day}`
}

function formatTime (date) {
  var hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
  var minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
  var seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()

  return `${hours}:${minutes}:${seconds}`
}

function logError (error) {
  // var date = new Date('December 04, 1995 06:03:07')
  var date = new Date()
  formattedDate = formatDate(date) // not accessible outside module (revealing module pattern)
  formattedTime = formatTime(date)
  var logFile = formattedDate + '.log'
  var logPath = path.join(appRoot, 'storage', 'logs', `${date.getFullYear()}`)

  return fs.stat(logPath, function (err, status) {
    if (err) {
      fs.mkdirSync(logPath)
    }
    return fs.appendFileSync(path.join(logPath, logFile), formatErrorMessage(error))
  })
}

module.exports = {logError: logError}
