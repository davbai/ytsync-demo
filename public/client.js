var socket = io.connect("localhost", {port: 3000});
var player;

socket.on("load-video", function(data) {
	updateVideoPlayer(data.videoId);
});

socket.on("play-video", function(data) {
	if (player && player.getPlayerState() != YT.PlayerState.PLAYING) {
		player.seekTo(data.currentTime);
		player.playVideo();
	}
});

socket.on("pause-video", function(data) {
	if (player && player.getPlayerState() == YT.PlayerState.PLAYING) {
		player.pauseVideo();
	}
});

document.querySelector("#load-video").onclick = function() {
	var videoId = getVideoIdFromUrl(document.querySelector("#video-url").value);
	updateVideoPlayer(videoId);

	socket.emit("video-loaded", {
		videoId: videoId
	});
}

// hide video url input until youtube api is loaded
function onYouTubeIframeAPIReady() {
	document.querySelector("#loader").className = "active";
}

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

function onPlayerReady(event) {
	console.log('ready');
}

function updateVideoPlayer(videoId) {
	if (player) { // player has already been created, we can just cue the new video
		cueVideoPlayer(videoId);
	} else { // create a new player with the given video id
		createVideoPlayer(videoId);
	}
}

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

function cueVideoPlayer(videoId) {
	player.cueVideoById(videoId);
}

// http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
function getVideoIdFromUrl(videoUrl) {
	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = videoUrl.match(regExp);
	return match[2];
}