# ytsync-demo
ytsync is just a quick proof of concept/demo of syncing YouTube video playback between multiple browsers/tabs. 

## Tools
ytsync utilizes the following tools:

1. [YouTube Player API](https://developers.google.com/youtube/iframe_api_reference)
2. [Node.js](http://nodejs.org/) - Application Server
3. [Express.js](http://expressjs.com/) - Node.js Web Framework
4. [Socket.io](http://socket.io/) - Realtime Application Framework

## Running Locally
To run and test this locally, first install Node.js then:

```sh
$ git clone git@github.com:davbai/ytsync-demo.git
$ cd ytsync-demo
$ npm install
$ node server.js
```

You can hit the app [http://localhost:3000](http://localhost:3000).

## How It Works
After a YouTube ```url``` is entered, it is parsed and the client will emit a ```video-loaded``` message passing along the ```videoId``` as data. 

```js
// client.js
// "video-loaded" message is emitted from the client
socket.emit("video-loaded", {
	videoId: videoId
});
```

When the server receives the ```video-loaded``` message, it then broadcasts a ```load-video``` message to all connect clients, also passing ```videoId``` so the clients listening will know what video to load.

```js
// server.js
// on receiving a "video-loaded" message, emit "load-video" to all clients
socket.on("video-loaded", function(data) {
	socket.broadcast.emit("load-video", {
		videoId: data.videoId
	});
});
```

If the client on the receiving end has already an instance of ```YT.Player``` (from a previous video being loaded) then that ```player``` will cue the new video, otherwise a new ```YT.Player``` will be created with the specified ```videoId```.

```js
// client.js
// if the client does not yet have a player created
function createVideoPlayer(videoId) {
    player = new YT.Player("player", {
		height: "390",
		width: "640",
		videoId: videoId,
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange
		}
	});
}

// a player has already been created earlier
function cueVideoPlayer(videoId) {
	player.cueVideoById(videoId);
}
```

For other events such as playing, and pausing the video, the same flow occurs with their own respective messages that send when an event is trigger (when the video player changes state).

```js
// client.js
// this function is called by the YouTube API when the state of the player changes
function onPlayerStateChange(event) {
	var player = event.target;
	switch(event.data) {
		case YT.PlayerState.PLAYING:
			socket.emit("video-playing", {
				videoId: getVideoIdFromUrl(player.getVideoUrl()),
				currentTime: player.getCurrentTime()
			});
			break;
		case YT.PlayerState.PAUSED:
			socket.emit("video-paused");
			break;
	}
}
```

## License

MIT License

