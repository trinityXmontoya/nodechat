// REDIS SETUP
var redis = require('redis');
var db = redis.createClient();
var pub = redis.createClient();
var sub = redis.createClient();


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
app.get('/getUsers', function(req,res, next){
  getOnlineUsers(function (err, response){
    if (err) throw err;
    res.send(response)
  })
});

// REDIS DATA
var getOnlineUsers = function(cb){
  return db.smembers("onlineUsers", cb)
}

var findUser = function(client, cb){
  return db.get(client.id, cb);
}


// SOCKET AND REDIS PUB/SUB CONFIG
io.sockets.on('connection', function(client){

  sub.subscribe("chatting");
  sub.on("message", function (channel, message) {
        console.log("message received on server from publish");
        client.send(message);
    });

  client.on("sendMessage", function(msg) {
            pub.publish("chatting",msg);
        });

  client.on("setUsername", function(user){
            pub.publish("chatting","A new user in connected:" + user);
            db.set(client.id,user)
            db.sadd("onlineUsers",user);
        }
    );

  client.on('disconnect', function () {
        sub.quit();
        var username = findUser(client, function (err,response){
          if (err) throw err;
          db.srem('onlineUsers', response);
        });
        pub.publish("chatting","User is disconnected :" + username);
    });

});
