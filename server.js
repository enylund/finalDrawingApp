var http = require('http');
var path = require('path');
var request = require('request');

var io = require('socket.io');
var express = require('express');
var MongoClient = require('mongodb').MongoClient;

// Configure the Express web server
var router = express();
var server = http.createServer(router);

// Tell Socket.IO to listen for websockets
var drawing_room = io.listen(server);

// Tell Express to serve static assets
router.use(express.static(path.resolve(__dirname, 'client')));

MongoClient.connect('mongodb://enylund:afU6gI4o@ds033559.mongolab.com:33559/networks', function(err, db) {
    if (err) throw err;

	var images = db.collection('images');

drawing_room
  .on('connection', function(socket) {
	

	images.find().sort({time: -1}).limit(1).each(function(err, message) {
	         if (err) throw err;
	         // An idiosyncracy of Mongo is that the last result will always be null.
	         // Ignore that one. 
	         if (message != null) {
	           //socket.emit('message', message);

				socket.emit('bdInfo', message);
	         }
	      });


socket.on('converter', function(data) {
	

	console.log(data.track);
	
	 var newImage = {
	           time: new Date(),
	 		  dataURLInfo: data.canvas,
			   trackLink: data.track,
				background: data.background
	         };
	 	
	 	images.insert(newImage, function(err, inserted) {
	           if (err) throw err; 
			  var refresh = true;
			  socket.emit('refreshPage', refresh);
	 
	         });

		
});
});

});

server.listen(Number(process.env.PORT || 5000));


