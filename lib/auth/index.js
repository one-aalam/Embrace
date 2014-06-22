var passport = require('passport')
  , passportStrategyBasic = require('passport-http').BasicStrategy
  , passportStrategyDigest = require('passport-http').DigestStrategy
  , psTwitter = require('passport-twitter').Strategy
  , psGoogle = require('passport-google').Strategy
  , psFacebook = require('passport-facebook').Strategy;


var users = [
	    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
	  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
	];
 
	function findByUsername(username, fn) {
	  for (var i = 0, len = users.length; i < len; i++) {
	    var user = users[i];
	    if (user.username === username) {
	      return fn(null, user);
	    }
	  }
	  return fn(null, null);
	} 

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findByUsername(username, function(err, user) {
		done(err, user);
  });
  /*
  User.findById(id, function(err, user) {
    done(err, user);
  });*/
});

// use over https (recommended)
// 
exports.twitter = function(){
	return new psTwitter(
			{
    consumerKey: 'YNItXrsv2huccP9eZxMhfw5bh',
    consumerSecret: 'CIP7rUQYaxG4AMQGk0SaS4BaA8zbPEKQJjqfzIMzodBPMhx54M',
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
  	console.log(token, tokenSecret, profile);
  	done(null, user);
  	/*
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });*/
  });
};

exports.google = function(){
	return new psGoogle({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, profile, done) {
  	console.log(identifier);
  	console.log(profile);
  	done(null, users[1]);
  	/*
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });*/
  }
)
};

exports.facebook = function(){
	return new psFacebook({
    clientID: '258398047693301',
    clientSecret: '7408c53131f65eeb20b119859d0e53ff',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  	done(null,{});
  	/*
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });*/
  }
)
};

exports.basic = function(){
	return new passportStrategyBasic({
	  },
	  function(username, password, done) {
	    // asynchronous verification, for effect...
	    process.nextTick(function () {
	       
	      // Find the user by username.  If there is no user with the given
	      // username, or the password is not correct, set the user to `false` to
	      // indicate failure.  Otherwise, return the authenticated `user`.
	      findByUsername(username, function(err, user) {
	        if (err) { return done(err); }
	        if (!user) { return done(null, false); }
	        if (user.password != password) { return done(null, false); }
	        return done(null, user);
	      })
	    });
	  }
	);
};

exports.digest = function(){
	return new passportStrategyDigest({ qop: 'auth' },
		  function(username, done) {
		  	findByUsername(username, function(err, user) {
		        if (err) { return done(err); }
		        if (!user) { return done(null, false); }
		        //if (user.password != password) { return done(null, false); }
		        return done(null, user, user.password);
	      	})
		  	/*
		    User.findOne({ username: username }, function (err, user) {
		      if (err) { return done(err); }
		      if (!user) { return done(null, false); }
		      return done(null, user, user.password);
		    });*/
		  },
		  function(params, done) {
		    // validate nonces as necessary
		    done(null, true)
		  }
	);
}