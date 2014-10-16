var validator = require('validator'),
    _ = require('lodash');


/**
 * A very simple middleware to validate form
 * data before they hit actual route handler
 *
 */

exports.validate = function(config){
	var _err = [];
	return function(req, res, next){
		_err = [];
		_.each(req.body, function(_val, _key){
			if(config[_key] && config[_key].length){
				_.each(config[_key], function(_rule){
					if(validator[_rule]){
						if(!validator[_rule](_val)){
							_err.push({
								field: _key,
								value: _val,
								failsFor: _rule
							});
						}
					}
				});
			}
		});
		if(_err.length){
			req.errors = _err;
		}
		//
		next();
	};
}
// Page: Protect
exports.secure = function(req, res, next){
		if(req.isAuthenticated()){ return next(); }
			res.redirect('/sign-in');
}
// API: Protect
exports.protected = function(req, res, next){
    if(req.isAuthenticated()){ return next(); }
      return res.send(401, 'You shall not pass!');
}

exports.fixture = function(obj, expose){
	if(obj){
		return function(req, res, next){
			_.extend(res.locals, obj);
			next();
		}
	}
	return null;
}

exports.CORS = function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
       res.send(200);
   } else {
       next();
   }
}
