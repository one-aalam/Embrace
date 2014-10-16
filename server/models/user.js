var mongoose = require('mongoose'),
    Schema    = mongoose.Schema;


var userSchema = new Schema({
	firstname: {type: String, required: false},
	lastname: {type: String, required: false},
  //username:{type:String, required:true},
	email: {type: String, required: true},
  password:{type:String, required:true},
  profile:{
  
  }
});

userSchema.statics.encryptPassword = function(password) {
		return require('crypto').createHmac('sha512', 'xxxxxxx').update(password).digest('hex');
	};

module.exports = mongoose.model('user',userSchema);
