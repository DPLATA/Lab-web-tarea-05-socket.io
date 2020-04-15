/*function showToast(msg){
  console.log('el mensaje es ', msg);
  $.toast({
    text: msg,
    position: 'top-right'
  })
}

function messageToServer(msg){
  window.socket.emit('message-to-server', {message: msg})
}*/

function initToast(player) {
  var msg = 'your are: ' + player;
  $.toast({
    text : msg,
    position : "bottom-right",
    icon: 'success',
    hideAfter: false
  })
}

function playerAddedToast(player) {
  var msg = player + " now playing";
  $.toast({
    text : msg,
    position : "bottom-right",
    icon: 'info'
  })
}

function playGame(){
  window.socket.emit("play");
}

window.socket = null
function connectToSocketIo(){
  let server = window.location.protocol + '//' + window.location.host
  window.socket = io.connect(server)

  window.socket.on('init', function(data) {
    player = data.player;
    //$("#user").text(player);
    initToast(player);
    /*if(data.gameRunning){
      prepareGame(data.letter);
      pregameScreenOn = false;
    } else {
      updateCards(data.players);
      pregameScreenOn = true;
    }*/
  });

  window.socket.on('player added', function(data) {
    var players = data.player_names;
    var last_player = players[players.length - 1];
    playerAddedToast(last_player);
    /*if(pregameScreenOn){
      updateCards(data.players);
    }*/
  });

  window.socket.on('play', function (data) {
    console.log('play');
    //prepareGame(data.letter);
  })
}


$(function() {
  connectToSocketIo()
})
