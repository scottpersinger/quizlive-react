var fs = require('fs');
var async = require('async');
var mongoose   = require('mongoose');
var http = require('https');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost');

var models = require('./models');

var host = 'https://dl.dropboxusercontent.com/u/1892875/questions.js';

function insert_questions(qs){
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
}

http.get(host, function(res) {
	var body = '';
	res.on('data', function(chunk) {
		body = body + chunk;
	});
	res.on('end', function() {
		insert_questions(eval(body));
	});
});

