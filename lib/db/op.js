var async = require('async'),
	debug = require('../debug'),
	db = require('.');

function wipe(modelName, cb){
	debug("Wiping model: " + model);
	db.model(modelName).remove(cb);
}

export.remove = function(){
	async.forEachSeries(
		Object.keys(db.models), 
		wipe,
		function(err){
			if (err) return debug(err);
			debug('Done with clean-up!');
			process.exit(1);
		}
		); 
}


