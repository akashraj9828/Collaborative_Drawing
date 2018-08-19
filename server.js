// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html


var counter=0;
// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('col-draw app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {
            // counter++;
            // socket.id=counter;
        // console.log("We have a new client: " + counter);
        console.log("We have a new client: " + socket.id);

        // When this user emits, client side: socket.emit('otherevent',some data);
        socket.on('mouse',
            function (data) {
                // Data comes in as whatever was sent, including objects
                console.log("Received:  (" + data.x + " , " + data.y + ")    Color:"+data.col);

                // Send it to all other clients
                socket.broadcast.emit('mouse', data);
                // io.sockets.emit('mouse', data);

                // This is a way to send to everyone including sender
                // io.sockets.emit('message', "this goes to everyone");

            }
        );

        socket.on('user',(data)=>{
            console.log("User logged in : "+data.name)
            console.log("User color : "+data.col)
        })
        // socket.on('mouse_live',
        //     function (data) {
        //         // Data comes in as whatever was sent, including objects
        //         // console.log("Received:  (" + data.x + " , " + data.y + ")    Color:"+data.col);

        //         // Send it to all other clients
        //         socket.broadcast.emit('mouse_live', data);
        //         // io.sockets.emit('mouse', data);

        //         // This is a way to send to everyone including sender
        //         // io.sockets.emit('message', "this goes to everyone");

        //     }
        // );

        socket.on('disconnect', function (socket) {
            console.log("Client has disconnected");
        });
    }
);