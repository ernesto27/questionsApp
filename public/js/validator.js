var validator = {

	isEmpty: function(data){
		if(data.trim() === ""){
			return true;
		}else{
			return false;
		}
	},

	isAlpha: function(data){
		if(!/[^a-zA-Z]/.test(data)){
			return true 
		}else{
			return false;
		}
	},

	isNumber: function(data){
		if(typeof data === "number"){
			return true;
		}else{
			return false;
		}
	},

	isSize: function(data, len){
		if(data.trim().length === len){
			return true;
		}else{
			return false;
		}
	},

	min: function(data, minimun){
		if(data.trim().length >= minimun){
			return true;
		}else{
			return false;
		}
	},

	max: function(data, max){
		if(data.trim().length <= max){
			return true;
		}else{
			return false;
		}
	},

	isEmail: function(email){
		if(/(.+)@(.+){2,}\.(.+){2,}/.test(email.trim())){
			return true;
		} else {
			return false;	
		}
	},

	isUrl: function(url){
		if(/^(http:\/\/(www)?.|https:\/\/(www)?.|ftp:\/\/(www)?.|(www)?.){1}([0-9A-Za-z]+\.)/.test(url)){
			return true;
		}else{
			return false;
		}
	}

}

/*
 *fallback for browsers that does not support native trim
*/


if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}