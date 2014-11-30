var DEBUG = true;
var ENV = process.env.NODE_ENV || '';

var caller = require('caller'),
	path = require('path');

module.exports = function(){
  if (DEBUG) {
      var args = Array.prototype.slice.apply(arguments),
          i, len;
       // get file 
       var _caller = caller();
     		_caller = path.basename(
       						_caller.indexOf('index.js') != -1 ?
       						_caller.replace('index.js','') :
       						_caller
       						);

      for (i = 0, len = args.length; i < len; ++i) {
          console.log('[DEBUG]['+ _caller +']', args[i]);
          
      }
  }
}
