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

exports.secure = function(config){

	return function(req, res, next){

		next();
	}
}