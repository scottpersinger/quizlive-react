'use strict';

var express      = require('express'),
    bodyParser   = require('body-parser'),
    cors         = require('cors'),
    http         = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use(cors()); // Allow from anywhere!
app.use(bodyParser.json());

// Connect to mongo

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost');

var Question     = require('./models/question'),
    User         = require('./models/user'),
    Game         = require('./models/game'),
    Guess        = require('./models/guess');

// Setup the router and our routes

var router = express.Router();

router.use(function(req, res, next) {
    // do logging
    //console.log('Something is happening. ', req.body);
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/questions')
  .get(function(req, res) {
 	Question.find(function(err, questions) {
  	if (err) res.send(err);
  	res.json(questions.map(function(q) {return q.toObject()}));
	});
  })

  .post(function(req, res) {
  	var question = new Question(req.body);
  	question.save(function(err) {
    	if (err) res.send(err);
      res.json(question.toObject());
    });
  })

router.route('/questions/:id')
  .put(function(req, res, next) {
    console.log('updating question: ' + req.params.id);
    Question.findByIdAndUpdate(
      req.params.id,
      { query: req.body.query,
        answers: req.body.answers,
        correct_answer: req.body.correct_answer,
      },
      { new: true },
      function (err, doc) {
        if (err) return next(err);
        res.send(doc.toObject());
      }
    );
  })

  .delete(function(req, res, next) {
    console.log('deleting question: ' + req.params.id);
    Question.findByIdAndRemove(req.params.id, function(err) {
      if (err) return next(err);
      res.status(204).send();
    })
  });


router.route('/users')
	.get(function(req, res) {
		User.find(function(err, users) {
			if (err) {
				res.send(err);
			} else {
				res.json(users.map(function(q) {return q.toObject()}));
			}
		})
	})

	.post(function(req, res) {
	  	var user = new User(req.body);
	  	user.save(function(err) {
	    	if (err) {
	        	res.status(403).send(err);
        } else {
	        res.json(user.toObject({virtuals:true}));
        }
	    });
	  });

router.route('/game')
	.get(function(req, res) {
		Game.findOne(function(err, game) {
			if (err) {
				res.send(err);
			} else {
				res.json(game.toObject());
			}
		})
	})

  .post(function(req, res) {
    if (req.headers['authorization'] == User.schema._admin_secret) {
      Game.remove({}, function() {
        Question.count({}, function(err, c) {
          Game.create({total_questions:c, current_question_index:0}, function(err, game) {
            res.send(game.toObject());
          });
        });
      });
    } else {
      res.status(403).send("Not authorized");
    }
  });

router.route('/guess')
	.post(function(req, res) {
      Guess.find({user_id:req.body.user_id, question_index:req.body.question_index}, function(err, rows) {
        if (rows.length > 0) {
          res.status(403).json({error: "Already answered"});
        } else {
          // !! Still need to finish this stuff
          Guess.create(req.body, function(err, guess) {
            // Now check for the correct answer
            Question.findOne({_id: guess.question_id}, function(err, record) {

            })
          })          
        }
      })
	  	var guess = new Guess(req.body);
	  	guess.save(function(err) {
	    	if (err) {
	        res.status(403).send(err);
        } else {
	         res.json({correct:true});
        }
	    });
	})

/********************* SERVER START *****************************/

app.use('/api', router);

app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

io.on('connection', function(socket) {
  console.log('a user connected');
});

module.exports = {app: app, mongoose: mongoose};
