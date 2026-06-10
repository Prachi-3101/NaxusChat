import React, { useEffect, useState } from "react";

function ChatBox({ selectedChat,socket }) {
  const [messages, setMessages] = useState([]);
  const [newMessage,setNewMessage] = useState("");

  useEffect(() => {
    if (!socket) return;

    socket.on(
        "message received",
        (newMessage) => {
            setMessages((prev) => [
                ...prev,
                newMessage,
            ]);
        }
    );

    return () => {
        socket.off("message received");
    };
}, [socket]);

  const fetchMessages = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const response = await fetch(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();

      console.log(data);

      setMessages(data);

    } catch (error) {
      console.log(error);
    }
  };

  if (!selectedChat) {
    return (
      <div
        style={{
          width: "70%",
          border: "1px solid white",
          padding: "20px",
        }}
      >
        <h2>Select a chat</h2>
      </div>
    );
  }

  const sendMessage = async () => {
  if (!newMessage.trim()) return;

  try {
    const user = JSON.parse(
      localStorage.getItem("userInfo")
    );

    const response = await fetch(
      "http://localhost:5000/api/message",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          content: newMessage,
          chatId: selectedChat._id,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    setMessages((prev) => [...prev,data]);
    socket.emit("new message",data);
    setNewMessage("");

  } catch (error) {
    console.log(error);
  }
};

  return (
  <div
    style={{
      width: "70%",
      border: "1px solid white",
      padding: "20px",
    }}
  >
    <h2>Conversation</h2>

    {messages.length === 0 ? (
      <p>No messages yet</p>
    ) : (
      messages.map((message) => (
        <div
          key={message._id}
          style={{
            display: "flex",
            justifyContent: message.sender._id === JSON.parse(localStorage.getItem("userInfo"))._id ? "flex-end" : "flex-start",
           marginBottom: "10px",
          }}
        >
          <div 
           style={{
            border: "1px solid gray",
            padding: "10px",
            borderRadius: "10px",
            maxWidth: "60%",
           }}
          >
          {message.content}
        </div>
        </div>
      ))
    )}

    <div style={{ marginTop: "20px" }}>
      <input
        type="text"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />

      <button onClick={sendMessage}>
        Send
      </button>
    </div>

  </div>
);
}

export default ChatBox;