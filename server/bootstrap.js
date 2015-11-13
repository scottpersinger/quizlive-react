var fs = require('fs');
var async = require('async');
var mongoose   = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost');

var models = require('./models');

fs.readFile(__dirname + '/data/questions.js', function(err, buffer) {
	var data = buffer.toString('utf8');
	var qs = eval(data);
	models.Question.remove({}).then(function() {
		async.map(qs, function(q, cb) {
			console.log(q);
			models.Question.create({query:q.question, answers:q.answers, correct_answer:q.answers[q.answer_index-1]}, cb);
		}, function(err, results) {
			models.Question.count({}).then(function(c) {
				console.log(c, " total questions");
				mongoose.connection.close();
			});
		});
	});
});
