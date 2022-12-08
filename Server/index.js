// dependencies
const { v4: uuidv4 } = require('uuid');
const webSocketServer = require('websocket').server;
const http = require('http');

const webSocketServerPort = 8000;

// create simple HTTP server
const server = http.createServer();

// connected http server with websocket server
server.listen(webSocketServerPort);
console.log(`listening on PORT ${webSocketServerPort}`);

// create instance of websocket server that listen on port 8000
const wsServer = new webSocketServer({ httpServer: server});

// Accept the handshake on recieving request from client
const clients = {}; // hold all clients as object, user id will be added upon recieving reqeust

wsServer.on('request', request => {
  // create unqiue user ID for every user on the server
  const userID = uuidv4();
  console.log((new Date()) + `Recieved a new connection from origin ${request.origin}.`);

  // accept incoming client request and create a new connetion
  const connection = request.accept(null, request.origin);
  // store connection in clients obj and use userId as the key
  clients[userID] = connection;
  console.log(`connection ${userID} in ${Object.getOwnPropertyNames(clients)}`);

  // Now request is accepted in the server & handshake is fulfilled - status code 101 should show in browser

  // Create an onmessage handler, all messages recieved by server will trigger this handler
  connection.on('message', (message) => {
    // all messages will be in format of utf8
    if(message.type === 'utf8'){
      console.log(`Recieved message: ${message.utf8Data}`);

      // loop over all the clients in the clients obj and forward message that was just recieved
      for(key in clients){
        clients[key].sendUTF(message.utf8Data);
        // console.log(`send message to: ${clients[key]}`);
      }
    }
  })
})
