const express = require('express')
const router = express.Router()

const multer = require('multer')
const singleImageUpload = multer({ dest: './uploads' }).single('image')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// const email = require('../../helpers/email')

var userModel = require('../../models/user')

// ----------------------------------------------------------------------------
//  REGISTRATION FORM
// ----------------------------------------------------------------------------
// router.get('/register', (req, res, next) => {
//   res.render('frontend/register', { title: 'Register', formData: {} })
// })

// ----------------------------------------------------------------------------
//  SAVE IMAGE
// ----------------------------------------------------------------------------
// function saveImage (req, fieldname, defaultImagePath) {
//   if (!req.file || req.file.fieldname !== fieldname) {
//     return defaultImagePath
//   }
//
//   var mimeType = req.file.mimetype
//   var mimeTypes = {
//     'image/jpeg': '.jpg',
//     'image/png': '.png',
//     'image/gif': '.gif'
//   }
//   var extension = mimeTypes.hasOwnProperty(mimeType) ? mimeTypes[mimeType] : false
//
//   if (extension) {
//     return req.file.filename + extension
//   }
// }

// ----------------------------------------------------------------------------
//  FORM VALIDATION RULES
// ----------------------------------------------------------------------------
function formValidation (req) {
  req.checkBody('name', 'Name field should be between 2 and 20 characters').notEmpty()
  req.checkBody('email', 'Please enter a valid email address').isEmail()
  req.checkBody('password', 'Please enter a password').notEmpty()
  req.checkBody('password_confirm', 'Passwords do not match').equals(req.body.password)
}

// ----------------------------------------------------------------------------
//  RUN VALIDATION
// ----------------------------------------------------------------------------
function validationFailed (req) {
  formValidation(req)
  return req.validationErrors() ? true : false
}

// ----------------------------------------------------------------------------
//  REGISTER USER
// ----------------------------------------------------------------------------
// router.post('/register', singleImageUpload, (req, res, next) => {
//   if (validationFailed(req)) {
//     return res.render('frontend/register', {
//       errors: req.validationErrors(),
//       formData: req.body
//     })
//   }
//
//   var input = req.body
//
//   // check if email address is in use
//   userModel.findByEmail(input.email)
//     .then(user => {
//       if (user) {
//         return res.render('frontend/register', {
//           errors: [{msg: `The email address '${input.email}' is already in use`}],
//           formData: req.body
//         })
//       } else {
//       // save image
//         // formData.profileImage = '/images/no_image.png' // saveImage(req, 'image', '/images/no_image.png')
//
//         userModel.hashPassword(input.password)
//           .then(hash => {
//             input.password = hash
//
//             userModel.create(input)
//               .then((user) => {
//                 // welcome email
//                 // TODO fix email send crashes app
//                 email.send(input, req.body.password)
//
//                 req.flash('success', 'You are now registered, please sign in to continue')
//                 res.redirect('/')
//               })
//               .catch(error => {
//                 console.log(error)
//                 res.status(500)
//               })
//           })
//           .catch(error => {
//             console.log(error)
//             return res.render('frontend/register', {
//               errors: [{msg: 'You could not be registered'}],
//               formData: req.body
//             })
//           })
//       }
//     })
//     .catch((error) => {
//       console.log(error)
//       res.status(500)
//     })
// })

// ----------------------------------------------------------------------------
//  LOGIN FORM
// ----------------------------------------------------------------------------
router.get('/login', (req, res, next) => {
  return res.render('frontend/login', { title: 'Sign in' })
})

// ----------------------------------------------------------------------------
//  PASSPORT SERIALIZE USER
// ----------------------------------------------------------------------------
passport.serializeUser(function (user, done) {
  console.log('serialize user')
  done(null, user.id)
})

// ----------------------------------------------------------------------------
//  PASSPORT DESERIALIZE USER
// ----------------------------------------------------------------------------
passport.deserializeUser((id, done) => {
  console.log('deserialize user:', id)

  userModel.findById(id)
    .then((user) => {
      if (user === undefined) {
        console.log('deserialize user not found')
      } else {
        done(null, user)
      }
    })
})

// ----------------------------------------------------------------------------
//  PASSPORT LOCAL STRATEGY
// ----------------------------------------------------------------------------
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, function (email, password, done) {
  console.log('local strategy', email)

  userModel.findByEmail(email)
    .then(user => {
      if (!user) {
        console.log('unkown user', user)
        done(null, false)
      } else {
        userModel.checkPassword(password, user.password)
          .then(isMatch => {
            isMatch === true ? done(null, user) : done(null, false)
          })
          .catch(error => {
            console.log(error)
            done(null, false)
          })
      }
    })
    .catch(error => {
      console.log(error)
    })
}))

// ----------------------------------------------------------------------------
//  LOG USER IN
// ----------------------------------------------------------------------------
router.post('/login',
  passport.authenticate('local', {failureRedirect: '/auth/login'}), (req, res) => {
    console.log('Authentication success!')
    req.flash('success', 'You are logged in')
    res.redirect('/')
  }
)

// ----------------------------------------------------------------------------
//  LOGOUT
// ----------------------------------------------------------------------------
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'You have logged out')
  res.redirect('/auth/login')
})

module.exports = router
