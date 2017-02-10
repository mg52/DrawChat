var portheroku = process.env.PORT || 5000;
var express = require('express');
var app = express();
var server = app.listen(portheroku);
var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
res.sendFile(__dirname + '/index.html');
});
console.log('Working!');
var user_id = 0;
var user_count = 0;
io.sockets.on('connection', function (socket) {
    var user = addUser();
	socket.emit("welcome",{wname:user.name, wid:user.uid});
    io.sockets.emit("usercount", { user_count: user_count });
    socket.on('disconnect', function () {
        removeUser();
    });
    socket.on("send_mouse_pos", function(data){
        socket.broadcast.emit("send_draw",{drawarray:data.mouse_pos,username:user.name,userid:user.uid});
    });
    socket.on("get_name", function(data){
        user.name = data.username;
        socket.emit("welcome",{wname:user.name, wid:user.uid});
    });
    socket.on("message_sent", function(data){
        io.sockets.emit("message_sent_correctly",{msc:data.sentuserid});
    });
    socket.on("check_id",function(data){
        if(data.ci === user.uid){
            socket.emit("id_checked");
        }
    });
});

var addUser = function() {
    user_id += 1;
    user_count += 1;
    io.sockets.emit("usercount", { user_count: user_count });
    var user = {
        uid: user_id,
        name: ""
    }
    return user;
}
var removeUser = function() {
    user_count -= 1;
    io.sockets.emit("usercount", { user_count: user_count });
}
 
