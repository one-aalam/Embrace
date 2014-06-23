
var socket = io.connect('http://localhost');
	socket.on('news', function(data){
		console.log(data);
		socket.emit('mail', {my:'data'});
	});