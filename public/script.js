var socket = io.connect();

$(function() {
    $("#chatControls").hide();
    $("#usernameSet").on('click', setUsername);
    $("#submit").on('click',sendMessage);
});

var setUsername = function() {
    var username = $("#usernameInput").val();
    if (username)
    {
        socket.emit('setUsername', username);
        $('#chatControls').show();
        $('#usernameInput').hide();
        $('#usernameSet').hide();
    }
}

var sendMessage = function() {
    var msg = $('#messageInput').val();
    var username = $("#usernameInput").val();
    if (msg)
    {
        socket.emit('message', msg,username);
        addMessage(msg, "" + username, new Date().toISOString(), true);
        $('#messageInput').val('');
    }
    throwBall(username);
}



var addMessage = function(msg, username) {
    $("#chatEntries").append('<div class="message"><p>' + username + ' : ' + msg + '</p></div>');
}

var findUser = function(name){
  for (var i in usernames) {
    if(usernames[i] == name){
       return i
    }
  }
}


var throwBall = function(username){
    if (findUser(username) == 'user1'){
        user = 1
        otherUser = 2
    }
    else if (findUser(username) == 'user2'){
        user = 2
        otherUser = 1
    }
    var begin = d3.select('#court'+user)
    var end = d3.select('#court'+otherUser)
};

var disableChat = function(){

};

