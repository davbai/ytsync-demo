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

## License

MIT License

