


exports.setup = function(Router, Db, App, Post){
	// router
	//

	var Post = Db.crudify(Post);
		/*
		Post.add({
			'title':'A new post',
			'desc' : 'that is crazy'
		},
		function(err, done){
			if(err) return err;
			console.log(done);
		});*/
/*
		Post.all(function(err, docs){
			console.log(docs);
		});*/

		Post.rem({'_id':'53ac582cc9940fb90485fe87'}, function(err, doc){
			console.log(doc);
		});
/*
		Post.all(function(err, docs){
			console.log(docs);
		});*/


};
