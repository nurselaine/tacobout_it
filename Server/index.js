const WebSocket = require('ws');

const server = new WebSocket.Server({
  port: 8080
},
  () => {
    console.log('Server started on port 8080');
  }
);

const users = new Set();

function sendMessage (message){
  users.forEach((user) => {
    user.ws.send(JSON.stringify(message));
  });
}

server.on('connection', (ws) => {
  console.log('joining socket connection');
  const user = { ws };
  users.add(user);

  ws.on('message', (message) => {
    console.log(message);
    try{
      const data = JSON.parse(message);
      if(typeof data.sender !== 'string' || typeof data.body !== 'string'){
        console.error('Invalid message');
        return;
      }

      const messageToSend = {
        sender: data.sender,
        body: data.body,
        sentAt: Date.now(),
      }

      sendMessage(messageToSend);
    } catch (e) {
      console.error('Error passing message!', e);
    }
  });

  ws.on('close', (code, reason) => {
    users.delete(user);
    console.log(`connection closed: ${code} ${reason}`);
  })
})