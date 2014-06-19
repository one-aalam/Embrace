var fs = require('fs'),
    path = require('path'),

    srvDir = path.join(process.cwd(), '/server'),
    ctrlDir = path.join(srvDir, '/controllers'),
    modelDir = path.join(srvDir, '/models');

function Autoload(d){
	var files = fs.readdirSync('../server/controllers');
	for(file in files){
		console.log(file);
	}
}

//module.exports = new Autoload(d);
module.exports = function(app){ //process.cwd()
	var filesCtrl = fs.readdirSync(ctrlDir),
	    filesModel = fs.readdirSync(modelDir);
	for(index in filesCtrl){
		var _file = filesCtrl[index],
			_ext  = path.extname(_file),
		    _name = path.basename(_file, _ext);
		 if( _ext == '.js' && _name != 'index'){
		 	require(ctrlDir + '/' + _file)(app);
		 }
	}
}