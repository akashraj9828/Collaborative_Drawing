var socket;
var user_name;
// console.log(mycol);

var s = function (sketch) {


    sketch.setup = function () {
        pare = document.getElementById('container')
        // canvas = createCanvas(400, 400);
        sketch.canvas = createCanvas(pare.offsetWidth - 30, 400);
        // background(0);
        sketch.canvas.id("game_overlay")
        sketch.canvas.parent("container")
        user_name = document.getElementById('name').value.toString();
        console.log(user_name);

        // Start a socket connection to the server
        // Some day we would run this server somewhere else
        // socket = io.connect('https://col-draw.herokuapp.com/'); 
        socket = io.connect('http://localhost:3000');
        // We make a named event called 'mouse' and write an
        // anonymous callback function
        socket.on('mouse_live',
            // When we receive data
            function (data) {
                // console.log("Got live mouse: " + data.x + " " + data.y);
                // Draw a blue circle
                sketch.fill(data.col + "80");
                sketch.noStroke();
                sketch.ellipse(data.x, data.y, 10, 10);
            }
        );
    };

    sketch.draw = function () {
        sketch.clear()
        // console.log("sendmouse: " + xpos + " " + ypos + " " + mycol);
        sketch.fill(mycol + "80");
        sketch.noStroke();
        sketch.ellipse(mouseX, mouseY, 10, 10);
        // Make a little object with  x and y  and color
        var data = {
            name: user_name,
            x: mouseX,
            y: mouseY,
            col: mycol
        };

        // Send that object to the socket
        socket.emit('mouse', data);
    };
};
var myp5 = new p5(s);
function ChangeColValue() {
    user_name = document.getElementById('name').value;
    console.log(name);
}