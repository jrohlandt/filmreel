const express = require('express')
const path = require('path')
const fs = require('fs')
const favicon = require('serve-favicon')
const logger = require('morgan')
// const cookieParser = require('cookie-parser');
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const passport = require('passport')
const bodyParser = require('body-parser')
const csrf = require('csurf');
var bb = require('express-busboy');
const flash = require('connect-flash')
const expressValidator = require('express-validator')
const flashMessages = require('express-messages')
const db = require('./db')
const errorLogger = require(path.resolve(__dirname, 'app', 'helpers', 'logger'));

global.appRoot = path.resolve(__dirname);
/*
|-------------------------------------------------------------------------------
| APP
|-------------------------------------------------------------------------------
*/

// Connect to MySQL on start
db.connect(db.MODE_PRODUCTION, function (err) {
	if (err) {
		console.log('Unable to connect to MySQL.');
		process.exit(1);
	} else {
		const app = express();



    global.appRoot = path.resolve(__dirname)
    // Log requests to the console.
    app.use(logger('dev'))

    /*
    |-------------------------------------------------------------------------------
    | VIEWS
    |-------------------------------------------------------------------------------
    */
    app.set('view engine', 'pug')
    app.set('views', path.join(__dirname, 'resources/views'))

    /*
    |-------------------------------------------------------------------------------
    | FAVICON
    |-------------------------------------------------------------------------------
    */
    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

    /*
    |-------------------------------------------------------------------------------
    | PARSE INCOMING REQUESTS
    |-------------------------------------------------------------------------------
    */
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
	
	// busboy allow files in form data
	// place after bodyParser
	// todo research if busboy can replace bodyParser
	bb.extend(app, {
		upload: true, 
		path: './uploads/tmp',
		mimeTypeLimit: [
			'image/jpeg',
			'image/png',
			'image/gif'
		]
	});

    /*
    |-------------------------------------------------------------------------------
    | STATIC FILES
    |-------------------------------------------------------------------------------
    */
    app.use(express.static(path.join(__dirname, '/public')))
	
    /*
    |-------------------------------------------------------------------------------
    | SESSIONS
    |-------------------------------------------------------------------------------
    */

    //
    var dbConfig = require('./config/database').production

    var sessionStoreOptions = {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      checkExpirationInterval: 900000, // How frequently expired sessions will be cleared; milliseconds.
      expiration: 86400000, // The maximum age of a valid session; milliseconds.
      createDatabaseTable: true, // Whether or not to create the sessions database table, if one does not already exist.
      connectionLimit: 1 // Number of connections when creating a connection pool
    }

    var sessionStore = new MySQLStore(sessionStoreOptions)

    // var sess = {
    //   secret: 'makesuretochangethesecret', // TODO change this for production
    //   saveUninitialized: true,
    //   resave: true,
    //   cookie: {}
    // }

    var sessionOptions = {
      key: 'session_cookie', // session cookie name
      secret: 'session_cookie_secret', // TODO change for production
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    }

    if (app.get('env') === 'production') {
      app.set('trust proxy', 1) // trust first proxy
      // sessionOptions.cookie.secure = true // serve secure cookies
    }
    app.use(session(sessionOptions))

    /*
    |-------------------------------------------------------------------------------
    | PASSPORT
    |-------------------------------------------------------------------------------
	*/
    app.use(passport.initialize())
    app.use(passport.session())

    /*
    |-------------------------------------------------------------------------------
    | VALIDATION
    |-------------------------------------------------------------------------------
    */
    app.use(expressValidator({
      errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
        var root = namespace.shift()
        var formParam = root

        while (namespace.length) {
          formParam += '[' + namespace.shift() + ']'
        }

        return {
          param: formParam,
          msg: msg,
          value: value
        }
      }
    }))
	
    /*
    |-------------------------------------------------------------------------------
    | COOKIEPARSER
    |-------------------------------------------------------------------------------
    */
    // app.use(cookieParser()) // not needed as session anymore

    /*
    |-------------------------------------------------------------------------------
    | FLASH MESSAGES
    |-------------------------------------------------------------------------------
    */
    app.use(flash())
    app.use(function (req, res, next) {
	  res.locals.messages = flashMessages(req, res)
      next()
    })

    /*
    |-------------------------------------------------------------------------------
    | ROUTES
    |-------------------------------------------------------------------------------
    */

	app.use(csrf());
    // Make user object available to all routes
    app.get('*', (req, res, next) => {
      res.locals.user = req.user || null
      next();
    })

    require('./routes.js')(app);
    app.use('/auth', require('./app/controllers/auth/AuthController'))

    // 404 Not Found
    app.get('*', (req, res) => {
      res.status(404).send({ message: 'Sorry, the page you are looking for cannot be found.' })
	})
	

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      var err = new Error('Not Found')
      err.status = 404
      next(err)
    })

    // error handler
    app.use(function (err, req, res, next) {

		errorLogger.logError(err); // todo use async write functions in error logger

      	// set locals, only providing error in development
		res.locals.message = 'Oops something went wrong...';
		res.locals.error = req.app.get('env') === 'development' ? err : {};
		
		// render the error page
		res.status(err.status || 500)
		res.render('error')
    })

    module.exports = app
  }
})
