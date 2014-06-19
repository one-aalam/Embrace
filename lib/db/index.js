var mongoose = require('mongoose'),
	config = require('../configuration'),
	options = { 
		server: { auto_reconnect: true, poolSize: 10 }
	},
	url = 'mongodb://' + config.get('db:mongo:host') + '/' + config.get('db:mongo:port');
	


module.exports = mongoose.connect(url, options); 