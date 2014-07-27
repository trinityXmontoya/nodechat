// REDIS SETUP
var redis = require('redis');
var db = redis.createClient();

// NODE & SOCKET SETUP
var http = require('http');
var express = require('express');
var app = express();
var PORT = 8080;
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(PORT, function(){
  console.log("Now connected on localhost:" + PORT)
});

// ROUTES SETUP
app.set('views', __dirname + '/views');
app.set("view options", {layout: false});
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
 res.render('home.jade');
});
app.get('/getUsers', function(req,res){
  getUsers(function (err, response){
    if (err) throw err;
    res.send(response)
  })
});
app.get('/getHistory', function(req,res){
  getHistory(function(err,response){
    if (err) throw err;
    res.send(response);
  })
})

// REDIS API DATA
var getUsers = function(cb){
  return db.smembers("onlineUsers", cb)
}

var findUser = function(client, cb){
  return db.get(client.id, cb);
}

var getHistory = function(cb){
  return db.smembers('chatHistory', cb);
}

// SOCKET CONFIG
io.on('connection', function (client) {

  io.emit("newMsg", "New user has joined.");

  var _io = io;
  client.on("sendMessage", function(msg){
          db.sadd("chatHistory", msg);
          _io.emit("newMsg", msg);
  });

  client.on("setUsername", function(user){
          db.set(client.id,user);
          db.sadd("onlineUsers",user);
          _io.emit("usernameSet", user);
  });

  client.on("disconnect", function(){
      findUser(client, function (err,response){
        if (err) throw err;
        _io.emit("userDisconnect", response);
        db.srem('onlineUsers', response);
      });
  });


});

