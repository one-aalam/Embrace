var socketio = require('socket.io'),
    cookie = require('../utils').parseCookies,
    MemoryStore = require('express-session').MemoryStore,
    sessionStore = new MemoryStore(),
    passportSocketIo = require('passport.socketio'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    //sessionStore = require('session.socket.io'),
    clients = [],
    io = null;

module.exports.listen = function(server, _sessionStore, _pp){

    io = socketio.listen(server);
    io.set('log level', false);

    io.use(passportSocketIo.authorize({
        passport:_pp,
        cookieParser: cookieParser,
        key:         'express.sid',       // the name of the cookie where express/connect stores its session_id
        secret:      'SECRET_PHRASE',    // the session_secret to parse the cookie
        store:       _sessionStore,        // we NEED to use a sessionstore. no memorystore please
        success:     onAuthorizeSuccess,  // *optional* callback on success - read more below
        fail:        onAuthorizeFail,     // *optional* callback on fail/error - read more below
    }));



    function onAuthorizeSuccess(data, accept){
        console.log('successful connection to socket.io');
      //  console.log(data);
        // If you use socket.io@1.X the callback looks different
        accept();
      }

    function onAuthorizeFail(data, message, error, accept){// console.log(data);
      if(error)
        throw new Error(message);
      console.log('failed connection to socket.io:', message);


      // If you use socket.io@1.X the callback looks different
      // If you don't want to accept the connection
      if(error)
        accept(new Error(message));
      // this error will be sent to the user as a special error-package
      // see: http://socket.io/docs/client-api/#socket > error-object
    }

  //  return io;

    /*
    users = io.of('/users')
    users.on('connection', function(socket){
        ..socket.on ...
    });*/
/*
	io.use(function(socket, next){
		//console.log(socket.handshake.headers.cookie); console.log(socket.request.headers.cookie);
		var data = socket.request;
		if(data.headers.cookie){
			data.cookie = cookie(data.headers.cookie);
			var connectSid = data.cookie['connect.sid'];
			data.sessionID = {}; //connectSid.split(':')[1].split('.')[0];
			data.sessionStore = sessionStore;
			// (literally) get the session data from the session store

        	sessionStore.get(data.sessionID, function (err, session) {
            if (err || !session) { console.log('no session');
                // if we cannot grab a session, turn down the connection
                //accept('Error', false);
            } else {
                // save the session data and accept the connection
                data.session = session;
                //accept(null, true);
            }
        });
			return next();
		}
		//if (socket.request.headers.cookie) return next();
		else{
  			next(new Error('Authentication error'));
  		}
	});*/
/*

    io.on('connection', function(socket){
                clients.push(socket);
		     	socket.emit('news', {hello: socket});
		     	socket.on('mail', function(data){
		     		//console.log(data);
		     	});

		     	socket.on('disconnect', function(){
              console.log('Socket terminated for :' + socket);
		     	});
	});*/

    return io;
}

module.exports.instance = function(){
  return io;
}
