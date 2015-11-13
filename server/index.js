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

app.use(express.static('build'));
app.set('views', '.');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('build/index');
});


// Connect to mongo

var mongoose   = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost');

var models = require('./models');

var Question     = models.Question,
    User         = models.User,
    Game         = models.Game,
    Guess        = models.Guess;

// Setup the router and our routes

var router = express.Router();

router.use(function(req, res, next) {
    // do logging
    //console.log(req.path, " ", req.body);
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
		User.find({name: {$ne: 'admin'}}, function(err, users) {
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
        User.findOne({name: req.params.name}, function(err, doc) {
          if (err) return next(err);
          if (doc) {
            doc.remove(function(err) {
              if (err) return next(err);
              res.status(204).send();
            })
          }
          else {
            res.status(404).send();
          }
        });
      });

router.route('/game')
	.get(function(req, res) {
		Game.findOne(function(err, game) {
			if (err) {
				res.send(err);
			} else if (game) {
        res.json(game.toObject());
      } else {
        res.status(404).send();
      }
		})
	})

  .post(function(req, res) {
    if (req.headers['authorization'] === User.schema._admin_secret) {
      console.log("Remove the game");
      Game.remove({}, function() {
        Guess.remove({}, function() {
          Question.count({}, function(err, c) {
            console.log("Create the game");
            Game.create({total_questions:c, current_question_index:-1, question:{}}, function(err, game) {
              console.log("Clear user points");
              User.find({}).then(function(users) {
                async.map(users, function(user, cb) {
                  user.points = 0;
                  user.save().then(cb);
                }, function() {
                  console.log("Send the game");
                  res.send(game.toObject());
                });
              });
            });
          });
        });
      });
    } else {
      res.status(403).send("Not authorized");
    }
  })

  .put(function(req, res) {
    if (req.headers['authorization'] === User.schema._admin_secret) {
      Game.findOne({_id:req.body.id}, function(err, doc) {
        if (doc) {

          doc.question_eta = 3;
          doc.save(function() {
            res.send(doc.toObject());
          });

          var interval = setInterval(function () {
            if (doc.question_eta === 1) {

              doc.question_eta = 0;
              doc.current_question_index = req.body.current_question_index;
              Question.find({}, function(err, questions) {
                if (doc.current_question_index >= 0 && doc.current_question_index < questions.length) {
                  doc.question = {question_id: questions[doc.current_question_index].id,
                                  query:questions[doc.current_question_index].query,
                                  answers:questions[doc.current_question_index].answers};
                  console.log(questions[doc.current_question_index]);
                  doc.save();
                }
              })

            }
            else {
              doc.question_eta = doc.question_eta -1;
              doc.save();
              if (doc.question_eta <= -10) {
                clearInterval(interval);
              }
            }
          }, 1000);

        } else {
          res.status(404).send("Game id not found");
        }
      });
    } else {
      res.status(403).send("Not authorized");
    }
  });

router.route('/guesses')
	.post(function(req, res) {
      async.waterfall([
        // make sure user hasn't already answered ...
        function(cb) {
          Guess.find({user_id:req.body.user_id, question_id:req.body.question_id}, function(err, rows){
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
              User.findOne({name: req.body.user_id}, function(err, doc) {
                if (err) return cb(err);
                console.log("Setting a users points ", doc.toObject());
                doc.points = (doc.points || 0) + (firstToAnswer ? 5 : 1);
                doc.save(function(err) {
                  if (firstToAnswer) {
                    Game.findOne({}).then(function(game) {
                      if (game && !game.question.first_correct) {
                        game.question.first_correct = req.body.user_id;
                        game.save();
                      }
                      return cb(err);
                    });
                  } else {
                      return cb();
                  }
                });
              });
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

function model_signals(action, modelName, doc) {
  //console.log("Model ", modelName, ": ", action, ": ", doc.toObject());
  // Dispatch event to _subscriptions
  io.emit('publish', {resource: modelName.toLowerCase(), action: action, data: doc.toObject()});
}
require('./models/signals')(models, model_signals);


io.on('connection', function(socket) {
  console.log('socket connection established');

  socket.on('subscribe', function(resource) {
    // TODO: Add authorization base on a client token
    console.log("[SUBSCRIBE] ", resource);
  });
});


module.exports = {app: app, mongoose: mongoose};
