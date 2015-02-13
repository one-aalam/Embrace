var express = require('express')
	, mongoose = require('mongoose')
	, http = require('http')
	, https = require('https')
	, fs = require('fs')
	, path = require('path')

	  // middlewares: community
	, logger = require('morgan')
	, favicon = require('serve-favicon')
	, csrf    = require('csurf')
	, cookieParser = require('cookie-parser')
	, bodyParser = require('body-parser')
	, methodOverride = require('method-override')
	, session = require('express-session')
	, busboy = require('connect-busboy')
	, busboyAppend = require('../busboy')
	, MemoryStore = session.MemoryStore
	, log_to_file = require('../logger')


	, io = null

	, loader = require('../loader')
	, config = require('../configuration')
	, db = require('../db')
	, passport = require('passport')
	, authManager = require('../auth-manager')

	, _root = process.cwd()

	, app = express()
	, router = express.Router(); // pre, with, post

  // Security & SSL
	var options = {
	  		key: fs.readFileSync('./keys/key.pem'),
	  		cert: fs.readFileSync('./keys/cert.pem')
		}
	, cookieSecret = config.get('session:secret')
	, sessionStore = new MemoryStore();

	// Settings
	app.set('title', config.get('application:name'));
	app.set('config', config);
	app.set('view engine','jade');
	app.set('views', path.join(_root, 'server', 'views'));


	//log_to_file.error('Initializing...');

	//app.use(favicon());
	app.use(logger());
	//app.use(bodyParser.json());
	//app.use(bodyParser.urlencoded());
	app.use(methodOverride());
	app.use(cookieParser(cookieSecret));
	// File upload
	app.use(busboy({immediate:true}));
	app.use(busboyAppend.ff({
		'dir':'./temp'
	}));
    // Config middleware
	app.use(function(req, res, next){
		req.config = config; // make config avaialble to requests
		next();
	});
  // Session initialize
	app.use(session({
	    secret: cookieSecret,
			cookie: {httpOnly: true/*secure: config.get('session:secure')*/},//{'path': '/', 'httpOnly': true, maxAge: 60 * 60 * 1000},
	    store: sessionStore,
	    key:'express.sid'
	}));
	// ORDER IS IMPORTANT!
	// cookie, session, CSRF
	// CSRF middleware
	app.use(csrf());
	////
	// error handler
	app.use(function (err, req, res, next) {
	  if (err.code !== 'EBADCSRFTOKEN') return next(err)

	  // handle CSRF token errors here
	  res.status(403)
	  res.send('session has expired or form tampered with')
	});

	// pass the csrfToken to the view
	// checked in req.body._csrf, req.query._csrf, x-csrf-token
	app.use(function(req, res, next) {
  		var token = req.csrfToken();
  		res.locals._csrf = token;
  		// required for SPA apps...
  		res.cookie('XSRF-TOKEN', token);
  		next();
	});
	// Passport
	var _pp = authManager.init(app);
	app.use(authManager.strategies(
												[
													'local',
													'facebook',
													'twitter',
													'linkedin'
													]
													)); // Pass applicable strategies

	loader.load(); // load models
  // Session stamping
	app.use(function(req, res, next){
	    res.locals.session = req.session;
	    next();
	});
  // Static resource folder
	app.use(express.static( path.join(_root, 'public')));
  // Load routes
  loader.init(app, router);
	// Mount routes @ '/'
  //app.use('/', router);
	exports.startHttpServer = startHttpServer = function(app,o){
				var server = http.createServer(app);

				   	io = require('../socket-manager').listen(server, sessionStore, _pp);
						// Later usage
				   	app.set('_io', io); // save sockets connection
						app.set('_server', server);

					//}
				// Run when secure
				/*
					 https.createServer(options, app).listen(8443, function(){
							console.log('Secure server started');
					});*/

					server.listen(
							config.get('express:port'),
							function(){
								console.log('%s started at %s', config.get('application:name'), config.get('express:port'));
					});


	};

	exports.start = function(o){
					var Conn = new db.Conn();

					Conn.on('connected', function(){
						startHttpServer(app,o);
					});
					Conn.on('error', function(err){
							console.log('Embrace couldnt find an open DB connection! :(');
					});

					Conn.connect();
		return app;
	}

	// Export
module.exports.instance = function(){
		return app;
}
