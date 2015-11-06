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

var Question     = require('./models/question');

// Setup the router and our routes

var router = express.Router();  

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening. ', req.body);
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/questions')
  .get(function(req, res) {
 	Question.find(function(err, questions) {
    	if (err)
        	res.send(err);

    	res.json(questions.map(function(q) {return q.toObject()}));
	});
  })

  .post(function(req, res) {
  	var question = new Question(req.body);
  	question.save(function(err) {
    	if (err)
        	res.send(err);

        res.json(question.toObject());
    });
  });

/********************* SERVER START *****************************/

app.use('/api', router);

app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

io.on('connection', function(socket) {
  console.log('a user connected');
});

