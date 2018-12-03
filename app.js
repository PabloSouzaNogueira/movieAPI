var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var port = process.env.PORT || 3000;

app.listen(port, function () { 'use strict'; console.log('Listening on port ' + port); });

//midleware
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//controllers
var actorCtrl = require('./server/controllers/actor.js');
var movieCtrl = require('./server/controllers/movie.js');
var directorCtrl = require('./server/controllers/director.js');
var userCtrl = require('./server/controllers/user.js');
var userMovieCtrl = require('./server/controllers/user_movie.js');


//routers

app.get('/', function (req, res) {
	res.send('server is running!', 200);
});



app.get('/movies', function (req, res) {
	movieCtrl.readAll(function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.get('/movie/:id', function (req, res) {
	var id = req.params["id"];
	movieCtrl.readFromID(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
})

app.delete('/movie/:id', function (req, res) {
	var id = req.params["id"];
	actorCtrl.deleteFromID(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.put('/movie/:id', function (req, res) {
	var id = req.params["id"];
	var body = req.body;
	actorCtrl.edit(id, body, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.post('/movies', function (req, res) {
	var body = req.body;
	actorCtrl.insert(body, function (resp) {
		res.status(resp.statusCode).json(resp)
	});
});



app.get('/actors', function (req, res) {
	actorCtrl.readAll(function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.get('/actor/:id', function (req, res) {
	var id = req.params["id"];
	actorCtrl.readFromID(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.delete('/actor/:id', function (req, res) {
	var id = req.params["id"];
	actorCtrl.deleteFromID(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.put('/actor/:id', function (req, res) {
	var id = req.params["id"];
	var body = req.body;
	actorCtrl.edit(id, body, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.post('/actors', function (req, res) {
	var body = req.body;
	actorCtrl.insert(body, function (resp) {
		res.status(resp.statusCode).json(resp)
	});
});




app.get('/directors', function (req, res) {
	directorCtrl.readAll(function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.get('/director/:id', function (req, res) {
	var id = req.params["id"];
	directorCtrl.readFromID(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.delete('/director/:id', function (req, res) {
	var id = req.params["id"];
	directorCtrl.deleteFromID(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.put('/director/:id', function (req, res) {
	var id = req.params["id"];
	var body = req.body;
	directorCtrl.edit(id, body, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.post('/directors', function (req, res) {
	var body = req.body;
	directorCtrl.insert(body, function (resp) {
		res.status(resp.statusCode).json(resp)
	});
});



app.get('/user/:id/statistic', function (req, res) {
	var id = req.params["id"];
	userMovieCtrl.statistic(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.get('/user/:id/list', function (req, res) {
	var id = req.params["id"];
	userMovieCtrl.readAll(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.post('/user/:id/list', function (req, res) {
	var userId = req.params["id"];
	var body = req.body;
	userMovieCtrl.insert(userId, body, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.delete('/user/:userid/list/:movieid', function (req, res) {
	var userId = req.params["userid"];
	var movieId = req.params["movieid"];
	userMovieCtrl.deleteFromID(userId, movieId, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});



app.post('/auth/signin', function (req, res) {
	var fbToken = req.body.fbToken;
	userCtrl.signin(fbToken, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});



