var fs = require('fs'),
    path = require('path');

function Autoload(d){
	var files = fs.readdirSync('../server/controllers');
	for(file in files){
		console.log(file);
	}
}

//module.exports = new Autoload(d);
module.exports = function(d){ //process.cwd()
	var files = fs.readdirSync(path.join(process.cwd() , '/server/controllers'));
	for(index in files){
		var _file = files[index];
	}
}