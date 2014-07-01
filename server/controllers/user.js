exports.create = create = function(){
    
}

exports.setup = function(Router, Db, User, Post, Mw){

	var User = Db.crudify(User);
	/*
	    User.getOrAdd({'email':'aftabbuddy@gmailx.com'}, function(err, doc){
	    	console.log(doc);
	    });*/

	Router.param('user_id', function(req, res, next, id) {
		req.user = {
		    id: id,
		    name: 'TJ'
		};
  		next();
	});

	Router.route('/users')

		  .get(function(req, res, next){
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
			 
			  	User.add({
					 'firstname':req.body.firstname,
					 'lastname':req.body.lastname,
					 'email':req.body.email
					}, function(user){
					res.send(user);
				});
		  	}
		  );

	Router.route('/users/:user_id')
			.get(function(req, res, next) {
			  res.json(req.user);
			})
			.put(function(req, res, next) {
			  req.user.name = req.params.name;
			  res.json(req.user);
			})
			.post(function(req, res, next) {
			  next(new Error('not implemented'));
			})
			.delete(function(req, res, next) {
			  next(new Error('not implemented'));
			});
}