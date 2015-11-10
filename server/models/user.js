// models/User

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var utils        = require('./model_common');
var uniqueValidator = require('mongoose-unique-validator');
var admin_secret = 'A56A49883CD53';

var UserSchema   = new Schema({
    name: {type: String, require: true, unique: true},
    avatar: String,
    points: Number,
    rank: Number
});
UserSchema.plugin(uniqueValidator);
UserSchema._admin_secret = admin_secret;

utils.setup_schema(UserSchema);

UserSchema.virtual('token').get(function () {
	if (this.name == 'admin') {
		return admin_secret;
	} else {
		return null;
	}
});

module.exports = mongoose.model('User', UserSchema);
