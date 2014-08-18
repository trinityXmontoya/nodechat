// NODE & SOCKET
var http = require('http');
var express = require('express');
var app = express();
var PORT = 8080;
global.server = http.createServer(app);
server.listen(PORT, function(){
  console.log("Now connected on localhost:" + PORT)
});
var socket = require('./socket');
socket.init();

// ROUTES
var routes = require('./routes');

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', routes.home);
app.get('/chat', routes.generateChat);
app.get('/chat/:token', routes.accessChat);
app.get('/getUsers', routes.getUsers);
app.get('/getHistory', routes.getHistory);

// REDIS API
global.redis = require('./redis');
