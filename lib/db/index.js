var mongoose = require('mongoose'),
	config = require('../configuration'),
	
	url = 'mongodb://' + config.get('db:mongo:host') + '/' + config.get('db:mongo:port');
	


module.exports = mongoose.connect(url); 