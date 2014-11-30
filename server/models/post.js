var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	title: {
		type: String, 
		required: true,
		index: true
	},
	desc: {
		type: String, 
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at:{
		type: Date,
		default: Date.now
	},
	createdBy:{
		type: mongoose.Schema.Types.ObjectId,
		index: true,
		ref: 'User'
	}
});
	
PostSchema.virtual('post_id').get(function(){
	return this._id;
});

module.exports = mongoose.model('Post',PostSchema);
