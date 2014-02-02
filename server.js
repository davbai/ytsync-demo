var express = require("express"),
	app		= express(),
	server	= require("http").createServer(app),
	io		= require("socket.io").listen(server);

server.listen(3000);

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
	res.sendfile(__dirname + "/public/index.html");
});

io.sockets.on("connection", function(socket) {

	socket.on("video-loaded", function(data) {
		socket.broadcast.emit("load-video", {
			videoId: data.videoId
		});
	});

	socket.on("video-playing", function(data) {
		socket.broadcast.emit("play-video", {
			videoId: data.videoId, 
			currentTime: data.currentTime
		});
	});

	socket.on("video-paused", function(data) {
		socket.broadcast.emit("pause-video");
	});

});
