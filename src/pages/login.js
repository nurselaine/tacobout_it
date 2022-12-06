import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Layout from "../components/Layout";

export default function LoginPage(){
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    if(username){
      navigate(`/chat/${username}`);
    }
  };

  return (
    <Layout>
      // form goes here
      <h1>Are you there</h1>
      <form>
        <input
          value={username}
          type="text"
          onChange={e => setUsername(e.target.value)}
          placeholder="Your chat username"
          required
        />
        <button type="button" onClick={handleSubmit}>Join Chat!</button>
      </form>
    </Layout>
  )
}