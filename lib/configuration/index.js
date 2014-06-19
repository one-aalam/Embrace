var nconf = require('nconf');


function Config(){
	nconf.argv().env("_");
	var _env = nconf.get("NODE:ENV") || "development" ;
	nconf.file( _env, "config/" + _env + ".json");
	nconf.file( "default", "config/default.json");
}

Config.prototype.get = function(key){
	return nconf.get(key);
}

module.exports = new Config();