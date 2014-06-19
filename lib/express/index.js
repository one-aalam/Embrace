var express = require('express'),
	http = require('http'),
	
	logger = require('morgan'),
	log_to_file = require('../logger'),
	
	config = require('../configuration'),
	//db = require('../db'),
	autoload = require('../autoload')(__dirname),
	
	app = express(),
	router = express.Router();

	
	

	//log_to_file.error('Initializing...');
	app.use(express.static(__dirname + '../../public'));
	// Logging middleware
	app.use(logger());
	// Theme engine
	app.engine('jade', require('jade').__express);
	app.set('views', __dirname + '../../views');

    // Routing


	router.get('/api/test', function(req, res){
		res.set('Content-Type', 'application/json');
		res.json({'some':'json'});
	});

    app.use('/api', router);
    // Server initilaization
	
	http.createServer(app).listen(config.get('express:port'), function(){
		console.log('%s started at %s', config.get('application:name'), config.get('express:port'));
	});

    // Export
	module.exports = app;