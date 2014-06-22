var mongoose = require('mongoose'),
	config = require('../configuration'),
	options = { 
		server: { auto_reconnect: true, poolSize: 10 }
	},
	url = 'mongodb://' + config.get('db:mongo:host') + ':' + config.get('db:mongo:port') + '/' +  config.get('db:mongo:db');
	

exports.connect = function(){
	return mongoose.createConnection(url, options); 
};
//module.exports = mongoose.connect(url, options); 