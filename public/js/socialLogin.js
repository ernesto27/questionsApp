FB.init({
   	appId      : '526444347393375', // App ID
    channelUrl : '//localhost:3000//channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
 });

document.getElementById("login-facebook").addEventListener("click",function(){
	FB.login(function(response){
		if(response.authResponse){
			FB.api('/me', function(response) {
				console.log(response)
				console.log('Good to see you, ' + response.name + '.');
			
				var name= response.first_name;
				var id= response.id;
				var avatar= "http://graph.facebook.com/"+response.id+"/picture";
			
				location = "/loginsocial/"+name+"/"+id;
			});
		}
	});
},false);
