const express = require('express')
const router = express.Router()

const multer = require('multer')
const singleImageUpload = multer({ dest: './uploads' }).single('image')

const bcrypt = require('bcrypt-nodejs')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const User = require('../../models').user
const email = require('../../helpers/email')

const fillable = ['name', 'email', 'password', 'profileImage']

// ----------------------------------------------------------------------------
//  REGISTRATION FORM
// ----------------------------------------------------------------------------
router.get('/register', (req, res, next) => {
    res.render('frontend/register', { title: 'Register', formData: {}, })
})


// ----------------------------------------------------------------------------
//  SAVE IMAGE
// ----------------------------------------------------------------------------
function saveImage(req, fieldname, defaultImagePath) {

    if (!req.file || req.file.fieldname !== fieldname)
        return defaultImagePath

    var mimeType = req.file.mimetype
    var mimeTypes = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
    }
    var extension = mimeTypes.hasOwnProperty(mimeType) ? mimeTypes[mimeType] : false

    if (extension)
        return  req.file.filename + extension
}

// ----------------------------------------------------------------------------
//  FORM VALIDATION RULES
// ----------------------------------------------------------------------------
function formValidation(req) {
    req.checkBody('name', 'Name field should be between 2 and 20 characters').notEmpty()
    req.checkBody('email', 'Please enter a valid email address').isEmail()
    req.checkBody('password', 'Please enter a password').notEmpty()
    req.checkBody('password_confirm', 'Passwords do not match').equals(req.body.password)
}

// ----------------------------------------------------------------------------
//  RUN VALIDATION
// ----------------------------------------------------------------------------
function validationFailed(req) {
    formValidation(req)
    return req.validationErrors() ? true : false
}

// ----------------------------------------------------------------------------
//  GET FILLABLE FIELDS
// ----------------------------------------------------------------------------
function getFillableFields(req) {

    var formData = {}
    for (var i = 0; i < fillable.length; i++)
        if (req.body[fillable[i]])
            formData[fillable[i]] = req.body[fillable[i]].trim()

    return formData
}

// ----------------------------------------------------------------------------
//  REGISTER USER
// ----------------------------------------------------------------------------
router.post('/register', singleImageUpload, (req, res, next) => {

    if (validationFailed(req)) {
        return res.render('frontend/register', {
            errors: req.validationErrors(),
            formData: req.body,
        })
    }

    var formData = getFillableFields(req)

    // check if email address is in use
    User.findOne({where: {email: formData.email}})
    .then((user) => {
        if (user) {
            return res.render('frontend/register', {
                errors: [{msg: `The email address '${formData.email}' is already in use`}],
                formData: req.body,
            })
        }

        // save image
        formData.profileImage = saveImage(req, 'image', '/images/no_image.png')

        // hash password
        bcrypt.hash(formData.password, null, null, (err, hash) => {
            if (err)
                return res.render('frontend/register', {
                    errors: [{msg: 'You could not be registered'}],
                    formData: formData,
                })

            // create user
            formData.password = hash
            return User
            .create(formData)
            .then((user) => {

                // welcome email
                email.send(formData, req.body.password)

                req.flash('success', 'You are now registered, please sign in to continue')
                res.redirect('/')
            })
            .catch(error => {
                    console.log(error)
                    res.status(500)
            })
        })
    })
    .catch((error) => {
        console.log(error)
        res.status(500)
    })
})

// ----------------------------------------------------------------------------
//  LOGIN FORM
// ----------------------------------------------------------------------------
router.get('/login', (req, res, next) => {
    return res.render('frontend/login', { title: 'Sign in' })
})

// ----------------------------------------------------------------------------
//  PASSPORT SERIALIZE USER
// ----------------------------------------------------------------------------
passport.serializeUser(function(user, done) {
    console.log('serialize user')
    done(null, user.id)
})

// ----------------------------------------------------------------------------
//  PASSPORT DESERIALIZE USER
// ----------------------------------------------------------------------------
passport.deserializeUser(function (id, done) {
  console.log('deserialize user:', id)
  var mysql = require('mysql')
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'homestead',
    password : 'secret',
    database : 'node_mysql'
  })

  connection.query(`SELECT * FROM users WHERE id = ${id} LIMIT 1`, function (error, results, fields) {
    if (error) {
      throw error
    }

     if (results[0] === undefined) {
      console.log('deserialize user not found')
    } else {
      done(null, results[0])
    }
  })

  connection.end()
    // User
    // .findById(id)
    // .then(user => {
    //     if (!user) {
    //         console.log('deserialize user not found')
    //     } else {
    //         console.log('deserialize success')
    //         done(null, user)
    //     }
    //
    // })
    // .catch(error => {
    //     ('deserialize error')
    //     done(error, false)
    // })
})

// ----------------------------------------------------------------------------
//  PASSPORT LOCAL STRATEGY
// ----------------------------------------------------------------------------
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, function (email, password, done) {
        console.log('local strategy', email)

        var mysql = require('mysql')
        var connection = mysql.createConnection({
          host     : 'localhost',
          user     : 'homestead',
          password : 'secret',
          database : 'node_mysql'
        })

        connection.query(`SELECT * FROM users WHERE email = '${email}' LIMIT 1`, function (error, results, fields) {
            if (error) {
              throw error
            }

             if (results[0] === undefined) {
              console.log('unknown user')
              return done(null, false)
            }

            var user = results[0]
            bcrypt.compare(password, user.password, function (err, isMatch) {
              if (err) {
                  console.log('hash error')
                  throw err
              }

              if (!isMatch) {
                  console.log('password is incorrect')
                  return done(null, false, {message: 'Invalid Password'})
              }

              return done(null, user)
            })



          console.log('The solution is: ', results[0])
        })

        connection.end()

        // User
        // .findOne({ where: {email: email}})
        // .then(user => {
        //     if (!user) {
        //         console.log('unkown user')
        //         return done(null, false)
        //     }
        //
        //     bcrypt.compare(password, user.password, function(err, isMatch) {
        //         if (err) {
        //             console.log('hash error')
        //             throw err
        //         }
        //
        //         if (!isMatch) {
        //             console.log('password is incorrect')
        //             return done(null, false, {message: 'Invalid Password'})
        //         }
        //
        //         return done(null, user)
        //     })
        // })
        // .catch(error => {
        //     console.log(error)
        // })

    }
))

// ----------------------------------------------------------------------------
//  LOG USER IN
// ----------------------------------------------------------------------------
router.post('/login',
    passport.authenticate('local', {failureRedirect: '/auth/login'}),
    function(req, res) {
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
