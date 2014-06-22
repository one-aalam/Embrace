var passport = require('passport')
  , passportStrategyBasic = require('passport-http').BasicStrategy
  , passportStrategyDigest = require('passport-http').DigestStrategy;


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

// use over https (recommended)

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