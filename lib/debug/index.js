var DEBUG = true;
var ENV = process.env.NODE_ENV || '';

module.exports = function(){
  if (DEBUG) {
      var args = Array.prototype.slice.apply(arguments),
          i, len;

      for (i = 0, len = args.length; i < len; ++i) {
          console.log('[DEBUG][Email]', args[i]);
      }
  }
}
