var express = require('express'),
	http = require('http'),
	logger = require('morgan'),
	app = express();


	app.set('port', 3000);
	app.set('views', process.cwd() + '../views');


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
	
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Service started at %s', app.get('port'));
		
	});

	module.exports = app;