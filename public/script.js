$(document).ready( function(){
    $client = io.connect();
    initialize();
});


var setUsername = function(){
    var username = $("#usernameInput").val();
    if (username)
    {
        var user = username;
        $client.emit('setUsername', username);
        $('#chatControls').show();
        $('#usernameInput').hide();
        $('#usernameSet').hide();
        showCurrentUsers();
    }
}

var showCurrentUsers = function(){
    $('#list_of_users').empty();
    $.getJSON('getUsers', function(data){
        for (var i in data){
             $('#list_of_users').append("<li> User: "+data[i]+"</li>")
        }
    });
}

var sendMessage = function(){
    var msg = $('#messageInput').val();
    var username = $("#usernameInput").val();
    if (msg)
    {
        var data = {msg: msg, user: username}
        $client.emit('message', data);
        addMessage(data);
        $('#messageInput').val('');
        // populate(username,msg);
    }
}


var addMessage = function(data) {
    $("#chatEntries").append('<div class="message"><p>' + data.user + ' : ' + data.msg + '</p></div>');
}


// var populate = function(username,msg) {
//     var data ;
// }

var initialize = function(){
    $("#chatControls").hide();
    $("#usernameSet").on('click', setUsername);
    $("#submit").on('click',sendMessage);
    showCurrentUsers();
}
