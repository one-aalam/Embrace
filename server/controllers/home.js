function Setup(Router, Passport){
	Router.get('/', 
		// Authenticate using HTTP Basic credentials, with session support disabled.
  		//passport.authenticate('digest', { session: false }),
		function(req, res){
			res.render('index');
	});
	
	Router.get('/about', function(req, res){
		res.send('@about');
	});
}

module.exports = Setup; 