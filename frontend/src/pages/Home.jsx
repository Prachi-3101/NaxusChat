import React from 'react'
import Login from "../components/Login.jsx";
import Signup from "../components/Signup.jsx";

function Home() {
  return (
    <div>
      <h1>Naxus Chat</h1>
      <Login />
      <hr />
      <Signup />
    </div>
  )
}

export default Home
