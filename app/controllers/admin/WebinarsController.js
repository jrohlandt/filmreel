const logger = require('../../helpers/logger.js')
const webinar = require('../../models/webinar')

module.exports = {

/*
|-------------------------------------------------------------------------------
| INDEX
|-------------------------------------------------------------------------------
*/
  index (req, res) {
    async function getData () {
      var webinars = webinar.getAll()
      return {
        title: 'Webinars',
        webinars: await webinars
        // categories: await categories.getAll()
      }
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
    // console.log('posting ', req.body, req.user.id)
    var data = { title: req.body.title, user_id: 1 }
    // var data = { title: req.body.title, user_id: req.user.id }
    return webinar.store(data)
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
