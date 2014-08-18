module.exports = {
  init: function(){
    var io = require('socket.io').listen(server);
    io.on('connection', function (client) {

      io.emit("newMsg", "New user has joined.");

      var _io = io;
      var db = redis.db;
      var chatID = "";
      
      client.on("sendMessage", function(msg){
          db.lpush(redis.chatHistory(chatID), msg);
          _io.emit("newMsg", msg);
      });

      client.on("setUsername", function(user){
          db.sadd(redis.chatUsers(chatID), user);
          _io.emit("usernameSet", user);
      });

      client.on("disconnect", function(){
          // redis.findUser(chatID,client, function (err,user){
          //   if (err) throw err;
          //   redis.db.srem(redis.chatUsers(chatID), user);
          //   _io.emit("userDisconnect", user);
          // });
      });

    });
  }
}
