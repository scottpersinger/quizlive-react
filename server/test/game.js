var request = require('supertest')
   , should = require('should'),
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
		 		models.Game.remove({}, function() {
		 			models.Question.create({query:"Hello?",answers:["1","2","3"]}, done);
		 		});
			});
		});
	});

	it('does not allow guest to POST a game', function(done) {
		request
		  .post('/api/game')
		  .set('Authorization', 'scott')
		  .send({current_question_index:0})
		  .expect(403, done);
	});

	it('does allow the admin to POST a game', function(done) {
		request
		  .post('/api/game')
		  .set('Authorization', models.User.schema._admin_secret)
		  .send({current_question_index:0})
		  .expect(200, function(err, res) {
		  	res.body.should.have.property('current_question_index');
		  	res.body.should.have.property('total_questions');
		  	res.body.should.have.property('question');
		  	done();
		  });
	});

	it('does allow the admin to update a game', function(done) {
		request
		  .get('/api/game')
		  .end(function(err, res) {
				request
				  .put('/api/game')
				  .set('Authorization', models.User.schema._admin_secret)
				  .send({id: res.body.id, current_question_index:0})
				  .expect(200, function(err, res) {
				  	res.body.should.have.property('current_question_index');
				  	res.body.current_question_index.should.equal(0);
				  	res.body.should.have.property('question');
				  	res.body.question.should.have.property('query');
				  	done();
				  });

		  })
	});
	
});
