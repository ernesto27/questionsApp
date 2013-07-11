Ask.user = (function($){
	
	function validateRegister(){
		$("#register").on("submit", function(e){
			
			var that = $(this);
			var errors = [];

			var username = that.find("input[name='username']");
			var email = that.find("input[name='email']");
			var pass = that.find("input[name='password']");

			$(".error").hide();

			if(validator.isEmpty(username.val())){
				errors.push("<p class='error'>Ingresa el nombre</p>");
			}

			if(!validator.isEmail(email.val())){
				errors.push("<p class='error'>El email no es valido</p>");
			}

			if(!validator.min(pass.val(),4)){
				errors.push("<p class='error'>El password debe tener mas de 4 caracteres</p>");
			}

			var len = errors.length

			if(len){
				for(var i = 0; i < len; i++){
					that.after(errors[i]);
				}
				return false;
			}else{
				return true;
			}
		});
	}

	function validateLogin(){
		$("#login").on("submit", function(){
			// todo
		});
	}

	function init(){
		validateRegister();
		validateLogin();
	}

	return{
		init: init
	}

})(jQuery);

Ask.user.init();