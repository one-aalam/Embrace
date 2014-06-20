module.exports = function(router){
	// router
	router.get('/users', function(req, res){
		res.send(200,{'data':'ok'});
	});
};