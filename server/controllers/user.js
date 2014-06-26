exports.create = create = function(){
    
}

exports.setup = function(Router, User, Post){

	Router.param('user_id', function(req, res, next, id) {
		req.user = {
		    id: id,
		    name: 'TJ'
		};
  		next();
	});

	Router.route('/users')
		  .get(function(req, res){
			  
			 User.insert({
				 'firstname':'aftab',
				 'lastname':'alam',
				 'email':'aftabbuddy@gmail.com'
				}, function(user){
				console.log(user);
			});
		  	 res.send('User index');
		  });

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