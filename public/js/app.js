/*function showToast(msg){
  console.log('el mensaje es ', msg);
  $.toast({
    text: msg,
    position: 'top-right'
  })
}*/

function messageToServer(msg){
  window.socket.emit('message-to-server', {message: msg})
}

function initToast(player) {
  var msg = 'your are: ' + player;
  $.toast({
    text : msg,
    position : "top-right",
  })
}

window.socket = null
function connectToSocketIo(){
  let server = window.location.protocol + '//' + window.location.host
  window.socket = io.connect(server)

  window.socket.on('welcome', function(data) {
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

  window.socket.on('Player added', function(data) {
    var players = data.player_names;
    var last_player = players[players.length - 1];
    newPlayerToast(newPlayer);
    /*if(pregameScreenOn){
      updateCards(data.players);
    }*/
  });
}


$(function() {
  connectToSocketIo()
})
