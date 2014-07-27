var Chat = {

  client: io.connect('http://localhost'),

  init: function(){
    $("#messageInput").hide();
    $("#usernameInput").on('keypress', $.proxy(this.setUsername,this));
    $("#messageInput").on('keypress', $.proxy(this.sendMessage,this));
    this.clientSetup();
    this.showCurrentUsers();
    this.loadHistory();
  },

  clientSetup: function(){
    var _this = this;

    this.client.on('news', function (data) {
        $('body').prepend('<h3>'+data+'</h3>');
    });

    this.client.on("newMsg", function(msg){
        _this.addMessage(msg);
    });

    this.client.on("usernameSet", function(username){
        _this.addUser(username);
    });

    this.client.on('userDisconnect', function(username){
        _this.addMessage(username + " has left the room.");
        $('.user[data-username="'+ username +'"]').remove();
    });
  },
  showCurrentUsers: function(){
    var _this = this;
    $('#list-of-users').empty();
    $.getJSON('getUsers', function(users){
        for (var i in users) {
          _this.addUser(users[i]);
        }
    });
  },

  loadHistory: function(){
    $('#chatEntries').empty();
    var _this = this;
    $.getJSON('getHistory', function(history){
        for (var i in history){
            _this.addMessage(history[i]);
        }
    });
  },

  addUser: function(username){
    $('#list-of-users').prepend("<li class='user' data-username='"+username+"'>"+username+"</li>");
  },

  setUsername: function(e){
    var _this = this;
    if (e.keyCode == 13 || e.which == 13) {
      var username = $("#usernameInput").val();
      if (username) {
          var user = username;
          _this.client.emit('setUsername', username);
          $('#messageInput').show();
          $('#usernameInput').hide();
      }
    }
  },

  sendMessage: function(e){
    var _this = this;
   if (e.keyCode == 13 || e.which == 13) {
      var msg = $('#messageInput').val();
      var username = $("#usernameInput").val();
      if (msg) {
        var log = username + ": " + msg
        _this.client.emit('sendMessage', log);
        _this.client.emit('message', log)
        $('#messageInput').val('');
        // populate(username,msg);
      }
    }
  },

  addMessage: function(msg) {
     $("#chatEntries").prepend('<div class="message"><p>' +  msg + '</p></div>');
  }

// var populate = function(username,msg) {
//     var data ;
// }

};



