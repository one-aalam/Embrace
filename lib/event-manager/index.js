	var EventEmitter3 = require('eventemitter3').EventEmitter3, _ref;
	var util = require('util');
	function Eventful() {
		EventEmitter3.call(this, {
			wildcard: true,
			delimiter: '/',
			maxListeners: 0
		});
	}
	util.inherits(Eventful, EventEmitter3);
	module.exports = (_ref = global.Eventful) != null ? _ref : new Eventful();