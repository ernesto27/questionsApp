var crypto = require("crypto");
var nodemailer = require("nodemailer");
var helpers = require("../../helpers");

var path        = require('path');
var fs = require('fs');
console.log(helpers.createHash(new Date));


module.exports = function(app){
	app.get('/', function(req, res) {
;
		var users = User.find().sort({_id:"descending"}).execFind(function(err,docs){
			if(err) res.json(err);
			res.render("index",{ users: docs,message: req.flash('info') })
		});
	  
	});

	app.post("/register", function(req,res){
		var post = req.body;
		var username = post.username;
		var email = post.email;
		var password = post.password;


		if(!username.trim() || !email.trim() || !password.trim()){
			req.flash('info', 'Ingresa todos los datos!')
			res.redirect("/");
		}else{
			//check if email is in DB
			if(!helpers.isEmail(email)){
				res.send("Ingresa un email valido");
				return false;
			}

			User.find({email: email}).count(function(err,docs){
				if(err) res.json(err);

				if(!docs){
					// if email is available add user
					var time = new Date();
					var hash = crypto.createHash('md5').update(String(+time)).digest("hex");
					User.create({name:username, email:email, password:password,key:hash,avatar:"default.jpg",confirm: 0}, function(err, docs){
						if(err) res.json(err);
						//res.json(docs);
						//return false;

						// send email
						var smtpTransport = nodemailer.createTransport("SMTP",{
							service: "Gmail",
							auth: {
								user: "youremail",
								pass: "pass"
								}
							});

									    // setup e-mail data with unicode symbols
							var mailOptions = {
								from: "Ask appfog <foo@blurdybloop.com>", // sender address
								to: email, // list of receivers
								subject: "Completa el registro - askme", // Subject line
								text: "", // plaintext body
								html: "Ingresa a este link para completar el registro <a href='http://testemail.ap01.aws.af.cm/confirm/"+hash+"'>link</a>" // html body
							}

									    // send mail with defined transport object
							smtpTransport.sendMail(mailOptions, function(error, response){
								if(error){
									res.send("ocurrio un error, intentalo mas tarde");
								}else{
									req.flash('info', 'Revisa tu correo para completar el registro')
									res.redirect("/");
								}

							});					
					});
				}else{
					req.flash('info', 'El email ingresado esta en uso!')
					res.redirect("/");
				}
			});
			
		}

	});


	app.get("/confirm/:key", function(req,res){
		/* 
		 * confirm user account
		 * check if the key is in DB
		*/

		User.find({key: req.params.key, confirm: 0},function(err,docs){
			if(err) res.json(err);

			if(!docs.length){
				res.redirect("/");
			}else{
				var id = docs[0]._id;
				User.update({_id: id},{$set: {confirm: 1}},function(err,docs){
					if(err) res.json(err);
					req.flash('info', 'El registro se completo correctamente')
					res.redirect("/");
				});
			}
		});
	});

	app.post("/login", function(req,res){
		var email = req.body.email;
		var password = req.body.password;

		User.find({email: email, password:password, confirm: 1},function(err,docs){
			if(err) res.json(err);
			if(!docs.length){
				req.flash('info',"el usuario o la contraseña no es correcta");
				res.redirect("/");
			}else{
				req.session.logged = true;
				req.session.username = docs[0].name;
				req.session.email = docs[0].email;
				req.session.site = docs[0].site;
				req.session.bio = docs[0].bio;
				req.session.user_id = docs[0]._id;
				req.session.avatar = docs[0].avatar;
				req.session.background = docs[0].background;
				res.redirect("/questions/"+req.session.username+"/"+docs[0].id);
			}
		});
	});

	app.get("/logout",function(req,res){
		req.session.destroy();
		res.redirect("/");
	});

	app.get("/loginsocial/:name/:id", function(req,res){
		var params =  req.params;
		var name =params.name;
		var socialId  = params.id;

		// check if exists in DB
		User.find({socialId: socialId}).count(function(err,docs){
			if(err) res.json(err);
			res.json(docs);
		});

		return false;

		new User({
	    	name: name,
	    	socialId: socialId,
	    	avatar: "http://graph.facebook.com/"+socialId+"/picture",
	    	confirm: 1
	  	}).save(function(err,docs){
	    	if(err) res.json(err);
	    	res.json(docs)
	  	});
	})

	app.get("/home/settings", function(req,res){
		if(!req.session.logged){
			res.redirect("/");
		}else{
			res.render("users/home", { session: req.session,message: req.flash('info')});
		}
		
		//res.send(req.session.username +" " +req.session.email+ " "+req.session.logged)
	});

	app.post("/home/update", function(req,res){
		var id = req.session.user_id;
		var post = req.body;
		var site = post.site.trim();
		var bio = post.bio.trim();


		User.update({_id: id},{$set: {site: site, bio:bio}},function(err,docs){
			if(err) res.json(err);
			req.session.site = site;
			req.session.bio = bio;
			req.flash('info', 'Se actualizaron los datos');
			res.redirect("/home/settings");
		});
	});

	app.post("/home/uploadavatar", function(req,res){
		var image = req.files.avatar;
		var temp = image.path;
		var avatarName = image.name;
		var type = image.type;
		var path = "public/images/avatar/"+avatarName;
	
		// check if image size if larger that 1MB
		if(image.size > 1000000){
			req.flash('info', 'La imagen tiene que ser menor a un 1MB');
			res.redirect("back");
		}else if( type == "image/jpg" || type == "image/jpeg" || type == "image/png" || type == "image/gif"){
			fs.rename(temp, path, function(err){
				if(err) res.json(err);

				User.update({_id: req.session.user_id},{$set: {avatar: avatarName}},function(err,docs){
					if(err) res.json(err);
					req.session.avatar = avatarName;
					res.redirect("/home/settings");
				});
			});
		}else{
			req.flash('info', 'El formato de la imagen debe ser jpg, png o gif');
			res.redirect("back");
		}	

	});


	app.get("/recoverpass", function(req,res){
		res.render("users/recoverpass",{message: req.flash('info')});
	});

	app.post("/recoverpass", function(req,res){
		var email = req.body.email;
		var hash = helpers.createHash(new Date);

		if(helpers.isEmail(email)){
			User.update({email: email},{$set: {key: hash}},function(err,docs){
				if(err) res.json(err);
				if(docs){
					// send email for recover pass
					var smtpTransport = nodemailer.createTransport("SMTP",{
						service: "Gmail",
						auth: {
							user: "youremail",
							pass: "pass"
							}
					});

									    // setup e-mail data with unicode symbols
					var mailOptions = {
						from: "Ask appfog <foo@blurdybloop.com>", // sender address
						to: email, // list of receivers
						subject: "Recuperar contraseña - askme", // Subject line

						html: "Ingresa a este link para recuperar la cuenta <a href='http://testemail.ap01.aws.af.cm/recoveraccount/"+hash+"'>link</a>" // html body
					}

					// send mail with defined transport object
					smtpTransport.sendMail(mailOptions, function(error, response){
						if(error){
							res.send("ocurrio un error, intentalo mas tarde");
						}else{
							req.flash('info', 'Revista tu correo para recuperar la contraseña');
							res.redirect("/recoverpass");
						}

					});	
					
				}
			});
		}else{
			req.flash('info', 'El email no es valido');
			res.redirect("/recoverpass");
		}

		//req.flash('info', 'Revista tu correo para recuperar la contraseña');
		//res.redirect("/recoverpass");
	});

	app.get("/recoveraccount/:key", function(req,res){
		var key =  req.params.key;
		// check if the key exists in the database

		User.find({key:key},function(err,docs){
			if(err) res.json(err);
			if(!docs.length){
				//res.send("false key")
				//req.flash('info',"el usuario o la contraseña no es correcta");
				res.redirect("/");
			}else{
				var id = docs[0]._id;
				var key = docs[0].key;

				res.render("users/newpass",{id:id,key:key,message:req.flash('info')});
			}
		});
		//res.render("users/newpass",{message: req.flash('info')});
	});

	app.post("/changepassword", function(req,res){
		var pass1 = req.body.pass1.trim();
		var pass2 = req.body.pass2.trim();
		var id = req.body.id;
		var key = req.body.key;

		var url = "/recoveraccount/"+key;

		if(!pass1 || !pass2){
			req.flash('info', "Ingresa todos los datos");
			res.redirect(url);	
		}else{
			if(pass1 !== pass2){
				req.flash('info', "Las passwords ingresados no coinciden");
				res.redirect(url);
			}else{
				// update new password
				User.update({_id: id},{$set: {password: pass1}},function(err,docs){
					if(err) res.json(err);
					req.flash('info', 'La contraseña se actualizo correctamente')
					res.redirect(url);
				});
			}
		}	
	});

	app.post("/user/changebackground", function(req, res){
		var userId = req.session.user_id;
		var backgroundImage = req.body.backgroundImage;

		User.update({_id: userId},{$set: {background: backgroundImage}},function(err,docs){
			if(err) res.json(err);
			req.session.background = backgroundImage;
			res.send("ok")
		});
	});


	// user perfil routes

	app.get("/perfil", function(req,res){
		res.render("users/perfil");
	});

	

	app.get("/session", function(req,res){
		res.send(req.session.username +" " +req.session.email+ " "+req.session.logged)
	});

	app.get("/drop", function(req,res){
		User.remove(function(err,docs){
			if(err) res.json(err);
			res.json(docs);
		});
	});




}