var socket;
var mycol;
var user_name;
var canvas
var bg
var width
var height
var par
var debug = false
var online_users_list = []
// console.log(mycol);

var size
var me={name:'alal',
col:"#ee00ee"}
var emojis = ['😈', '😌', '😜', '😀', '👻', '💀', '🐠', '😏', '🧛‍', '🦄', '🐼', '🐒', '🐢', '🐇', '🐟', '🐌', '🦇', '🐣', '🐶', '👽', '🤓', '🙊', '⚡', '🔥', '👱‍', '🤷', '🎃', '🤴', '🎅', ]
var illegal_chars = ['\\', '"', "'", '`', ';', ]
socket = io.connect('https://col-draw.herokuapp.com/');
// socket = io.connect('http://localhost:3000');
// socket = io.connect('http://192.168.0.14:3000');


function preload() {
  bg = loadImage("./../bbtex.jpg")
}

function setup() {
  par = $('#canvas-container')
  size=5
  width = par.width()
  height = 400
  canvas = createCanvas(width, height);

  canvas.id("game")
  canvas.parent("canvas-container")
  canvas.background(bg)
  mycol = document.getElementById('col').value.toString();
  user_name = document.getElementById('name').value.toString();

  var elem = $('.color-input')[0];
  var hueb = new Huebee(elem, {
    shades: 6,
    staticOpen: true,
    notation: 'hex',
    customColors: ['#C25', '#E62', '#EA0', '#19F', '#333', 'green', 'cyan', 'red', 'purple'],
    saturations: 1,
    hue0: 200,
    hues: 20
  });

  hueb.on('change', function (color) {
    // console.log(color)
    mycol = color
    me.col = mycol
    update_brush_col()

    // console.table(me)
    socket.emit('color_change', me);

    // circle.style.fill = color;
  });


}

function save_can(){
  saveCanvas(canvas, 'masterpiece', 'png');
}
// We make a named event called 'mouse' and write an
// anonymous callback function
socket.on('mouse',
  // When we receive data
  function (data) {
    // console.log("recived")
    fill(data.col);
    noStroke();
    ellipse(data.x, data.y, data.size * 2, data.size * 2);
  }
);
socket.on("chat", (data) => {
  push_chat(data)
})


function mouseDragged() {
  // Draw some white circles
  fill(mycol);
  noStroke();
  ellipse(mouseX, mouseY, size * 2, size * 2);
  // Send the mouse coordinates
  var data = {
    x: mouseX,
    y: mouseY,
    col: mycol,
    size: size,
  };

  // Send that object to the socket
  if (data.x >= 0 && data.x <= width && data.y >= 0 && data.y <= height){
    socket.emit('mouse', data);
    // console.log(data)
  }
}

function draw() {
  // background(bg);
  // Nothing
}






if (debug)
  $(`#welcome-screen`).hide();

function remove_illegal_char(text) {

  for (e of illegal_chars) {
    while (text.includes(e))
      text = text.replace(e, '_')
  }
  return text
}

function submit() {
  mycol = $('#col').val();
  user_name = $(`#name`).val()

  user_name = remove_illegal_char(user_name)
  user_name = user_name.replace(/ /g, '_')
  e = Math.floor(Math.random(0) * (emojis.length))
  var user = {
    name: user_name,
    col: mycol,
    emoji: e,
  }
  update_brush_col()

  // console.log(mycol);
  if ($(`#name`).val() != '') {
    socket.emit('user', user)
    $(`#welcome-screen`).slideUp();
    $('#blackboard-chat-container').show()

  } else {
    alert(`Name is required`)
  }

}


// chatting

var temp_my = $('li#my-message').remove()
var temp_other = $('li#other-message').remove()




var chatHistory = $('.chat-history');
var chat = $(".chat-history ul")


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

  $('.chat-history').animate({
    scrollTop: $('.chat-history').get(0).scrollHeight
  }, 100);
}

var x = {
  name: "BOT🤖",
  time: new Date().toLocaleString('en-US', {
    hour: 'numeric',
    minute: "numeric",
    hour12: true
  }),
  msg: "Start chatting"
}

