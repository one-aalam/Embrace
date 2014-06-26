var mongoose = require('mongoose'),
	config = require('../configuration'),
	options = { 
		server: { auto_reconnect: true, poolSize: 10 }
	},
	Db = null,
	url = 'mongodb://' + config.get('db:mongo:host') + ':' + config.get('db:mongo:port') + '/' +  config.get('db:mongo:db');
	

exports.connection = function(){
	return mongoose.createConnection(url, options);
};

exports.connect = function(){
	return mongoose.connect(url,options);
}

exports.crudify = function(Schema){var _d = mongoose.connections[0]['collections']; console.log(_d);
	
	var Model = _d.model(Schema.modelName);
	
	return {
		add: function(data, done){
			var Doc = new Model(data || {} );
				Doc.save(function(err){  console.log('jhii');
					if(err) return done(err);
					Model.findById(Doc, function(err, _Doc){  
						done(err, _Doc);
					});
				});
		},
		rem: function(data, done){
			Model.findById(data.id, function(err, _Doc){
				if(err) return done(err);
				_Doc.remove(function(err){
						done(err, _Doc);
				});
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
				if(_Doc._id){
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