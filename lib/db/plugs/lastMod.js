

module.exports = exports = function(schema, options){
	// Register a key to store last modified date
	schema.add({lastMod: Date});
	// Prepare...
	schema.pre('save', function(next){
		this.lastMod = new Date;
		next();
	});

	if (options && options.index) {
    	schema.path('lastMod').index(options.index);
    }

}