var express = require('express'),
	http = require('http'),
	
	logger = require('morgan'),
	log_to_file = require('../logger'),
	
	config = require('../configuration'),
	//db = require('../db'),
	
	app = express(),
	// router instance
	router = express.Router();

	

	
	

	//log_to_file.error('Initializing...');
	app.use(express.static(__dirname + '../../public'));
	// Logging middleware
	app.use(logger());
	// Theme engine
	//app.engine('jade', require('jade').__express);
    app.set('view engine','jade');
	app.set('views', __dirname + '../../views');
	app.set('_root', process.cwd());

    // Routing
    autoload = require('../autoload')({'router': router});

	router.get('/', function(req, res){
		res.send('@home');
	});
	
	router.get('/about', function(req, res){
		res.send('@about');
	});

    app.use('/', router);
    // Server initilaization
	
	http.createServer(app).listen(config.get('express:port'), function(){
		console.log('%s started at %s', config.get('application:name'), config.get('express:port'));
	});

    // Export
	module.exports = app;