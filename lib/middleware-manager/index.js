var validator = require('validator'),
    _ = require('lodash');

var funcSpecifier = ':';


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
 * Looks up a module by path and returns it. Optionally specify
 * a specific method to call using '#'-notation.
 * @example
 *  _path = 'lib/middleware.js:myFunc'
 * @module utils
 * @param {string} _path - the relative(to cwd) path to search
 * @returns {function}
 */
 // source:reducto
function lookupFn(_path){
  var parts = _path.split(funcSpecifier),
      modulePath = path.resolve(process.cwd(), parts[0]);
  var mod;
  try {
    mod = require(modulePath);
    return parts.length > 1? mod[parts[1]] : mod;
  } catch(e) {
    throw new TypeError('No module found at ' + modulePath);
  }
};

/**
 * Takes a config object and a list of functions to
 * configure middleware and push onto the stack.
 * @param {object} config - current route config
 * @param {function,?} n number of configuration functions
 * @returns {array} a list of middleware functions
 */
 // source: reducto
exports.loadStack = function(config){
  var args = _.rest(_.toArray(arguments));
  var stack = [];
  args.forEach(function(fn){
    var out = fn(config);
    if ( out ) {
      if ( _.isArray(out) ){
        stack = stack.concat(out);
      } else {
        stack.push(out);
      }
    }
  });
  return stack;
};



exports.SPA = function(config){

  /**
   * config.excludePath
   * config.render
   *
   * @inspire https://github.com/dmotz/express-spa-router/blob/master/index.js
   */
  var _exclude = ['/api','/public','/assets', '/css', '/js', '/build'];

  function doSkip(req){
    return _.any(_exclude, function (url) {
  		return req.url.substr(0, url.length) === url;
  	});
  }

  return function(req, res, next){
      if(doSkip(url)){
        return next();
      }

      if(config.data){
        _.extend(res.locals, config.data);
      }

      if(config.assets){
        _.extend(res.locals, config.assets)
      }

      if(config.render && typeof config.render == 'string'){
        res.render(config.render);
      }else{
        res.render('spa-no-main');
      }
  };
}

exports.token = function(config){
  var data = config.data ? config.data : typeof config == 'string' ? config : '';
  return function(req, res, next){/*
    // https://github.com/alexanderbeletsky/backbone-express-spa/blob/master/source/middleware/auth.js
    var username = req.user.username;
	var timespamp = moment();
	var message = username + ';' + timespamp.valueOf();
	var hmac = crypto.createHmac('sha1', AUTH_SIGN_KEY).update(message).digest('hex');
	var token = username + ';' + timespamp.valueOf() + ';' + hmac;
	var tokenBase64 = new Buffer(token).toString('base64');

	req.token = tokenBase64;*/
  }
}

// Middleware loader
/**
 * Get an array of method names, run a look up
 * and send matching methods
 *
 */
exports.middleware = function(config){
  if(config.middleware){
    return config.middleware.map(lookupFn);
  }
  return null;
}

/**
 * A Simple middleware to transform data
 * before sending it down the wire
 *
 * @param {object} config
 * @returns {function?}
 */

exports.transforms = function(config){
  if ( config.transform ) {
    return config.transform.map(function(fn){
      var transFn = lookupFn(fn);
      return function(req, res, next){
        res.locals = transFn(res.locals);
        next();
      };
    });
  }
  return null;
};


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
