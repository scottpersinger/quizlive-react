// models/User

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var utils        = require('./model_common');
var Question     = require('./question');

var GameSchema   = new Schema({
    current_question_index: Number,
    question: {query:String, answers:[String]},
    question_eta: Number,
    total_questions: Number
});

utils.setup_schema(GameSchema);

GameSchema.pre('save', function(next) {
	console.log("Running Game presave");
	var doc = this;
	Question.count({}, function(err, c) {
		console.log("Found ", c, " questions");
		doc.total_questions = c;
		next();
	});
});

module.exports = mongoose.model('Game', GameSchema);
