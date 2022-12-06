import React, { useEffect, useRef, useState } from "react";
import layout from "../components/Layout";
import { useParams } from 'react-router-dom';
import Layout from "../components/Layout";

export default function ChatPage(){
  const [messages, setMessages] = useState([]);
  const [isConnectionOpen, setConnectionOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const { username } = useParams();
  const ws = useRef();

  const sendMessage = () => {
    if(message){
      ws.current.send(
        JSON.stringify({
          sender: username,
          body: message,
        })
      );
      setMessage('');
    }
  };

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("Connection open");
      setConnectionOpen(true);
    }

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      setMessages((_messages) => [...messages, data]);
    }

    return () => {
      console.log('closing socket');
      ws.current.close();
    }
  }, []);

  const scrollTarget = useRef(null);

  useEffect(() => {
    if(scrollTarget.current){
      scrollTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);
console.log(messages);
  return (
    <Layout>
      <div>
        {
          messages.map((message, i) => (
            <>
              <div>{message.sender}</div>
              {/* <div>{new Date(message.sentAt)}</div> */}
              <div>{message.body}</div>
            </>
          ))
        }
      </div>
      <footer>
        <input 
          placeholder="message goes here..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>send</button>
      </footer>
    </Layout>
  )

}