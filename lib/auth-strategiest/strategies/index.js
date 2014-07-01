var passport = require('passport')
  , mongoose = require('mongoose')
  , passportStrategyBasic = require('passport-http').BasicStrategy
  , passportStrategyDigest = require('passport-http').DigestStrategy
  , psTwitter = require('passport-twitter').Strategy
  , psGoogle = require('passport-google').Strategy
  , psFacebook = require('passport-facebook').Strategy;


exports.twitter = function(User){
	return new psTwitter({
		    consumerKey: 'YNItXrsv2huccP9eZxMhfw5bh',
		    consumerSecret: 'CIP7rUQYaxG4AMQGk0SaS4BaA8zbPEKQJjqfzIMzodBPMhx54M',
		    callbackURL: "http://localhost:3000/auth/twitter/callback"
						  },
						  function(token, tokenSecret, profile, done) { 
						  	var User = mongoose.model('user'); console.log(User);
						  	profile.identifier = profile.id;
						  	profile.token = token;
						  	profile.tokenSecret = tokenSecret;
						  	return done(null, profile);
						 });
};

exports.google = function(){
	return new psGoogle({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/',
    stateless: true
  },
  function(identifier, profile, done) {
  	var User = mongoose.model('user');
  	profile.identifier = identifier;
  	return done(null, profile);
  });
};


exports.facebook = function(){
	return new psFacebook({
    clientID: '258398047693301',
    clientSecret: '7408c53131f65eeb20b119859d0e53ff',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  	return done(null,profile);
  });
};
