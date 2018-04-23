var socket;

function setup(){
  // var io = require('socket.io-client');
  createCanvas(300,300)
  background(51)
  socket=io.connect("loclahost:3000")
}

function draw(){
  
  ellipse(mouseX,mouseY,50,50)
}
