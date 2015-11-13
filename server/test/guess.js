var request = require('supertest')
   , should = require('should'),
   async    = require('async'),
   _ = require('lodash');

var root = require('../index'),
    app = root.app,
    mongoose = root.mongoose;
var models = require('../models');

request = request(app);

describe("Guesses...: ", function() {
  var user_id, question_id;

	beforeEach(function(done) {
		mongoose.connection.close(function() {
			mongoose.connect('mongodb://localhost', function() {
				async.parallel([
						function(cb) {
							models.Guess.remove({}, cb);
						},
						function(cb) {
							models.Question.remove({}, cb);
						},
            function(cb) {
              models.User.remove({}, function(err){
                if (err) {
                  cb(err);
                  return;
                }
                models.User.create({
                  name: "scott",
                  points: 0
                }, function(err, user){
                  user_id = user.name;
                  cb(err);
                });
              });
            }
					], function() {
			 			models.Question.create({question:"What color is the sky?",
			 				answers:["red","blue","green"],
			 				correct_answer:"blue"}, function(err, question){
                if (err) {
                  done(err);
                  return;
                }
                question_id = question._id;
                done(null);
              });
				});
		 	});
		});
	});

	it('allows a user to post a guess', function(done) {
		request
		  .post('/api/guesses')
		  .send({user_id: user_id, question_id: question_id, answer: "blue"})
		  .expect(201, done);
	});

	it('does not allow a user to post a second guess', function(done) {
		async.series([
			function(cb) {
				request
				  .post('/api/guesses')
				  .send({user_id: user_id, question_id: question_id, answer:"blue"})
				  .expect(201, cb);
			},
			function(cb) {
				request
				  .post('/api/guesses')
				  .send({user_id: user_id, question_id: question_id, answer:"red"})
				  .end(function(err, res) {
				  	res.statusCode.should.be.equal(403);
				  	cb();
				  });
			}
		], done);
	});

	it('increments the points by 5 of the first user to answer correctly', function(done) {
		async.series([
			function(cb) {
				request
				  .post('/api/guesses')
				  .send({user_id: user_id, question_id: question_id, answer:"blue"})
				  .expect(201, cb);
			},
			function(cb) {
        models.User.findOne({name:user_id}, function(err, user){
          should(user.points).be.exactly(5);
          cb();
        });
			}
		], done);
	});

	it('increments the points by 1 of users that do not answer first', function(done) {
    var newUser;
    async.series([
			function(cb) {
        models.User.create({
          name: "speedy",
          points: 0
        }, function(err, user){
          newUser = user;
          cb(err);
        });
			},
			function(cb) {
				request
				  .post('/api/guesses')
				  .send({user_id: newUser.name, question_id: question_id, answer:"blue"})
				  .expect(201, cb);
			},
			function(cb) {
				request
				  .post('/api/guesses')
				  .send({user_id: user_id, question_id: question_id, answer:"blue"})
				  .expect(201, cb);
			},
			function(cb) {
        models.User.findOne({name:user_id}, function(err, user){
          should(user.points).be.exactly(1);
          cb();
        });
			}
		], done);
	});

});
