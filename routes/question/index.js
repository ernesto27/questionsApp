module.exports = function(app){
	app.get("/questions/:username/:id", function(req,res){
		
		var username = req.params.username;
		var id = req.params.id;
		var userData;

		var user = User.find({_id: id},function(err,docs){
			if(err) res.json(err);

			userData = docs;
			//res.render("question/questions",{user: userData});
			//return;
			getQuestions(userData,id);
	
		});

		function getQuestions(userData,id){
			//res.send(req.session.username);
			//eturn false;
			//Question.find({user_id: parseInt(id)}).count(function(err,docs){
			Question.find({user_id: id, done: 1}).sort({_id:"descending"})
				.skip(0).limit(10).execFind(function(err,docs){
					if(err) res.send(err);
					if(!docs){
						res.render("question/questions",{user: userData,session: req.session});
					}else{
						console.log(userData);
				
						res.render("question/questions",{ questions: docs , user: userData,session: req.session});

					}
			});
		}
	
	});

	function getQuestionsAjax(id, skip, res){
			Question.find({user_id: id, done: 1}).sort({_id:"descending"})
				.skip(skip).limit(10).execFind(function(err,docs){
					if(err) res.send(err);
					res.send(docs)
			});
	}	

	app.get("/question/viewmore", function(req,res){

		getQuestionsAjax(req.query.userId, req.query.skip, res);
	});

	app.post("/question/add", function(req,res){
		var question = req.body.content;
		var userId = req.body.userId;


		//var question = "testhgh3";
		//var userId = 25555;

		new Question({
	    	question: question,
	    	user_id: userId
	  	}).save(function(err,docs){
	    	if(err) res.send("error");
	    	res.send("ok")
	  	});

	});


	app.get("/questions/response", function(req,res){
		Question.find({user_id: req.session.user_id}).sort({_id:"descending"}).execFind(function(err,docs){
			if(err) res.send(err);
			if(!docs){
				res.render("question/response",{session: req.session});
			}else{
				res.render("question/response",{ questions: docs ,session: req.session});

			}
		});
		
	});

	app.post("/question/response", function(req,res){
		var questionId = req.body.questionId;
		var response = req.body.response;

		Question.update({_id: questionId},{$set: {response: response, done: 1}},function(err,docs){
			if(err) res.send("error");
			res.send("ok")
		});
	});

	app.post("/question/delete", function(req,res){
		var questionId = req.body.questionId;

		Question.remove({_id: questionId}, function(err){
			if(err) res.send("error");
			res.send("ok");
		});
	});
}