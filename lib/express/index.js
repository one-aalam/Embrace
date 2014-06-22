var express = require('express')
	, http = require('http')
	, https = require('https')
	, fs = require('fs')
	, path = require('path')
	, logger = require('morgan')
	, favicon = require('static-favicon')
	, cookieParser = require('cookie-parser')
	, bodyParser = require('body-parser')
	, methodOverride = require('method-override')
	, session = require('express-session')
	, memoryStore = session.MemoryStore
	, log_to_file = require('../logger')

	, io = null

	, config = require('../configuration')
	, db = require('../db')

	, _root = process.cwd()

	, app = express()
	, router = express.Router(); // pre, with, post


	// set variables
	/*
	
	openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem (use for prod)
	openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

	 */
	var options = {
	  		key: fs.readFileSync('./keys/key.pem'),
	  		cert: fs.readFileSync('./keys/cert.pem')
		}
	, cookieSecret = "secret phrase"
	, sessionStore = new memoryStore();

	
	// Settings
	app.set('title', config.get('application:name'));

	app.set('config', config); 

	app.set('view engine','jade');
	app.set('views', path.join(_root, 'server', 'views'));
	
	
	//log_to_file.error('Initializing...');
	
	app.use(favicon());
	app.use(logger());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded());
	app.use(methodOverride());
	app.use(cookieParser(cookieSecret));
	app.use(function(req, res, next){
		req.config = config; // make config avaialble to requests
		next();
	});
	app.use(session({
	    secret: cookieSecret,
	    cookie: {httpOnly: true, secure: true},
	    store: sessionStore
	}));
	app.use(function(req, res, next){
	    res.locals.session = req.session;
	    next();
	});
	app.use(express.static( path.join(_root, 'public')));
    

    // Routing
    autoload = require('../autoload')({'router': router});

	router.get('/', function(req, res){
		res.render('index');
	});
	
	router.get('/about', function(req, res){
		res.send('@about');
	});

    app.use('/', router);
    // Server initilaization
	
	exports.startHttpServer = startHttpServer = function(app){
		var _server = http.createServer(app);
					  /*
					  https.createServer(options, app).listen(8443, function(){
					  	console.log('Secure server started');
					  });*/
		     io = require('socket.io').listen(_server);
			_server.listen(
							config.get('express:port'), 
							function(){
								//console.log('%s started at %s', config.get('application:name'), config.get('express:port'));
							}
						);
			io.on('connection', function(socket){
		     	console.log('socket connected!');
		     });
	};

    // Export
	//module.exports = app;
	exports.start = function(o){ 
	        var _db = db.connect() ;
				_db.on('open', function(){
					startHttpServer(app);
				});
		return app;
	}