import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Chat() {
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem("userInfo")
        );
        if(!user){
            navigate("/");
        }
    },[]);
  return (
    <div>
      <h1>Welcome to Nexus Chat</h1>
    </div>
  )
}

export default Chat;
