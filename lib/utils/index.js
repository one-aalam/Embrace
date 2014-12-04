exports.parseCookies = function(rc) {
    var list = {};

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
    });

    return list;
}

exports.isObjectID = function(ObjectID){
	var regExp = new RegExp("^[0-9a-fA-F]{24}$");
	return regExp.test(ObjectID);
}