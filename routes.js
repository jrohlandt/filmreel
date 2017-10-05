
module.exports = (app) => {
	// Welcome
	// app.get('/', ensureAuthenticated, (req, res) => res.render('frontend/home', {title: 'Members'}))
	// app.get('/admin', ensureAuthenticated, require('./controllers/admin/DashboardController').index)

	let wrap = fn => (...args) => fn(...args).catch(args[2]);
	
	// Frontend routes
	app.get('/', require('./app/controllers/frontend/HomeController').index);
	app.get('/demo/flex', require('./app/controllers/frontend/demo/FlexController').index);
	app.get('/films', wrap(require('./app/controllers/frontend/FilmsController').index));
	app.get('/films/category/:categoryName', wrap(require('./app/controllers/frontend/FilmsController').byCategory));
	app.post('/films/get-more', wrap(require('./app/controllers/frontend/FilmsController').getMore));
	
	

	// Backend/Admin routes
	app.get('/admin/films', ensureAuthenticated, wrap(require('./app/controllers/admin/FilmsController').index));
	app.get('/admin/films/create', ensureAuthenticated, wrap(require('./app/controllers/admin/FilmsController').create));
	app.post('/admin/films/store', ensureAuthenticated, wrap(require('./app/controllers/admin/FilmsController').store));
	app.get('/admin/films/:filmId/edit', ensureAuthenticated, wrap(require('./app/controllers/admin/FilmsController').edit));
	app.post('/admin/films/update', ensureAuthenticated, wrap(require('./app/controllers/admin/FilmsController').update));
	app.post('/admin/films/delete', ensureAuthenticated, wrap(require('./app/controllers/admin/FilmsController').delete));

	function ensureAuthenticated (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/auth/login');
	}
};
