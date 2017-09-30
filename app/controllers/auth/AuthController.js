const express = require('express');
const router = express.Router();

// const multer = require('multer')
// const singleImageUpload = multer({ dest: './uploads' }).single('image')

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// const email = require('../../helpers/email')

var userModel = require('../../models/user');

// router.get('/makepassword', (req, res) => {
// 	return userModel.hashPassword('jjs9jf93jsoadj').then(hash => {console.log('new pw: ', hash); });
// });
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
// function formValidation (req) {
//   req.checkBody('name', 'Name field should be between 2 and 20 characters').notEmpty()
//   req.checkBody('email', 'Please enter a valid email address').isEmail()
//   req.checkBody('password', 'Please enter a password').notEmpty()
//   req.checkBody('password_confirm', 'Passwords do not match').equals(req.body.password)
// }
//
// // ----------------------------------------------------------------------------
// //  RUN VALIDATION
// // ----------------------------------------------------------------------------
// function validationFailed (req) {
//   formValidation(req)
//   return req.validationErrors() ? true : false
// }

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
	console.log('Request: ', req.session);
	return res.render('frontend/login', { title: 'Sign in', csrfToken: req.csrfToken() });
});

// ----------------------------------------------------------------------------
//  PASSPORT SERIALIZE USER
// ----------------------------------------------------------------------------
passport.serializeUser(function (user, done) {
	console.log('serialize user');
	done(null, user.id);
});

// ----------------------------------------------------------------------------
//  PASSPORT DESERIALIZE USER
// ----------------------------------------------------------------------------
passport.deserializeUser((id, done) => {

	console.log('deserialize user:', id);

	userModel.findById(id)
		.then((user) => {
			if (user !== undefined) {
				done(null, user);
			}
		});
});

// ----------------------------------------------------------------------------
//  PASSPORT LOCAL STRATEGY
// ----------------------------------------------------------------------------
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, function (email, password, done) {

	userModel.findByEmail(email)
		.then(user => {
			if (!user) {
				done(null, false);
			} else {
				userModel.checkPassword(password, user.password)
					.then(isMatch => {
						isMatch === true ? done(null, user) : done(null, false);
					})
					.catch(error => {
						console.log(error);
						done(null, false);
					});
			}
		})
		.catch(error => {
			console.log(error);
		});
}));

// ----------------------------------------------------------------------------
//  LOG USER IN
// ----------------------------------------------------------------------------
// router.post('/login', passport.authenticate('local', {failureRedirect: '/auth/login', failureFlash: 'Invalid username or password.'}), (req, res) => {
//   // If this function gets called, authentication was successful.
//   // `req.user` contains the authenticated user
//   console.log('Authentication success!')
//   req.flash('success', 'You are logged in')
//   res.redirect('/')
// })

router.post('/login', function(req, res, next) {
	
	req.checkBody('email', 'Please enter a valid email address').isEmail();
	req.checkBody('password', 'Please enter a password').notEmpty();

	if (req.validationErrors()) {
		req.flash('success', 'You have been logged outa here');
		return res.redirect('/auth/login'); 
	} else {
		passport.authenticate('local', function(err, user, info) {
			if (err) {
				return next(err);
			}

			if (!user) { 
				req.flash('success', 'You have logged out')
				return res.redirect('/auth/login'); 
			}

			req.logIn(user, function(err) {
				if (err) { 
					return next(err); 
				}
				return res.redirect('/admin/films');
			});
		})(req, res, next);
	}
});

// ----------------------------------------------------------------------------
//  LOGOUT
// ----------------------------------------------------------------------------
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'You have logged out');
	res.redirect('/auth/login');
});

module.exports = router;
