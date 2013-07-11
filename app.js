var appFog = require("./appfogconfig");
appFog.settings();


//var app = require('express').createServer();

var express  = require("express");
var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');
var mongoose = require("mongoose");
var fs = require('fs');


var path  = require('path');
var flash = require('connect-flash');

var app = module.exports = express();
var server  = require("http").createServer(app)

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/images/avatar/" }));
	app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session({secret: "holy wars"}));
	app.use(flash());
	app.use(app.router);	
	app.use(express.static(path.join(__dirname, 'public')));
});


/*
 * MONGODB  SCHEMA
*/
var models = require('./models');
models.createSchema(mongoose);

/*
 * ROUTES
*/

require("./routes/user")(app);
require("./routes/question")(app);

app.get("/insert", function(req,res){

	for(var i = 0; i < 100; i++){
		new Question({
	    	question: "question number " + i,
	    	user_id: "51be4cc48b1947f014000001",
	    	done: 1
	  	}).save(function(err,docs){
	    	if(err) res.send("error");
	    	res.send("ok")
	  	});
	}
});





app.listen(port);
//server.listen(port);
