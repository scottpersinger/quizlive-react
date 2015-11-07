module.exports.setup_schema = function(schema) {
	if (!schema.options.toObject) schema.options.toObject = {};
	schema.options.toObject.transform = function (doc, ret, options) {
	  // remove the _id of every document before returning the result
	  ret.id = ret._id;
	  delete ret._id;
	  delete ret.__v;
	}
}