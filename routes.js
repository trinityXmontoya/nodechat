module.exports = {

  home: function(req, res){
   res.render('home.jade');
  },

  generateChat: function(req,res){
   res.redirect('/chat', {token: redis.generateToken()});
  },

  accessChat: function(req,res){
    var token = req.params.token;
    console.log(token)
    res.render('chat.jade')
  },

  getUsers: function(req,res){
   redis.getUsers(function (err, response){
     if (err) throw err;
     res.send(response);
   });
  },

  getHistory: function(req,res){
   redis.getHistory(function(err,response){
     if (err) throw err;
     res.send(response);
   });
  }
}
