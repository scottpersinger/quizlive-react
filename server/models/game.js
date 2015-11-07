// models/User

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var utils        = require('./model_common');

var GameSchema   = new Schema({
    current_question_index: Number,
    total_questions: Number,
    current_question: Number,
    question_eta: Number
});

utils.setup_schema(GameSchema);

module.exports = mongoose.model('Game', GameSchema);
