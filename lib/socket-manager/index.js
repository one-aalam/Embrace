var socketio = require('socket.io'),
    cookie = require('../utils').parseCookies,
    MemoryStore = require('express-session').MemoryStore, 
    sessionStore = new MemoryStore(),
    clients = {};

module.exports.listen = function(app, sessionStore){ 
    io = socketio.listen(app);

    /*
    users = io.of('/users')
    users.on('connection', function(socket){
        ..socket.on ...
    });*/

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
			// check n go...
			return next();
		}
		//if (socket.request.headers.cookie) return next();
		else{
  			next(new Error('Authentication error'));
  		}
	});

	


    io.on('connection', function(socket){
    	    //console.log(socket.handshake);
    	        //console.log(socket);
		     	socket.emit('news', {hello: 'world'});
		     	socket.on('mail', function(data){
		     		//console.log(data);
		     	});

		     	socket.on('disconnect', function(){

		     	});
	});

    return io;
}