var passport = require('passport')
  , mongoose = require('mongoose')
  , passportStrategyBasic = require('passport-http').BasicStrategy
  , passportStrategyDigest = require('passport-http').DigestStrategy
  , psLocal = require('passport-local').Strategy
  , psTwitter = require('passport-twitter').Strategy
  , psGoogle = require('passport-google').Strategy
  , psFacebook = require('passport-facebook').Strategy

  , Db = require('../../db');


  var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
  /*
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }*/
  Db.model('user').get({
    '_id':id
  }, function(err, doc){
    return fn(null, doc);
  });
  return fn(null, null);
}

function findByUsername(username, fn) {
  /*
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }*/

  Db.model('user').get({
    'firstname':username
  }, function(err, doc){ console.log(doc);
    return fn(null, doc);
  });
  //return fn(null, null);
}



exports.local = function(){
  return new psLocal({
          usernameField:'username',
          passwordField:'password'
        },
        function(username, password, done) {
          // asynchronous verification, for effect...
    process.nextTick(function () {

      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }

        /////
        /*
          user.comparePassword(password, function(err, isMatch) {
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect password.' });
          }
        });*/
        /////

        // May subsrcibe to Eventful here
        // to trigger
        // user:login:success
        // user:login:fail


        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);


      })
    });


        /*
          User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user, user.password);
          });*/
    });
}

exports.digest = function(){
  return new passportStrategyDigest({ qop: 'auth' },
    function(username, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user, user.password);
      });
    },
    function(params, done) {
      // validate nonces as necessary
      done(null, true)
    });
}
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
