var socket;
var mycol;
var user_name;
// console.log(mycol);


function ChangeValue() {
  mycol = document.getElementById('col').value;
  user_name = document.getElementById('name').value;
  // console.log(mycol);

}
function setup() {
  canvas = createCanvas(400, 400);
  background(0);
  canvas.id("game")
  canvas.parent("container")
  mycol = document.getElementById('col').value.toString();
  user_name = document.getElementById('name').value.toString();
  // console.log(mycol);


  // socket = io.connect('https://col-draw.herokuapp.com/'); 
  socket = io.connect('http://localhost:3000');
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('mouse',
    // When we receive data
    function (data) {
      console.log("Got: " + data.x + " " + data.y);
      // Draw a blue circle
      fill(data.col);
      noStroke();
      ellipse(data.x, data.y, 20, 20);
    }
  );
  // socket.on('mouse_live',
  //   // When we receive data
  //   function (data) {
  //     // console.log("Got: " + data.x + " " + data.y);
  //     // Draw a blue circle
  //     fill(data.col+"80");
  //     noStroke();
  //     text(data.name, data.x, data.y)
  //   }
  // );
}

function draw() {
  // Nothing
}

function mouseDragged() {
  // Draw some white circles
  fill(mycol);
  noStroke();
  ellipse(mouseX, mouseY, 20, 20);
  // Send the mouse coordinates
  var data = {
    x: mouseX,
    y: mouseY,
    col: mycol
  };
  // Send that object to the socket
  socket.emit('mouse', data);
  // sendmouse(user_name, mouseX, mouseY, mycol);
}

// function mouseMoved() {
//   var data = {
//     name: user_name,
//     x: mouseX,
//     y: mouseY,
//     col: mycol+"80"
//   };

//   // Send that object to the socket
//   socket.emit('mouse_live', data);
// }

// // Function for sending to the socket
// function sendmouse(xpos, ypos, mycol) {
//   // We are sending!
//   console.log("sendmouse: " + xpos + " " + ypos + " " + mycol);

//   // Make a little object with  x and y  and color
 
// }