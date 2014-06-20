
function Di(func){
	var _func = func || '',
		_regExComment = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
		_regExParams = /([^\s,]+)/g,
		
		firstCap = function(string){
			/*
		}
			function (string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};	*/
			
		};

	
	this.isFunc = function(){
		return typeof this.func == 'function';
	};
	
	this.func = function(fn){ 
		_func = fn;
		return this;
	};
	
	this.getParams = function(){
		 var _funcStr = _func.toString().replace(_regExComment, ''),
			 _funcParams = _funcStr
		 						.slice(_funcStr.indexOf('(')+1, _funcStr.indexOf(')'))
		 						.match(_regExParams);
			if(_funcParams === null) {
				_funcParams = [];
			}
		    console.log(_funcParams);
		return _funcParams;
	};
}

module.exports = new Di();