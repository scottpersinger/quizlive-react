var request = require('supertest')
   , should = require('should');

var root = require('../index'),
    app = root.app,
    mongoose = root.mongoose;
var models = require('../models');

request = request(app);

describe("Questions CRUD works", function() {
	before(function(done) {
		mongoose.connection.close(function() {
			mongoose.connect('mongodb://localhost', function() {
		 		models.Question.remove({}, done);
			});
		});
	});

  it('can POST a new question', function(done) {
		request
		  .post('/api/questions')
		  .send({query:"Are you experienced?", answers:["Yes","No"]})
		  .expect(200, function() {
				models.Question.count({}, function(err, c) {
					c.should.equal(1);
					done();
				});
			});
	});

	it('can list all the questions', function(done) {
		request
			.get('/api/questions')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				res.body.should.be.Array;
				res.body.length.should.be.equal(1);
				done();
			});
	});

	it('can delete a question', function(done) {
		var question = new models.Question({query:"What time is it?", answers:[]});
  	question.save(function(err) {
    	request
    		.delete('/api/questions/' + question._id)
    		.expect(200)
    		.end(function(err, res) {
    			models.Question.count({'_id':question._id}, function(err, c) {
    				c.should.be.equal(0);
    				done();
    			});
    		});
    });		
	})
});
