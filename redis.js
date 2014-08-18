module.exports = {
  db: require('redis').createClient(),

  crypto: require('crypto'),

  chatUsers: function(chatID){
    return "chat:" + chatID + ":users" ;
  },

  chatHistory: function(chatID){
    return "chat:"+ chatID + ":history" ;
  },

  getUsers: function(chatID,cb){
    return this.db.hvals(this.chatUsers(chatID), cb);
  },

  findUser: function(client, chatID, cb){
    return this.db.hget(this.chatUsers(chatID), client.id, cb);
  },

  getHistory: function(chatID, cb){
    return this.db.lrange(this.chatHistory(chatID), 0, -1, cb);
  },

  tokenExists: function(token,cb){
    this.db.sismember("tokens", token, function(err,res) {
        if (err) throw err;
        cb(null, res == 0);
    });
  },

  generateToken: function(){
    try {
      var token = this.urlSafeBase64(this.crypto.randomBytes(23));
    } catch (ex) {
      console.log(ex)
    }
    return token;
    // tokenExists(token, function(err,res){
    //   if (err) throw err;
    //   // res ? token : generateToken();
    // })
  },

  urlSafeBase64: function(buf){
    return buf.toString('base64')
              .replace(/\+/g, '-') // Convert '+' to '-'
              .replace(/\//g, '_') // Convert '/' to '_'
              .replace(/=+$/, ''); // Remove '=', '+', and '$'
  }

}
