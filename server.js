var http = require('http');
var express = require('express');
var app = express();
var jade = require('jade');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var PORT = 8080;
server.listen(PORT, function(){
  console.log("Now connected on localhost:" + PORT)
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", {layout: false});
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
 res.render('home');
});

usernames = {}

var usernamesIsEmpty = function(usernames){
  (Object.getOwnPropertyNames(usernames).length === 0)
}

io.sockets.on('connection', function(socket){

  socket.on('setUsername', function(name){
    if (usernamesIsEmpty){
      usernames['user1'] = name;
    }
    else if (usernames.length == 2) {

    }
    else {
      usernames['user2'] = name;
    }
  });

  socket.on('message', function (msg,username) {
      socket.broadcast.emit('message', msg);
      console.log(username + " sent this : " + msg);
    })
  });




