// NODE & SOCKET SETUP
var http = require('http');
var crypto = require('crypto');
var express = require('express');
var app = express();
var PORT = 8080;
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(PORT, function(){
  console.log("Now connected on localhost:" + PORT)
});

// REDIS SETUP
var redis = require('redis');
var db = redis.createClient();

// ROUTES SETUP
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
 res.render('home.jade');
});
app.get('/chat', function(req,res){
  res.redirect('/chat/' + generateToken());
});
app.get('/chat/:token', function(req,res){
  res.render('chat.jade')
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
  return db.lrange('chatHistory', 0, -1, cb);
}

var tokenExists = function(token){
  return db.exists('chatroom:'+ token)
}

// TOKEN GENERATION
var generateToken = function(){
  crypto.randomBytes(48, function(ex, buf) {
    var token = buf.toString('hex');
    tokenExists(token)==true ? token : generateToken();
  });
}

// SOCKET CONFIG
io.on('connection', function (client) {

  io.emit("newMsg", "New user has joined.");

  var _io = io;
  client.on("sendMessage", function(msg){
          db.lpush("chatHistory", msg);
          _io.emit("newMsg", msg);
  });

  client.on("setUsername", function(user){
          // db.hset("",);
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
