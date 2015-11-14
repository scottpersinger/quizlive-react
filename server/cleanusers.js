var mongoose   = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost');

var models = require('./models');

models.User.remove({name:{$ne:'admin'}}, function() {console.log("Users removed")});
