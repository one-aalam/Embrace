
var path = require('path'),
    fs = require('fs');

function Di(func){
	var _func = func || '',
	    _deps = {},
		_regExComment = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
		_regExParams = /([^\s,]+)/g,
		
		firstCap = function(string){
			return string.charAt(0).toUpperCase() + string.slice(1);	
		};

	
	this.isFunc = function(){
		return typeof this.func == 'function';
	};
	
	this.func = function(fn){ 
		_func = fn;
		return this;
	};

	this.addDeps = function(dirModel){
		filesModel = fs.readdirSync(dirModel);
		filesModel.forEach(function(fileModel){
			var fileExt = path.extname(fileModel),
				fileName = path.basename(fileModel, fileExt); 
			
				if( fileExt == '.js' && fileName != 'index'){
					_deps[fileName.toLowerCase()] = require(path.join(dirModel, fileModel));
				}
		});
		//funcSuccess();
	};

	this.attachDeps = function(_aux){
		var _args = [];
		this.getParams().forEach(function(param){
			var _dep = param.toLowerCase();
			//console.log('Resolving %s', _dep);
			if(_deps[param.toLowerCase()]){
				_args.push(
					_deps[param.toLowerCase()]
					);
			}else{
				if(_aux[param.toLowerCase()]){
					_args.push(
						_aux[param.toLowerCase()]
					);
				}else{
					console.log('Couldn\'t resolve %s', param );
				}
			}
			
		}); 
		_func.apply({}, _args);
	};
	
	this.getParams = function(){
		 var _funcStr = _func.toString().replace(_regExComment, ''),
			 _funcParams = _funcStr
		 						.slice(_funcStr.indexOf('(')+1, _funcStr.indexOf(')'))
		 						.match(_regExParams);
			if(_funcParams === null) {
				_funcParams = [];
			}
		return _funcParams;
	};

	this.getDeps = function(){
		return _deps;
	}
}

module.exports = new Di();