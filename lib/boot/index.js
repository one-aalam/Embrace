var express = require('express')
  , path = require('path')
  , Server = require(path.join(__dirname,'lib','boot'))

  , _root = process.cwd(),
  
  , App = express();



exports.configure = configure = function(app){

	app.set('view engine','jade');
	app.set('views', __dirname + '../../views');
	app.set('_root', process.cwd());

	return app;
};


exports.attach = attach = function(app){

};



exports.start = start = function(app){

	app.set('_root', process.cwd());
	return app;
};