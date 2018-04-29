var socket;
var user_name;
// console.log(mycol);


function ChangeColValue() {
    user_name = document.getElementById('name').value;
    console.log(name);

}
function setup() {
    canvas = createCanvas(400, 400);
    background(0);
    canvas.id("game_overlay")
    canvas.parent("container")
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
            fill(data.col+"80");
            noStroke();
            ellipse(data.x, data.y, 10, 10);
        }
    );
}

function draw() {
    // console.log("sendmouse: " + xpos + " " + ypos + " " + mycol);
    fill(mycol + "80");
    noStroke();
    ellipse(mouseX,mouseY, 10, 10);
    // Make a little object with  x and y  and color
    var data = {
        name: user_name,
        x: mouseX,
        y: mouseY,
        col: mycol
    };

    // Send that object to the socket
    socket.emit('mouse', data);
}

