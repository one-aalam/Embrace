


exports.setup = function(Router, Passport,Mw, Email){
	Router.get('/',
		// Authenticate using HTTP Basic credentials, with session support disabled.
  		//passport.authenticate('digest', { session: false }),
			Mw.secure,
		function(req, res){
			res.render('index');
	});

	Router.get('/about', function(req, res){
		res.send('@about');
	});

	Router.route('/upload')
				.get(function(req, res){
						res.render('post/new');
				 })
				.post(function(req,res){
					 console.log(req.body);
					 console.log(req.files);
					  Email.send({
							subject:'Mail from Node',
							text:'Hello!',
							data:{

							}
						},'newsletter');

					 res.render('post/new');
				});
}

//module.exports = Setup;
