// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html


var counter = 0;
// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();
const expressip = require('express-ip');
// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

var ip_list=[]



app.use(expressip().getIpInfoMiddleware,(req,res,next)=>{
    var ip_addr= req.headers['x-forwarded-for']
    if (!ip_list.includes(ip_addr)) {
        console.log('*'.repeat(100));
        console.log('IP: ',ip_addr);
        console.log('Host: ', req.headers['host']);
        console.log('User agent: ', req.headers['user-agent']);
        console.log('Location: ' + req.ipInfo.country, '(' + req.ipInfo.region + ' / ' + req.ipInfo.city,')');
        console.log('Coordinates: ' + req.ipInfo.ll)
        console.log('Timezone: ' + req.ipInfo.timezone)
        console.log('*'.repeat(100));
        ip_list.push(ip_addr)

    }
     next();
    });


app.use(express.static('./public/'));

var online_users = []
// // This call back just tells us that the server has started
function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('col-draw app listening at http://' + host + ':' + port);
}



// // WebSocket Portion
// // WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', function (socket) {

    // console.log(socket)
    user = null;
    // console.log("We have a new client: " + socket.id);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse',
        function (data) {
            // Data comes in as whatever was sent, including objects
            // console.log("Received:  (" + data.x + " , " + data.y + ")    Color:"+data.col);

            // Send it to all other clients
            socket.broadcast.emit('mouse', data);
            // io.sockets.emit('mouse', data);

            // This is a way to send to everyone including sender
            // io.sockets.emit('message', "this goes to everyone");

        }
    );

    socket.on('user', (data) => {
        data.socket_id = socket.id
        user = data
        online_users.push(data)
        console.log('$New Connection$ '+data.name + ' Connected.')
        // console.log("User color : "+data.col)
        // send online users data to new connected user only
        io.to(socket.id).emit('online_users', online_users)
        socket.broadcast.emit('user', data)
    })

    socket.on('chat', (data) => {
        console.log("$Chat$ " + data.time + " (" + data.name + " -> " + data.msg + ")")
        io.sockets.emit('chat', data);
    })

    socket.on('color_change', (data) => {

        for (i = 0; i < online_users.length; i++) {
            if (data.socket_id == online_users[i].socket_id) {
                online_users[i].col = data.col
            }
        }
        io.sockets.emit('color_change', data);
    })
    socket.on('clearCanvas', (data) => {
        console.log("$Board Cleared$ " + data.name + " Cleared the Board.")
        io.sockets.emit('clearCanvas', data)
    })

    socket.on('disconnect', () => {
        // console.log("Client has disconnected", socket.id);
        // remove user from online_list
        for (i = 0; i < online_users.length; i++) {
            if (socket.id == online_users[i].socket_id) {
                // console.log(i)
                disconnected_user = online_users.splice(i, 1)
                io.sockets.emit('someone_disconnected', disconnected_user[0])
                console.log("$Disconnected$ " + disconnected_user[0].name + ' Disconnected.')

            }
        }
    });
});