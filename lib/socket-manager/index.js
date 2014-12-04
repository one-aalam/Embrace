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
        accept();
      }

    function onAuthorizeFail(data, message, error, accept){// console.log(data);
      if(error) throw new Error(message);
      console.log('failed connection to socket.io:', message);
      if(error)
        accept(new Error(message));
    }

  

   io.on('connection', function(socket){
          clients.push(socket); console.log(socket);
		     	socket.on('disconnect', function(){
              console.log('Socket terminated for :' + socket);
		     	});
	 });
    return io;
}

module.exports.instance = function(){
  return io;
}
