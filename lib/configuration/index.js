/**
 * A very simple configuration loader
 *
 * Usage:
 * Main script must be runned as `NODE_ENV=[environment] node|nodemon [entry_script]`
 * or
 * export NODE_ENV=production
 * node [entry_script]
 *
 */

var nconf = require('nconf'),
    _keySep = '_';


function Config(){
	// Use "_" as separator for nested environment
	// variables.
	// Consider arguments first and then environment
	// parameters.
	nconf.argv().env(_keySep);

	// Determine current environment
	var _env = nconf.get("NODE:ENV") || "development" ;

	// Load respective configuration file
	nconf.file( _env, "config/" + _env + ".json");

	// Also, load a default settings file
	nconf.file( "default", "config/default.json");
}

Config.prototype.get = function(key){
	return nconf.get(key);
}

module.exports = new Config();
