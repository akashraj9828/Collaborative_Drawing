var socket;
var mycol;
var user_name;
var bg
var par
var debug=false
// console.log(mycol);


socket = io.connect('https://col-draw.herokuapp.com/');
// socket = io.connect('http://localhost:3000');


function preload() {
  bg = loadImage("bg.jpg")
}

function setup() {
  // par = document.getElementById('canvas-container')
  par=$('#canvas-container')
  canvas = createCanvas(par.width(), 400);
  // canvas = createCanvas(400, 400);
  // background(bg);  
  // background('green');
  canvas.id("game")
  canvas.parent("canvas-container")
  mycol = document.getElementById('col').value.toString();
  user_name = document.getElementById('name').value.toString();
  // console.log(mycol);


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
  socket.on("chat",(data)=>{
    push_chat(data)
  })
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
  // background(bg);
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


if(debug)
$(`#welcome-screen`).hide();
else
$('#blackboard-chat-container').hide()

function submit() {
  mycol = $('#col').val();
  user_name = $(`#name`).val()
  var user = {
    name: user_name,
    col: mycol
  }
  
  // console.log(mycol);
  if ($(`#name`).val() != '') {
    socket.emit('user', user)
    $(`#welcome-screen`).slideUp();
    $('#blackboard-chat-container').show()

  } else {
    alert(`Name is required`)
  }

}




// var temp_my = $('#other-message').clone(true)
// var temp_my = $('li#other-message').clone()
var temp_my = $('li#my-message').remove()
// var temp_other = $('#my-message').clone(true)
var temp_other = $('li#other-message').remove()



// $('#other-message').hide()
// $('#my-message').hide()

var chatHistory = $('.chat-history');
var chat = $(".chat-history ul")
// var temp

var x = {
  name: "BOT🤖",
  time: "9:00am",
  msg: "Start chatting"
}

function push_chat(obj) {
  if (obj.name == user_name)
    temp = temp_my.clone()
  else
    temp = temp_other.clone()
  temp.find('.message-data-name').text(obj.name)
  temp.find('.message-data-time').text(obj.time)
  temp.find('.message').text(obj.msg)
  u = temp_other.attr('id');
  chat.append(temp)
}

push_chat(x)

function sendmsg() {
  var text = $('#message-to-send').val()
  var d = new Date()
  var time = d.toLocaleString('en-US', { hour: 'numeric', minute: "numeric", hour12: true })
  var msg = {
    name: user_name,
    msg: text,
    time: time
  }
  $('#message-to-send').val("")
  // push_chat(msg)
  socket.emit("chat",msg)
}
