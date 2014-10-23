var validator = require('validator'),
    _ = require('lodash');


exports.uploads = function(config){
  // allowed:['.png,'.jpg','...'] => permitted files
  // restrict => allow all but restrict this
  // size => size limit
  // flush_on_not_allowed => clear temp file- use unlink
  // onUpload = > where to move file after successful upload
  // bring code from busboy
};

function onUpload(tempFilePath){
  /*
  fs.rename(tempPath, targetPath, function(error) {
      if(error){
        return callback("cant upload employee image");
      }

      callback(null, newFileName);
    });*/
  // also integration point for file services in cloud
  // could generate event for file processing
  // for images could carry out processing like cropping etc.
}


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
/**
 * Middleware to protect pages from unauthenticated
 * acess.
 *
 * @param {object} config
 * @returns {function?}
 */
exports.secure = function(config){
  var redirPath = config['redirPath'] || '/sign-in';
  return function(req, res, next){
  		if(req.isAuthenticated()){ return next(); }
  			res.redirect(redirPath);
  }
}

/**
 * Middleware to protect APIs
 *
 * Just like above but protect APIs
 */
// API: Protect
exports.protected = function(req, res, next){
    if(req.isAuthenticated()){ return next(); }
      return res.send(401, 'You shall not pass!');
}

/**
 * Return fixture or additionally provided
 * static data for the route
 *
 * @param {obj} data to pad in response
 * @returns {function?}
 */

exports.fixture = function(obj, expose){
	if(obj){
		return function(req, res, next){
			_.extend(res.locals, obj);
			next();
		}
	}
	return null;
}


/**
 * Middleware to assign CORS on particular
 * or all responses
 *
 */

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
