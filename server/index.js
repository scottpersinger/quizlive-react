'use strict';

var express      = require('express'),
    bodyParser   = require('body-parser'),
    cors         = require('cors'),
    http         = require('http');

var async = require('async');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use(cors()); // Allow from anywhere!
app.use(bodyParser.json());

// Connect to mongo

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost');

var models = require('./models');

var Question     = models.Question,
    User         = models.User,
    Game         = models.Game,
    Guess        = models.Guess;

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
	        res.status(201).json(user.toObject({virtuals:true}));
        }
	    });
	  });

    router.route('/users/:name')
      .delete(function(req, res, next) {
        console.log('deleting user: ' + req.params.name);
        User.findOneAndRemove({name: req.params.name}, function(err) {
          if (err) return next(err);
          res.status(204).send();
        })
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
    if (req.headers['authorization'] === User.schema._admin_secret) {
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
      async.waterfall([
        // make sure user hasn't already answered ...
        function(cb) {
          Guess.find({user_id:req.body.user_id, question_index:req.body.question_index}, function(err, rows){
            if (err) {
              cb(err);
              return;
            }
            if (rows.length > 0) {
              cb({
                status: 403,
                data: {
                  error: 'Already answered'
                }
              });
              return;
            }
            cb(null);
          })
        },
        // create guess for user ...
        function(cb) {
          Guess.create(req.body, function(err, guess) {
            if (err) {
              cb(err);
              return;
            }
            cb(null, guess);
          });
        },
        // lookup correct answer
        function(guess, cb) {
          Question.findOne({_id: guess.question_id}, function(err, question) {
            if (err) {
              cb(err);
              return;
            }
            cb(null, guess, question);
          });
        },
        // check if answer is correct ...
        function(guess, question, cb) {
          // they answered wrong, we can bail now ...
          if (guess.answer !== question.correct_answer) {
            cb(null, false);
            return;
          }
          // increment points ...
          async.waterfall([
            // see if someone else answered correct already ...
            function(cb){
              Guess.find({question_id: guess.question_id, answer: question.correct_answer}, function(err, rightGuesses) {
                if (err) {
                  cb(err);
                  return;
                }
                cb(null, rightGuesses.length === 1);
              });
            },
            // increment user's points ...
            function(firstToAnswer, cb){
              User.findByIdAndUpdate(
                req.body.user_id,
                {
                  $inc: {
                    points: firstToAnswer ? 5 : 1
                  }
                },
                function (err, user) {
                  cb(err);
                }
              );
            }
          ], function(err){
            cb(err, true);
          });
        }
      ], function(err, correct) {
        // handle errors
        if (err) {
          if (err.status) {
            res.status(err.status).json(err.data);
          }
          else {
            console.log(err);
            res.sendStatus(500);
          }
          return;
        }
        res.status(201).json({
          correct: correct
        });
      });
	});

/********************* SERVER START *****************************/

app.use('/api', router);

app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

var _subscriptions = {};

function model_signals(action, modelName, doc) {
  console.log("Model ", modelName, ": ", action, ": ", doc.toObject());
  // Dispatch event to _subscriptions
}
require('./models/signals')(models, model_signals);


io.on('connection', function(socket) {
  console.log('socket connection established');
});

module.exports = {app: app, mongoose: mongoose};
