
exports.create = create = function(){

}

exports.setup = function(Router, App, Db, User, Post, Mw){
	// Expose sugar properties like
	// get, add, update, etc.
	// Enable or suppress Socket.io events
	// by a single property
	// It's sugar CRUD, It's crudify
	var User = Db.crudify(User, true);
	/*
	    User.getOrAdd({'email':'aftabbuddy@gmailx.com'}, function(err, doc){
	    	console.log(doc);
	    });*/

	Router.param('user_id', function(req, res, next, id) {


		    User.get({
		      '_id':id
		    }, function(err,doc){
		      req.dbUser = doc;
		      next();
		    });

			});

		  Router.route('/profile').get(function(req, res, next){
		    res.json(req.user);
		  });

			Router.route('/users/add').get(function(req, res, next){
				res.render('auth/sign-up');
			});

			Router.route('/users')
				  .get(function(req, res, next){
				  	var _io = App.get('_io');
				  		console.log(_io);
				  	 User.all(function(err, docs){
				  	 	res.send(docs);
				  	 });
				  })


				  .post(
				  	// Middleware: Validator
				  	Mw.validate({
				  		'firstname':['isEmail'],
				  		'email':['isEmail']
				  	}),

		  	//Mw.dataMap({allow:[], remove[]}),

		  	// Route: handler
		  	function(req, res, next){
/*
				var busboy = new Busboy({header: req.headers});
						busboy.on('finish', function(){
							console.log('upload finished');
						});*/

			  	User.add({
					 'firstname':req.body.firstname,
					 'lastname':req.body.lastname,
					 'email':req.body.email,
           			 'password':req.body.password
					}, function(user){
					res.send(user);
				});
		  	}
		  );

	Router.route('/users/:user_id')
			.get(function(req, res, next) {
			  res.json(req.dbUser);
			})
			.put(function(req, res, next) {
			  req.dbUser.name = req.params.name;
			  res.json(req.user);
			})
			.post(function(req, res, next) {
			  next(new Error('not implemented'));
			})
			.delete(function(req, res, next) {
			  next(new Error('not implemented'));
			});
}
