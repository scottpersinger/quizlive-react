var request = require('supertest')
   , should = require('should'),
   async    = require('async'),
   _ = require('lodash');

var root = require('../index'),
    app = root.app,
    mongoose = root.mongoose;
var models = require('../models');

request = request(app);

describe("Game CRUD works", function() {
	before(function(done) {
		mongoose.connection.close(function() {
			mongoose.connect('mongodb://localhost', function() {
				async.parallel([
						function(cb) {
							models.Guess.remove({}, cb);
						},
						function(cb) {
							models.Question.remove({}, cb);
						}
					], function() {
			 			models.Question.create({question:"What color is the sky?",
			 				answers:["red","blue","green"],
			 				correct_answer:"blue"}, done);
				});
		 	});
		});
	});

	it('allows a user to post a guess', function(done) {
		request
		  .post('/api/guess')
		  .set('Authorization', 'scott')
		  .send({user_id:'scott', question_index:0, answer:"blue"})
		  .expect(200, done);
	});

	it('does not allow a user to post a second guess', function(done) {
		async.series([
			function(cb) {
				request
				  .post('/api/guess')
				  .set('Authorization', 'scott')
				  .send({user_id:'scott', question_index:0, answer:"blue"})
				  .expect(200, cb);
			},
			function(cb) {
				request
				  .post('/api/guess')
				  .set('Authorization', 'scott')
				  .send({user_id:'scott', question_index:0, answer:"red"})
				  .expect(403, cb);
			}
		], done);
	});
	
});
