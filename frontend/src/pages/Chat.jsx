import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket;

function Chat() {
    const navigate = useNavigate();
    const[selectedChat,setSelectedChat] = useState(null);

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if(!user){
        navigate("/");
        return;
      }
      socket = io(ENDPOINT);
      socket.emit("setup",user);
      socket.on("connected",() => {
        console.log("Socket Connected");
      });
    },[]);
    
  return (
    <div className="chat-container">
  <MyChats
    selectedChat={selectedChat}
    setSelectedChat={setSelectedChat}
  />

  <ChatBox
    selectedChat={selectedChat}
    socket={socket}
  />
</div>
  )
}

export default Chat;
