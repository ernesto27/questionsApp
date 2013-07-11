var Ask = (function($){

	var wrapAddquestion = $("#wraptextarea"),
		feedbackQuestion = wrapAddquestion.find("#feddback-question"),
		questionVal = wrapAddquestion.find("textarea"),
		buttonQuestion = questionVal.next()
	;

	var wrapQuestions = $("#wrapquestions"),
		wrapSingleQuestion = $(".single-question"),
		responseButton = wrapSingleQuestion.find("a")
	;

	var viewMore = $("#view-more");
	var deleteButton = $(".delete-response");
	var loading = $("#loading");

	var desingWrap = $("#design-tab");

	function createTmplQuestion(question, response, date){
		var tmplQuestions = 
			'<div class="single-question">'+
			'<p class="question">'+ question +'</p>'+
			'<p>'+ response +'</p>'+
			'<span>'+ date +'</div>'
			;

		return tmplQuestions;
	}

	

	function addQuestion(){
		buttonQuestion.on("click", function(e){
			e.preventDefault();
			var userId = $(this).data("userid");
		
			$.ajax({
				url: "/question/add",
				method: "post",
				data: {content: questionVal.val(), userId: userId },
				success: function(data){
					if(data === "ok"){
						feedbackQuestion.fadeIn();
					}
				}
			});
		});
	}

	function showTextareaResponse(){
		responseButton.on("click", function(e){
			e.preventDefault();
			var textareaWrap = $(this).next()
			textareaWrap.toggle("slow");	
			handleResponse(textareaWrap.find("button"));

		});	
	}

	function handleResponse(button){
		button.on("click",function(e){
			var that = $(this),
				questionId = that.data("questionid"),
				response = that.prev().val()
			;


			$.ajax({
				url: "/question/response",
				method: "post",
				data: {questionId: questionId, response: response},
				success: function(data){
					if(data === "ok"){
						that.after("<p style='color:green'>Se agrego la respuesta</p>");
					}
				}
			});
		});
	}

	function responseQuestion(){
		showTextareaResponse();
	}


	function deleteQuestion(){
		deleteButton.on("click", function(){
			var that = $(this),
				questionId = that.data("questionid")
			;

			$.ajax({
				url: "/question/delete",
				method: "post",
				data: {questionId: questionId},
				success: function(data){
					if(data === "ok"){
						that.parent().fadeOut();
					}
				}
			});
		});
	}

	function getMoreQuestions(){
		viewMore.on("click",function(){
			var that = $(this),
				skip = that.attr("data-skip"),
				userId = that.data("userid"),
				tmpl = ''
			;

			that.attr("data-skip",parseInt(skip,10) + 10);
			that.attr("disabled","disabled");
			loading.show();

			$.ajax({
				url: "/question/viewmore",
				data: {skip: skip, userId: userId},
				method: "get",
				success: function(data){
		
					$.each(data, function(index,data){
						tmpl += createTmplQuestion(data.question, data.response, data.date);
					});

					wrapQuestions.append(tmpl);
					that.removeAttr("disabled");
					loading.hide();
				}
			});
		});	
	}

	function changeBackground(){
		desingWrap.find("li").on("click", function(){
			var img = $(this).find("img");
			var backgroundImage;

			if(img.length){
				backgroundImage = img.attr("src");		
			}else{
				backgroundImage = "white";
			}

			$.ajax({
				url: "/user/changebackground",
				method: "post",
				data: {backgroundImage: backgroundImage},
				success: function(data){
					if(data === "ok"){
						$("body").css("background","url("+backgroundImage+")");
					}
				}
			});
			
		});
	}

	
	return {
		addQuestion: addQuestion,
		responseQuestion: responseQuestion,
		deleteQuestion: deleteQuestion,
		getMoreQuestions: getMoreQuestions,
		changeBackground: changeBackground
	}

})(jQuery);


/*
 * INIT APP
*/

Ask.addQuestion();
Ask.responseQuestion();
Ask.deleteQuestion();
Ask.getMoreQuestions();
Ask.changeBackground();