var passport = require('passport'),
    _        = require('lodash'),
    strategy = require('./strategies'),
    mongoose = require('mongoose');

passport.serializeUser(function(user, done) { 
  // preserve identifier only
  done(null, user.identifier);
});

passport.deserializeUser(function(identifier, done) {
  //console.log('Deserializing: ' + user);
  done(null, {identifier: identifier});
});

exports.strategies = strategies = function(strategies){ 
		return function(req, res, next){
			next();
		};
};

exports.init = function(app){
	app.use(passport.initialize());
	app.use(passport.session());
	return this;
}

exports.strategies = function(strategies){
	passport.use(strategy.twitter());
	passport.use(strategy.google());
	passport.use(strategy.facebook());
	return this;
};
