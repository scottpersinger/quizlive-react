// models/Question

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var utils        = require('./model_common');

var QuestionSchema   = new Schema({
    query: String,
    answers: [String],
    correct_answer: String
});

utils.setup_schema(QuestionSchema);

module.exports = mongoose.model('Question', QuestionSchema);

