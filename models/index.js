exports.createSchema = function(mongoose){
	mongoose.connect("mongodb://localhost/app");


	// users schema
	var UserSchema = new mongoose.Schema({
		name: String,
		password: String,
		email:  String,
		avatar: String,
		site: String,
		bio: String,
		key: String,
		socialId: Number,
		confirm: Number,
		background: String
	});

	


	var QuestionSchema = new mongoose.Schema({
		question: String,
		response: String,
		user_id: String,
		done: { type: Number, default: 0},
		date: { type: Date, default: Date.now}, 
	});

	User = mongoose.model("users", UserSchema);
	Question = mongoose.model("questions", QuestionSchema);

}