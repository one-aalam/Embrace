


exports.setup = function(Router, Db, Post){
	// router
		var p = new Post({
			'title':'A new post',
			'desc' : 'that is crazy'
		});
		p.save(function(){ console.log('here');});
	var Post = Db.crudify(Post);
	
		Post.add({
			'title':'A new post',
			'desc' : 'that is crazy'
		},
		function(err, done){
			if(err) return err;
		});
	
	
};

