var fs = require('fs');
var async = require('async');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost');

var models = require('./models');

fs.readFile('./data/questions.js', 'utf8', function(err, data) {
	var qs = eval(data);
	async.map(qs, function(q, cb) {
		models.Question.create({query:q.question, answers:q.answers, correct_answer:q.answers[q.answer_index-1]}, cb);
	}, function(err, results) {
		mongoose.connection.close();
	});
});
