var fs = require('fs'),
    path = require('path'),

	Di   = require('../di'),
	Db  = require('../db'),
	App = require('../express').app,
	Io  = require('../socket-manager').io,
	Mw  = require('../middleware-manager'),
	Tr  = require('../transformer'),
	Pp  = require('passport'),

    dirSrv = path.join(process.cwd(), 'server'),
    dirCtrl = path.join(dirSrv, 'controllers'),
    dirModel = path.join(dirSrv, 'models');


function Autoload(App, Router){
	var filesCtrl = fs.readdirSync(dirCtrl);

	    Di.addDep('models', Models);
      Di.addDep('$M', Models);
	    //
	    // @todo : enhance....
	    Di.addDep('app', App);

	    Di.addDep('Io', Io);
      Di.addDep('$io', Io);


      // Symbols
	    Di.addDep('router', Router);
      Di.addDep('$R', Router);
      Di.addDep('_r', Router.route);


		Di.addDep('db', Db); // Mongoose
    Di.addDep('$db', Db);

		Di.addDep('mw', Mw); // middleware
    Di.addDep('$mw', Mw);


		Di.addDep('tr', Tr); // transformer
		Di.addDep('passport', Pp);
	    Di.addDeps(dirModel);
	    //Di.addRouter('router', o['router']);


		filesCtrl.forEach(function(fileCtrl){
			var fileExt = path.extname(fileCtrl),
				fileName = path.basename(fileCtrl, fileExt);

				if( fileExt == '.js' && fileName != 'index'){
					console.log('Adding Controller: ' + fileName);
					fileCtrl = require(path.join(dirCtrl, fileCtrl));

					if(typeof fileCtrl == 'function'){
						fileCtrl(Router || '');
					}
					//
					if(fileCtrl['setup'] && typeof fileCtrl['setup'] == 'function'){
						// exec setup
						console.log('Resolving Dependencies: ' + fileName);
						Di.func(fileCtrl['setup']).attachDeps({});
					}
				}

		});

}

exports.load = loadModels = function(App){
	filesModel = fs.readdirSync(dirModel),
	    Models = {};

		filesModel.forEach(function(fileModel){
			var fileExt = path.extname(fileModel),
				fileName = path.basename(fileModel, fileExt);
				if( fileExt == '.js' && fileName != 'index'){
					Models[fileName.toLowerCase()] = require(path.join(dirModel, fileModel));
				}
		});
};

exports.init = Autoload;
