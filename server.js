var jade = require('jade');
var PORT = 8080;

var redis = require('redis');
var db = redis.createClient();
var pub = redis.createClient();
var sub = redis.createClient();

var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
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
            db.sadd("onlineUsers",user);
        }
    );

  client.on('disconnect', function () {
        sub.quit();
        pub.publish("chatting","User is disconnected :" + client.id);
    });
});
