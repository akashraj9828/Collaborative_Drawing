var express=require("express")
var app=express()
var server=app.listen(3000)
var io = require('socket.io').listen(server);
app.use(express.static("public"))


// var socket=require("socket.io")
// var io=socket(server)
io.sockets.on("connection",newConnection)

function newConnection(socket) {
    console.log("neww connnnnnnnneection");
    console.log(socket);
    
    
    
}
console.log("servr running");
