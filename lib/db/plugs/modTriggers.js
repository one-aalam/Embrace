var events = require('events'),
    util = require('util');

function Observer(){
	events.EventEmitter.call(this);
}
util.inherits(Observer, events.EventEmitter);


module.exports = exports = function(schema, options){
	
	// Prepare...
	schema.post('save', function(doc){
	    Observer.emit('model:added', {data:doc});
		next();
	});

	schema.post('remove', function(doc){
		Observer.emit('model:removed', {data:doc});
		next();
	});
}