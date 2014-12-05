var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'), 
    Schema    = mongoose.Schema

    ,
    SALT_WORK_FACTOR = 10,
    // these values can be whatever you want - we're defaulting to a
    // max of 5 attempts, resulting in a 2 hour lock
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 2 * 60 * 60 * 1000;

// https://www.owasp.org/index.php/Authentication_Cheat_Sheet#Implement_Account_Lockout
var userSchema = new Schema({
 	username:{
 		type:String, 
 		required:true,
 		unique: true
 	},
	email: {
		type: String, 
		required: true
	},

	  password:{
	  	type:String, 
	  	required:true
	  },

  	isVerified: { 
  		type: String, 
  		default: '' 
  	},
	verificationToken: { 
		type: String, 
		default: '' 
	},

  resetPasswordToken:String,
  resetPasswordExpires: Date,

  // Keep track of failed log-in attempts
  loginAttempts: { 
  	type: Number, 
  	required: true, 
  	default: 0 
  },
  lockUntil: { 
  	type: Number 
  },

  profile:{
  	firstname: {
  		type: String, 
  		required: false
  	},
	lastname: {
		type: String, 
		required: false
	},
	company: { type: String, default: '' },
phone: { type: String, default: '' },
zip: { type: String, default: '' },
status: {
id: { type: String, ref: 'Status' },
name: { type: String, default: '' },
userCreated: {
id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
name: { type: String, default: '' },
time: { type: Date, default: Date.now }
}
  },


});

userSchema.virtual('isLocked').get(function() {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Reasons for Log-i failure
var reasons = userSchema.statics.failReasons = {
	NOT_FOUND: 0,
	PASS_INCORRECT: 1,
	MAX_ATTEMPTS: 2
};

// it is almost always a bad idea to tell the end user why a login has failed. 
// It may be acceptable to communicate that the account has been locked due to reason 3, 
// but you should consider doing this via email if at all possible.

userSchema.pre('save', function(next){
	var self = this,
	    SALT_FACTOR = 5;

	if(!self.isModified('password')) return next();

	bcrypt.genSalt(SALT_FACTOR, function(err, salt){
		if (err) return next(err);

	    bcrypt.hash(self.password, salt, null, function(err, hash) {
	      	if (err) return next(err);
	      	self.password = hash;
	      	next();
	    });
	});

});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
	  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
	    	if (err) return cb(err);
	    	cb(null, isMatch);
	  });
};

userSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};


userSchema.statics.getAuthenticated = function(username, password, cb) {
    this.findOne({ username: username }, function(err, user) {
        if (err) return cb(err);

        // make sure the user exists
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if (user.isLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

// Not used
userSchema.methods.encryptPassword = function(password) {
		return require('crypto').createHmac('sha512', 'xxxxxxx').update(this.password).digest('hex');
	};

module.exports = mongoose.model('user',userSchema);


//// usage

/*
// save user to database
testUser.save(function(err) {
    if (err) throw err;

    // attempt to authenticate user
    User.getAuthenticated('jmar777', 'Password123', function(err, user, reason) {
        if (err) throw err;

        // login was successful if we have a user
        if (user) {
            // handle login success
            console.log('login success');
            return;
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
                // note: these cases are usually treated the same - don't tell
                // the user *why* the login failed, only that it did
                break;
            case reasons.MAX_ATTEMPTS:
                // send email or otherwise notify user that account is
                // temporarily locked
                break;
        }
    });
});*/
