var mongoose = require('mongoose')
	, passport = require('passport')
	, events = require('events')
	, _ = require('lodash')
	, io  = require('../socket-manager/')
	, app  = require('../express')
	, util = require('util')
	, config = require('../configuration')

	, options = {
		server: { auto_reconnect: true, poolSize: 10 }
	  }
	, url = 'mongodb://' + config.get('db:mongo:host') + ':' + config.get('db:mongo:port') + '/' +  config.get('db:mongo:db');

/**
 * Connection creation
 */
function Conn(){
	this.conn = null;
	events.EventEmitter.call(this);
}
util.inherits(Conn, events.EventEmitter);

Conn.prototype.connect = function(o){
	var self = this,
	    options = {
			closeOnExit: true
		};
	this.conn = mongoose.connect(url,options);

				mongoose.connection.on('connected',function(){
								self.emit('connected');
				});
	            // If the connection throws an error
				mongoose.connection.on("error", function(err) {
								self.emit('error');
				  				//console.error('Failed to connect to DB ');
				});
				// When the connection is disconnected
				mongoose.connection.on('disconnected', function () {
								self.emit('disconnected');
				  				//console.log('Mongoose default connection to DB :' );
				});

	            if(options.closeOnExit){
					var gracefulExit = function() {
					  mongoose.connection.close(function () {
					    console.log('Mongoose default connection with DB is disconnected through app termination');
					    process.exit(0);
					  });
					}
					// If the Node process ends, close the Mongoose connection
					process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
				}
	return this;
}

exports.connection = function(){
	return mongoose.createConnection(url, options);
};

exports.connect = function(){
	return mongoose.connect(url,options);
}


exports.Conn = Conn;

/*

exports.errorHelper = function(err, cb) {
    //If it isn't a mongoose-validation error, just throw it.
    if (err.name !== 'ValidationError') return cb(err);
    var messages = {
        'required': "%s is required.",
        'min': "%s below minimum.",
        'max': "%s above maximum.",
        'enum': "%s not an allowed value."
    };

    //A validationerror can contain more than one error.
    var errors = [];

    //Loop over the errors object of the Validation Error
    Object.keys(err.errors).forEach(function (field) {
        var eObj = err.errors[field];

        //If we don't have a message for `type`, just push the error through
        if (!messages.hasOwnProperty(eObj.type)) errors.push(eObj.type);

        //Otherwise, use util.format to format the message, and passing the path
        else errors.push(require('util').format(messages[eObj.type], eObj.path));
    });

    return cb(errors);
}*/

exports.model = function(modelName){
	return crudify({
		'modelName':modelName
	});
}

exports.crudify = crudify = function(Schema,realTime){

	var Model = mongoose.model(Schema.modelName),
			Sockets= null;


	return {
		add: function(data, done){
			var Doc = new Model(data || {} );
				Sockets = io.instance().sockets;

				Doc.save(function(err){
					if(err) return done(err);
					Model.findById(Doc, function(err, _Doc){
						if(realTime){
							Sockets.emit('model:added',{data:_Doc});
						}
						done(err, _Doc);
					});
				});
		},
		rem: function(data, done){
			Model.findById(data._id, function(err, _Doc){
				if(err) return done(err);
				if(_Doc){
					_Doc.remove(function(err){
							done(err, _Doc);
					});
				}else{
					done(err, null);
				}
			});
		},
		upd: function(query, upd, done){
			Model.update(query, {$set: upd}, {upsert:true}, function(err){
				done(err. null);
			});
		},
		get: function(data, done){
			Model.findOne(data || {}, function(err, _Docs){
				done(err, _Docs);
			});
		},
		all: function(done){
			Model.find(function(err, _Docs){
				done(err, _Docs);
			});
		},
		one: function(data, done){
			Model.findOne(data, function(err, _Doc){
				done(err, _Doc);
			});
		},
		getOrAdd: function(data, done){
			var self = this;
			this.one(data, function(err, _Doc){
				if(err) return err;
				if(_Doc && _Doc['_id']){
					done(null, _Doc);
				}else{
					self.add(data, function(err, _Doc){
						done(err, _Doc);
					});
				}
			});
		}
	};
}
