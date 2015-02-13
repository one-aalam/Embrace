var http = require('http'),
	fs = require('fs'),
	path = require('path'),
    mongoose = require('mongoose'),
    emailjs = require('emailjs'),
    socket  = require('socket.io');

// Map routes to controllers
function map(app){ 
	var dir = path.join(app.get('dir'),'routes'),
	    routes = [];
	fs.readdir(dir,function(err,files){
		if(err) quit(err,dir);
		if(files.length){
			files.forEach(function(file){
				var fname = file.split('.')[0];
				var routes = require(path.join(dir,file));
				if(typeof routes === 'object'){
					var controller = path.join(app.get('dir'),'controllers',file);
					fs.exists(controller,function(exists){ 
						if(exists){
							controller = require(controller);
							for(var route in routes){
								var routeParts = route.split(' '),
								    type = routeParts[0].indexOf('/') == -1 ? routeParts[0] : 'get',
								    url    = routeParts[routeParts.length -1],
								    secure = routes[route].indexOf(':') != -1 && routes[route].split(':')[1] == 'secure' ? true : false,
								    method = !secure ? routes[route] : routes[route].split(':')[0] ,
								    checkSecure = function(req,res,next){
								    	if(req.session.user){
								    		console.log("check secure:valid");next();
								    	}else{
								    		res.send("invalid");
								    	}
								    	
								    },
								    method = method != '' && controller[method] && typeof controller[method] === 'function' ? method : false ;
								/*
								console.log({
									'type':type,
									'url':url,
									'method': method
								});*/

								

								
								if(type && url && method){
									switch(type.toLowerCase()){
										case 'get':
											if(secure){
												app.get(url,checkSecure,controller[method]);
											}else{
												app.get(url,controller[method]);
											}
											break;
										case 'post':
										    app.post(url,controller[method]);
										    break;
										case 'put':
										    app.put(url,controller[method]);
										    break;
										case 'delete':
										    app.del(url,controller[method]);
										    break;
										default:
										    console.log(url + " ignored as '" + type + "' is not a valid HTTP verb!");
										    break;
									}
								}
								//var fn = routes[route] ; // function name
								//console.log(typeof fn);
							}
						}else{
							console.log("Unable to load controller for "+ fname);
						}
					});
					
				}
			})
		}
	});
}


function quit(err,dir){ 
	//if(err) throw err;
	switch(err.code){
		case 'ENOENT':
			console.log(dir + ' not found!');
		break;
		default:
	}
}

// Step one
exports.start = function(app){
	mongoose.connect('mongodb://127.0.0.1/'+app.get('db').name);

	

	mongoose.connection.on('open',function(){
			// do all mappings 
		map(app);
		// Start server
		var server = http.createServer(app),
			io     = socket.listen(server);
			server.listen(app.get('port'), function(){
				// Mailr to be used throughout application
			var mailr  = emailjs.server.connect({
		   		user:    "aftabbuddy", 
		   		password:"get8mei9", 
		   		host:    "smtp.gmail.com", 
		   		ssl:     true
			}); // io socket
			/*	Move in separate notification library
			server.send({
			   text:    "i hope this works", 
			   from:    "aftabbuddy@gmail.com", 
			   to:      "aftabbuddy@gmail.com",
			   cc:      "",
			   subject: "testing emailjs",
			   attachment: 
			   [
			      {data:"<html>i <i>hope</i> this works!</html>", alternative:true},
			      //{path:"path/to/file.zip", type:"application/zip", name:"renamed.zip"}
			   ]
			}, function(err, message) { console.log(err || message); }); */
	  		console.log('Express server listening on port ' + app.get('port'));
		});
		var clients = 0 ;
		io.sockets.on('connection',function(socket){
			clients += 1;
			// Map different events available to this socket
			// socket.emit('evt',payload)
			// io.sockets.emit('evt',payload)
			socket.on('disconnect',function(){
				clients -=1 ;
			});
		});
		// Namespace based
		io.of('/post').on('connection',function(socket){
			socket.broadcast.emit('hello from post');
		});
	});
	
}
