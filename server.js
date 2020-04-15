// Imports
const express = require('express');
const webRoutes = require('./routes/web');

// Session imports
let cookieParser = require('cookie-parser');
let session = require('express-session');
let flash = require('express-flash');
let passport = require('passport');

// Express app creation
const app = express();

//Socket.io
const server = require('http').Server(app)
const io = require('socket.io')(server)

// Configurations
const appConfig = require('./configs/app');

// View engine configs
const exphbs = require('express-handlebars');
const hbshelpers = require("handlebars-helpers");
const multihelpers = hbshelpers();
const extNameHbs = 'hbs';
const hbs = exphbs.create({
  extname: extNameHbs,
  helpers: multihelpers
});
app.engine(extNameHbs, hbs.engine);
app.set('view engine', extNameHbs);

// Session configurations
let sessionStore = new session.MemoryStore;
app.use(cookieParser());
app.use(session({
  cookie: { maxAge: 60000 },
  store: sessionStore,
  saveUninitialized: true,
  resave: 'true',
  secret: appConfig.secret
}));
app.use(flash());

// Configuraciones de passport
require('./configs/passport');
app.use(passport.initialize());
app.use(passport.session());

// Receive parameters from the Form requests
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/', express.static(__dirname + '/public'))
app.use('/', webRoutes);

const axios = require('axios');

player_names = []
sockets_connected = []

io.on('connection', (socket) => {
  //console.log('client connected');
  axios.get("http://names.drycodes.com/1?nameOptions=starwarsFirstNames")
  .then((response) => {
    console.log("axios response: ", response.data);
    var player = response.data[0];
      player_names.push(player);
      sockets_connected.push(socket);
      socket.emit('welcome', {player : player, player_names : player_names});
      socket.broadcast.emit('Player added: ', {player_names : player_names});
    });

  /*socket.on('message-to-server', (data) =>{
    console.log('message received', data);
  })*/
})






/*io.on('connection', (socket) => {
    .then((response) => {
      var newPlayer = response.data[0];
      players.push(newPlayer);
      sockets.push(socket);
      socket.emit('welcome', {name : newPlayer, players : players, gameRunning : gameRunning, letter : letter});
      socket.broadcast.emit('newPlayer', {players : players});
    });
    let i = 0;
  socket.on('startGame', () => {
    letter = alphabet[Math.floor((Math.random() * 26))];
    gameRunning = true;
    socket.emit('startGame', {letter : letter});
    socket.broadcast.emit('startGame', {letter : letter});
  });
  socket.on('stopGame', () => {
    gameRunning = false;
    socket.emit('stopGame');
    socket.broadcast.emit('stopGame');
  })
  socket.on('disconnect', () => {
    var i = sockets.indexOf(socket);
    var disconnectedPlayer = players[i];
    players.splice(i,1);
    sockets.splice(i, 1);
    socket.broadcast.emit('playerDisconnect', {name : disconnectedPlayer, players : players});
  });
})*/

// App init
server.listen(appConfig.expressPort, () => {
  console.log(`Server is listenning on ${appConfig.expressPort}! (http://localhost:${appConfig.expressPort})`);
});
