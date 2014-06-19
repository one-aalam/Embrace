var express = require('express'),
	http = require('http'),
	
	logger = require('morgan'),
	log_to_file = require('../logger'),
	
	config = require('../configuration'),
	
	app = express();

	
	app.set('views', __dirname + '../views');

	log_to_file.error('Initializing...');
	app.use(express.static(__dirname + '/public'));
	// Logging middleware
	app.use(logger());
	// Theme engine
	app.engine('jade', require('jade').__express);

	app.get('/', function(req, res){
		res.render('index');	
	});
	app.get('/api', function(req, res){
		res.end('Direct hitting of api is not allowed');	
	});

	app.get('/api/test', function(req, res){
		res.set('Content-Type', 'application/json');
		res.json({'some':'json'});
	});
	
	http.createServer(app).listen(config.get('express:port'), function(){
		console.log('%s started at %s', config.get('application:name'), config.get('express:port'));
	});

	module.exports = app;