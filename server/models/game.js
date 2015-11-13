// models/User

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var utils        = require('./model_common');
var Question     = require('./question');

var GameSchema   = new Schema({
    current_question_index: Number,
    question: {query:String, answers:[String], question_id:String, first_correct:String},
    question_eta: Number,
    total_questions: Number
});

utils.setup_schema(GameSchema);


GameSchema.pre('save', function(next) {
	var doc = this;
	if (!this.total_questions) {
		Question.count({}, function(err, c) {
			console.log("Counted ", c, " questions");
			doc.total_questions = c;
			next();
		});
	} else {
		next();
	}
});


module.exports = mongoose.model('Game', GameSchema);
