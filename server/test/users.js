var request = require('supertest')
   , should = require('should'),
   _ = require('lodash');

var root = require('../index'),
    app = root.app,
    mongoose = root.mongoose;
var models = require('../models');

request = request(app);

describe("Users CRUD...", function() {
	before(function(done) {
		mongoose.connection.close(function() {
			mongoose.connect('mongodb://localhost', function() {
		 		models.User.remove({}, done);
			});
		});
	});

  it('can POST a new user', function(done) {
		request
		  .post('/api/users')
		  .send({name:"admin"})
		  .expect(200)
		  .end(function(err, res) {
		  	res.body.token.should.be.ok;
				models.User.count({name:"admin"}, function(err, c) {
					c.should.equal(1);
					done();
				});
			});
	});

  it('cannot make a user with same name', function(done) {
		request
		  .post('/api/users')
		  .send({name:"admin"})
		  .expect(403, done);
	});

  it('can POST a non-admin user and get no token', function(done) {
		request
		  .post('/api/users')
		  .send({name:"scott"})
		  .expect(200)
		  .end(function(err, res) {
		  	should.not.exist(res.body.token);
				models.User.count({name:"scott"}, function(err, c) {
					c.should.equal(1);
					done();
				});
			});
	});

	it('can list all the users', function(done) {
		models.User.create({name:"Manfred"}, {name:"Julios"}, function() {
			request
				.get('/api/users')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					var m = 
					  _.find(res.body, function(u) {return u.name == "Manfred"});
					m.should.be.ok;
				  _.find(res.body, function(u) {return u.name == "Julios"}).should.be.ok;
					done();
				});
		});
	});
});
