var fs = require('fs'),
    path = require('path'),
	
	Di   = require('../di'),

    dirSrv = path.join(process.cwd(), '/server'),
    dirCtrl = path.join(dirSrv, '/controllers'),
    dirModel = path.join(dirSrv, '/models');

function Autoload(o){ 
	var filesCtrl = fs.readdirSync(dirCtrl),
	    filesModel = fs.readdirSync(dirModel);
	
		filesCtrl.forEach(function(fileCtrl){
			var fileExt = path.extname(fileCtrl),
				fileName = path.basename(fileCtrl, fileExt); 
			
				if( fileExt == '.js' && fileName != 'index'){
					fileCtrl = require(path.join(dirCtrl, fileCtrl));
					
					if(typeof fileCtrl == 'function'){
						fileCtrl(o['router'] || '');
					}
					//
					if(fileCtrl['setup'] && typeof fileCtrl['setup'] == 'function'){
						// exec setup
						Di.func(fileCtrl['setup']).getParams();
						
					}
				}
			
		});
	
}


module.exports = Autoload;