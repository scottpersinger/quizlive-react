// models/User

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var utils        = require('./model_common');

var UserSchema   = new Schema({
    name: String,
    avatar: String,
    points: Number,
    rank: Number
});

utils.setup_schema(UserSchema);

module.exports = mongoose.model('User', UserSchema);
