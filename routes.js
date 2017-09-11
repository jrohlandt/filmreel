module.exports = (app) => {
    // Welcome
  // app.get('/', ensureAuthenticated, (req, res) => res.render('frontend/home', {title: 'Members'}))
  // app.get('/admin', ensureAuthenticated, require('./controllers/admin/DashboardController').index)
  // app.get('/admin/webinars', ensureAuthenticated, require('./controllers/admin/WebinarsController').index)
	app.get('/admin/webinars', ensureAuthenticated, require('./app/controllers/admin/WebinarsController').index);
	app.get('/admin/webinars/create', ensureAuthenticated, require('./app/controllers/admin/WebinarsController').create);
	app.post('/admin/webinars/store', ensureAuthenticated, require('./app/controllers/admin/WebinarsController').store);

	app.get('/admin/films', ensureAuthenticated, require('./app/controllers/admin/FilmsController').index);
	app.get('/admin/films/create', ensureAuthenticated, require('./app/controllers/admin/FilmsController').create);
	app.post('/admin/films/store', ensureAuthenticated, require('./app/controllers/admin/FilmsController').store);
  // app.get('/admin/webinars/create', ensureAuthenticated, require('./controllers/admin/WebinarsController').create)
  // app.post('/admin/webinars/store', ensureAuthenticated, require('./controllers/admin/WebinarsController').store)

	app.get('/', require('./app/controllers/frontend/HomeController').index);
	app.get('/demo/flex', require('./app/controllers/frontend/demo/FlexController').index);

	function ensureAuthenticated (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/auth/login');
	}
};
