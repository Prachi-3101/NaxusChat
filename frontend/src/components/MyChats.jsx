import React, { useEffect, useState } from 'react'

function MyChats({selectedChat,setSelectedChat}) {
  const[chats,setChats] = useState([]);

  useEffect(() => {
    fetchUser();
  },[]);

  const fetchUser = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("userInfo")
      );
      const res = await fetch(
        "http://localhost:5000/api/chat",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  }

  const getSender = (users) => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("userInfo")
    );
    return users[0]._id === loggedInUser._id ? users[1].name : users[0].name;
  }

   return (
  <div className="my-chats">
  <h2>My Chats</h2>

  {chats.map((chat) => (
    <div
      key={chat._id}
      onClick={() => setSelectedChat(chat)}
      className={`chat-item ${
        selectedChat?._id === chat._id
          ? "selected"
          : ""
      }`}
    >
      {!chat.isGroupChat
        ? getSender(chat.users)
        : chat.chatName}
    </div>
  ))}
</div>
);
}
export default MyChats
