var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost');

models = require('./models');
function model_signals(action, modelName, doc) {
  console.log("Model ", modelName, ": ", action, ": ", doc.toObject());
}
require('./models/signals')(models, model_signals);

models.User.create({name:'foobar'}, function(err, doc) {
	doc.name = "foobar2";
	doc.save(function(err, doc) {
		console.log("Saved user again: ", doc);
	});
});
