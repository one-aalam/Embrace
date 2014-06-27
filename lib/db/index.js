var mongoose = require('mongoose')
	, events = require('events')
	, util = require('util')
	, config = require('../configuration'),
	options = { 
		server: { auto_reconnect: true, poolSize: 10 }
	},
	url = 'mongodb://' + config.get('db:mongo:host') + ':' + config.get('db:mongo:port') + '/' +  config.get('db:mongo:db');

function Conn(){
	this.conn = null;
	events.EventEmitter.call(this);
}
util.inherits(Conn, events.EventEmitter);
Conn.prototype.connect = function(){
	var self = this;
	this.conn = mongoose.connect(url,options);
				mongoose.connection.on('connected',function(){
								self.emit('connected');
				});
	            // If the connection throws an error
				mongoose.connection.on("error", function(err) {
								self.emit('error');
				  				console.error('Failed to connect to DB ');
				});
				// When the connection is disconnected
				mongoose.connection.on('disconnected', function () {
								self.emit('disconnected');
				  				console.log('Mongoose default connection to DB :' );
				});
	
				var gracefulExit = function() { 
				  mongoose.connection.close(function () {
				    console.log('Mongoose default connection with DB is disconnected through app termination');
				    process.exit(0);
				  });
				}
 
				// If the Node process ends, close the Mongoose connection
				process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
	return this;
}

exports.connection = function(){
	return mongoose.createConnection(url, options);
};

exports.connect = function(){
	return mongoose.connect(url,options);
}


exports.Conn = Conn;

exports.crudify = function(Schema){
	
	var Model = mongoose.model(Schema.modelName);
	
	return {
		add: function(data, done){
			var Doc = new Model(data || {} );
				Doc.save(function(err){  
					if(err) return done(err);
					Model.findById(Doc, function(err, _Doc){  
						done(err, _Doc);
					});
				});
		},
		rem: function(data, done){
			Model.findById(data._id, function(err, _Doc){
				if(err) return done(err);
				if(_Doc){
					_Doc.remove(function(err){ console.log('removed', _Doc);
							done(err, _Doc);
					});
				}else{
					done(err, null);
				}
			});
		},
		upd: function(data, done){
			
		},


		get: function(data, done){
			Model.find(data || {}, function(err, _Docs){
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
//module.exports = mongoose.connect(url, options); 