var mongoose = require('mongoose'),
    Schema    = mongoose.Schema;


var postSchema = new Schema({
	title: {type: String, required: true},
	desc: {type: String, required: true}
});

module.exports = mongoose.model('post',postSchema);