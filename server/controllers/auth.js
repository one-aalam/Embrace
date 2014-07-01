/*
 
 */

function Setup(Router, User, Passport){

	Router
		.route('/sign-in')
			.get(function(req, res, next){
		 		res.render('auth/sign-in');
		 	})
		 	.post(function(req, res, next){
				res.render('auth/sign-in');
		 	});

	Router
		.route('/sign-up')
			.get(function(req, res, next){
		 		res.render('auth/sign-up');
		 	})
		 	.post(function(req, res, next){
		 		
		 	});

	Router
		.route('/sign-out')
			.get(function(req, res, next){
		 		req.logout();
		 		res.redirect('/');
		 	});

	Router
		.route('/auth/twitter')
			.get(
				Passport.authenticate('twitter')
		 	);
	Router
		.route('/auth/twitter/callback')
			.get(
				Passport.authenticate('twitter', 
										{ 
											successRedirect: '/',
                                     	  	failureRedirect: '/login' 
                                     	 })
		 	);

	Router
		.route('/auth/google')
			.get(
				Passport.authenticate('google')
		 	);
	Router
		.route('/auth/google/return')
			.get(
				Passport.authenticate('google', 
										{ 
											successRedirect: '/',
                                     		failureRedirect: '/login' 
                                     	})
		 	);

	Router
		.route('/auth/facebook')
			.get(
				Passport.authenticate('twitter')
		 	);
	Router
		.route('/auth/facebook/callback')
			.get(
				Passport.authenticate('twitter', 
										{ 
											successRedirect: '/',
                                     		failureRedirect: '/login' 
                                     	})
		 	);	

}



exports.setup = Setup;