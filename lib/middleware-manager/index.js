var validator = require('validator'),
    _ = require('lodash'),
    url = require('url');


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
// works with routes of format "/users/:format?" => .json
exports.padAccepts = function(){
  return function(req, res, next){
    var format = req.param('format');
    if(format){
      req.headers.accept = 'application/' + format;
    }else if (url.parse(req.url).pathname.match(/\.json$/)) {
      req.headers.accept = 'application/json';
    }
    else if (url.parse(req.url).pathname.match(/\.xml$/)) {
      req.headers.accept = 'application/xml';
    }
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
