
var socket = io();//.connect('//' + window.location.host);

	

	socket.on('model:added', function(data){
			alert(JSON.stringify(data));
	});
