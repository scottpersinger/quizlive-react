// models/Question

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var QuestionSchema   = new Schema({
    query: String,
    answers: [String],
    correct_answer: String
});

if (!QuestionSchema.options.toObject) QuestionSchema.options.toObject = {};
QuestionSchema.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
}

module.exports = mongoose.model('Question', QuestionSchema);