push_chat(x)

function sendmsg() {
  var text = $('#message-to-send').val()
  text = remove_illegal_char(text)
  if (text == '')
    return 0
  var d = new Date()
  var time = d.toLocaleString('en-US', {
    hour: 'numeric',
    minute: "numeric",
    hour12: true
  })
  var msg = {
    name: user_name,
    msg: text,
    time: time
  }
  $('#message-to-send').val("")
  socket.emit("chat", msg)
}


var online_ul = $(".online-users ul")
var online_template = "<li><h2 id='{{name}}' style='color: {{color}}; '>{{emoji}}{{name}}</h2></li>"

function add_online(obj) {
  // console.log(e)
  temp = online_template
  temp = temp.replace('{{color}}', obj.col).replace(/{{name}}/g, obj.name).replace('{{emoji}}', emojis[obj.emoji])
  online_ul.append(temp)
}

for (e of online_users_list) {
  add_online(e)
}

function clearCanvas() {
  let x = {
    name: user_name
  }
  socket.emit('clearCanvas', x)
}

socket.on('clearCanvas', (data) => {
  canvas.clear();
  // showalert("Board cleared by "+ data.name,"danger")
  notification("Board cleared by " + data.name)
})

socket.on('user', (data) => {
  notification(data.name + "  Joined the lobby!")
  online_users_list.push(data)
  add_online(data)
  // console.table(online_users_list)

})

socket.on('color_change', (data) => {
  notification(data.name + "  Changed color")
  for (i = 0; i < online_users_list.length; i++) {
    if (data.socket_id == online_users_list[i].socket_id) {
      online_users_list[i].col = data.col
    }
  }
  // console.table(online_users_list)
  update_online_users()
})

function update_online_users() {
  for (e of online_users_list) {
    id = '#' + e.name
    $(id).css('color', e.col)
    
  }
}

function remove_online(data) {
  id = '#' + data.name
  $(id).remove()
}

function showalert(message, alerttype) {
  let temp = `<div class="alert alert-` + alerttype + ` alert-dismissible" id="myAlert">
    <a href="#" data-dismiss="alert" class="close">&times;</a>
     ` + message + `
    </div>`
  if ($("#alert-placeholder")[0].childElementCount > 1)
    $("#alert-placeholder")[0].lastChild.remove()
  $('#alert-placeholder').prepend('<div id="alertdiv" class="alert alert-' + alerttype + '"><a class="close" data-dismiss="alert">×</a><span>' + message + '</span></div>')
}


function notification(message) {
  // Get the snackbar DIV
  let x = document.getElementById("snackbar");
  x.innerHTML = message
  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}

$('input#message-to-send[type=text]').on('keydown', function (e) {
  if (e.which == 13) {
    sendmsg()
  }
});


socket.on('online_users', (online_users) => {
  online_users_list = online_users
  for (i = 0; i < online_users_list.length; i++) {
    if (online_users_list[i].name == user_name) {
      me = online_users_list[i]
    }
  }

  for (e of online_users_list) {
    add_online(e)
  }
  //  console.table(online_users_list)
})

var du
socket.on('someone_disconnected', (d_user) => {
  du = d_user
  // console.table(d_user)
  for (i = 0; i < online_users_list.length; i++) {
    if (online_users_list[i].socket_id == du.socket_id) {
      online_users_list.splice(i, 1);
    }
  }
  // console.table(online_users_list)
  notification(d_user.name + ' Disconnected')
  remove_online(d_user)
})


$('.size-picker i').click(function () {
  var id = $(this).attr('id');
  $('.size-picker i').removeClass("zoom")
  $("#"+id).addClass('zoom')
  $("#"+id).addClass('bg-sel')
  var s=int(id.slice(1,id.length))
  size=s/2
  update_brush_col()
  console.log(id,s)
});

function update_brush_col() {
  id="#s"+size*2
  $('.size-picker i').css('color', mycol + '80')
  $('.size-picker i' + id).css('color', mycol)

}