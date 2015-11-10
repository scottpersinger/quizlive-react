// models/User

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var utils        = require('./model_common');

var GuessSchema   = new Schema({
    user_id: String,
    question_index: Number,
    answer: String
});
GuessSchema.index({user_id: 1, question_index: 1}, {unique: true});

utils.setup_schema(GuessSchema);

module.exports = mongoose.model('Guess', GuessSchema);
