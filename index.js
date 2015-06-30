var port = process.env.PORT || 5000;
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(port);
app.get('/', function (req, res) {
res.sendFile(__dirname + '/index.html');
});
console.log('Working!');
var user_id = 0;
var user_count = 0;
var users = [];
io.sockets.on('connection', function (socket) {
    var user = addUser();
    io.sockets.emit("usercount", { user_count: user_count });
    socket.on('disconnect', function () {
        removeUser(user);
    });
    socket.on("send_mouse_pos", function(data){
        socket.broadcast.emit("send_draw",{drawarray:data.mouse_pos,username:user.name,userid:user.uid});
    });
    socket.on("get_name", function(data){
        user.name = data.username;
        socket.emit("welcome",user);
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
    users.push(user);
    return user;
}
var removeUser = function(user) {
    user_count -= 1;
    io.sockets.emit("usercount", { user_count: user_count });
    for(var i=0; i<users.length; i++) {
        if(user.uid === users[i].uid) {
            users.splice(i, 1);
            return;
        }
    }
}
