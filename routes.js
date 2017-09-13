
module.exports = (app) => {
	// Welcome
	// app.get('/', ensureAuthenticated, (req, res) => res.render('frontend/home', {title: 'Members'}))
	// app.get('/admin', ensureAuthenticated, require('./controllers/admin/DashboardController').index)

	// Frontend routes
	app.get('/films', require('./app/controllers/frontend/FilmsController').index);

	// Admin routes
	app.get('/admin/films', ensureAuthenticated, require('./app/controllers/admin/FilmsController').index);
	app.get('/admin/films/create', ensureAuthenticated, require('./app/controllers/admin/FilmsController').create);
	app.post('/admin/films/store', ensureAuthenticated, require('./app/controllers/admin/FilmsController').store);
	app.get('/', require('./app/controllers/frontend/HomeController').index);
	app.get('/demo/flex', require('./app/controllers/frontend/demo/FlexController').index);

	function ensureAuthenticated (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/auth/login');
	}
};
