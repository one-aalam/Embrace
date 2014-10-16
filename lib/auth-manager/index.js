var passport = require('passport'),
    _        = require('lodash'),
    strategy = require('./strategies'),
    mongoose = require('mongoose'),
    Db = require('../db');



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
  //return fn(null, null);
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
  }, function(err, doc){
    return fn(null, doc);
  });
  //return fn(null, null);
}

/**
 *
 */

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

/**
 * Strategy assignment
 */

exports.strategies = strategies = function(include){
    return function(req, res, next){
    /*  _.each(include, function(strategy_key, index){
          if(_.has(strategy, strategy_key)){ console.log('Using strategy: '+ strategy_key);
              passport.use(strategy[strategy_key]()); // ==> passport.use(strategies.local()),...
            }else{
              console.log('Could not find strategy: '+ strategy_key);
            }
          });*/
      passport.use(strategy.local());
      passport.use(strategy.facebook());
      passport.use(strategy.twitter());
      passport.use(strategy.google());
      req.app.set('_passport',passport);
      next();
    };
};

exports.init = function(app){
  app.use(passport.initialize());
  app.use(passport.session());
  return passport;
}
