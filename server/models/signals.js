// Mongoose post save signal handler

module.exports = function(models, dispatcher) {
	for (var m in models) {
		var schema = models[m].schema;

		schema.pre('save', function (next) {
		  this.wasNew = this.isNew;
		  next();
		});

		schema.post('save', function(doc) {
			dispatcher(doc.wasNew ? 'create' : 'update', doc.constructor.modelName, doc);
		});
		schema.post('remove', function(doc) {
			dispatcher('remove', doc.constructor.modelName, doc);
		});
	}
}
