var crypto = require("crypto");

exports.isEmail = function(email){
	if( /(.+)@(.+){2,}\.(.+){2,}/.test(email) ){
		return true;
	} else {
		return false;	
	}
}

exports.createHash = function(date){
	var time = date;
	var hash = crypto.createHash('md5').update(String(+time)).digest("hex");
	return hash;
}