import './App.css';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useEffect, useState } from 'react';
import { Card, Avatar, Input, Typography } from 'antd';
// import 'antd/dist/antd.css';

const { Search } = Input;
const { Text} = Typography;
const { Meta } = Card;

const client = new W3CWebSocket('ws://localhost:8000');

function App() {

  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // when sending inital handshake, the client sends "Sec-WebSocket-Key in the headers and server encodes/hashes the value and adds a GUID and sends it back in the handshake" | Status code 101 = handshake is fulfilled and server/client is synced
    // sec-websocket-accpet = whether server is accepting the client connection ==> if response does not have upgrade header field or update != websocket = websocket connection failed
    client.onopen = () => {
      console.log(`Websocket client connected!`);
    };
  }, []);

  const handleClick = (message) => {
    client.send(JSON.stringify({
      type: 'message',
      msg: message,
      user: username,
    }));


    // connection is made, now messages can be sent and transmitted between client/server
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      // console.log(dataFromServer);

      if (dataFromServer.type === 'message') {
        setMessages([...messages, { msg: dataFromServer.msg, user: dataFromServer.user }]);
      }
    };
    setMessage('');
  }
  console.log(messages);
  return (
    <div>
      {
        isLoggedIn ?
          <>
            <div>
              {
                messages.map((msg, i) => (
                  <Card>
                    <Meta 
                      avatar={
                        <Avatar>{msg.user[0].toUpperCase()}</Avatar>
                      }
                      title={msg.user}
                      description={msg.msg}
                    />
                  </Card>
                  // <p key={`message-${i}`}>message: {msg.msg}, user: {msg.user}</p>
                ))
              }
            </div>
            <Search
            placeholder='type message'
            enterButton='send'
            onSearch={value => { handleClick(value)}}
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{ position: 'fixed', width: '100%', left: 0, bottom: 0}}
          />
          </>
          :
          <Search
            placeholder='Enter Username'
            enterButton='Join Chat'
            onSearch={value => { setUsername(value); setIsLoggedIn(true) }}
          />
      }
    </div>
  );
}

export default App;
