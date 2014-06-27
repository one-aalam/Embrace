var passport = require('passport'),
    _        = require('lodash');




exports.strategies = strategies = function(strategies){ 

		return function(req, res, next){
			console.log(req.app);
			console.log('hey');
			next();
		};
};

exports.auth = function(app){
	///////////////////////////////////////////
	// app.use(authStrategiest(['local', 'google'])) ///////////////
	// separate into a lib/middleware =>
	app.use(passport.initialize());
	app.use(passport.session());
    
    //app.use(strategiest.strategies(['google'])); 
	passport.use(require('../auth').twitter());
	passport.use(require('../auth').google());
	passport.use(require('../auth').facebook());

	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', 
  			passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/about' }));
	app.get('/auth/google', passport.authenticate('google'));
	app.get('/auth/google/return', 
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));
	app.get('/auth/facebook', passport.authenticate('google'));
	app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/',
                                    failureRedirect: '/login' }));

	////////////////////////////////////////////////////////////
};
