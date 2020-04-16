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

function sendLetter(letter){
  var letter = letter;
  $("#letter").text(letter);
  $("#startButton").hide();
  $("#gameForm").show();
  $("#bastaButton").show();
}

function playGame(){
  $("input[type='text']").prop("disabled", false);
  $("input[type='text']").removeClass('is-valid is-invalid')
  $("input[type='text']").val('')
  $("#bastaButton").show();
  $("#playAgainButton").hide();
  window.socket.emit("play");
}

function bastaGame(){
  window.socket.emit("finish")
}

function gradingAnswers(){
  $("input[type='text']").prop("disabled", true);

  if($("#name").val() !== ""){
    $("#name").addClass("is-valid");
  } else { $("#name").addClass("is-invalid"); }
  if($("#color").val() !== ""){
    $("#color").addClass("is-valid");
  } else { $("#color").addClass("is-invalid"); }
  if($("#animal").val() !== ""){
    $("#animal").addClass("is-valid");
  } else { $("#animal").addClass("is-invalid"); }
  if($("#flowerFruit").val() !== ""){
    $("#flowerFruit").addClass("is-valid");
  } else { $("#flowerFruit").addClass("is-invalid"); }

}

window.socket = null
function connectToSocketIo(){
  let server = window.location.protocol + '//' + window.location.host
  window.socket = io.connect(server)

  window.socket.on('init', function(data) {
    player = data.player;
    initToast(player);
  });

  window.socket.on('player added', function(data) {
    var players = data.player_names;
    var last_player = players[players.length - 1];
    playerAddedToast(last_player);
  });

  window.socket.on('play', function (data) {
    sendLetter(data.letter);
  })

  window.socket.on('gradeAnswers', function (data) {
    gradingAnswers();
    $("#bastaButton").hide();
    $("#playAgainButton").show();
  })
}


$(function() {
  connectToSocketIo()
})
