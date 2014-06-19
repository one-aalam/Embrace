var express = require('express'),
	http = require('http'),
	app = express();

	app.set('port', 3000);


	app.use(express.static(__dirname + '/public'));
	app.engine('jade', require('jade').__express);

	app.get('/', function(req, res){
		res.end('hiya');	
	});
	app.get('/api', function(req, res){
		res.end('Direct hitting of api is not allowed');	
	});

	app.get('api/test', function(req, res){
		res.json(200,'OK');
	});
	
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Service started at ' + app.get('port'));
		
	});

	module.exports = app;