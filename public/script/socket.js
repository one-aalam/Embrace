
var socket = io();//.connect('//' + window.location.host);

$(document).foundation();

	

	socket.on('model:added', function(data){
			alert(JSON.stringify(data));
	});
