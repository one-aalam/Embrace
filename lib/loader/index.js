var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    express = require('express'),

	Di   = require('../di'),
	Db  = require('../db'),
  debug = require('../debug'),
	App = require('../express').app,
	Io  = require('../socket-manager').io,
	Mw  = require('../middleware-manager'),
	Tr  = require('../transformer'),
	Pp  = require('passport'),

  Email = require('../email'),

    dirSrv = path.join(process.cwd(), 'server'),
    dirCtrl = path.join(dirSrv, 'controllers'),
    dirModel = path.join(dirSrv, 'models');

    // Separator
  const _separator = '_',
        _canVersion = true;


function Autoload(App, Router){
	var filesCtrl = fs.readdirSync(dirCtrl);

	    Di.addDep('models', Models);
      Di.addDep('$M', Models);
	    //
	    // @todo : enhance....
	    Di.addDep('app', App);

	    Di.addDep('Io', Io);
      Di.addDep('$io', Io); console.log(Email);

      Di.addDep('email', Email);


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
				fileName = path.basename(fileCtrl, fileExt),
        nS = '';

				if( fileExt == '.js' && fileName != 'index'){
					console.log('Adding Controller: ' + fileName);

          // Additional condition for API versioning
          // Comes in effect when detached routes are
          // used via express.Router() and it's value is returned
          // App's Router don't requires return
          if(_canVersion && _.contains(fileName,_separator)){
            // do versioning
            var parts = fileName.split(_separator);
                parts.shift();
            nS = parts.reverse().join('/');

          }
					fileCtrl = require(path.join(dirCtrl, fileCtrl));

					if(typeof fileCtrl == 'function'){
						var _return = fileCtrl(Router || '');
            debug(typeof _return)
					}
					//
					if(fileCtrl['setup'] && typeof fileCtrl['setup'] == 'function'){
						// exec setup
						console.log('Resolving Dependencies: ' + fileName);
						var _return = Di.func(fileCtrl['setup']).attachDeps({});
            if(typeof _return == 'function'){ 
              App.use('/'+nS, _return); //Namespaced APIs
            }
					}
				}

		});

    App.use('/', Router);

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
