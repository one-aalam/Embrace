var mongoose = require('mongoose'),
    Schema    = mongoose.Schema;


var userSchema = new Schema({
	firstname: {type: String, required: false},
	lastname: {type: String, required: false},
	email: {type: String, required: true},
});

module.exports = mongoose.model('user',userSchema);