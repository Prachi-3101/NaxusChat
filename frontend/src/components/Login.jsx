import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");

    const navigate = useNavigate();

    const submitHandle = async() => {
        try {
            const res = await fetch("http://localhost:5000/api/user/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );
            const data = await res.json();

            localStorage.setItem(
                "userInfo",
                JSON.stringify(data)
            );
            navigate("/chats");
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div>
      <h2>Login</h2>

      <input 
      type='email'
      placeholder='Email'
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input 
      type='password'
      placeholder='Password'
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={submitHandle}>Login</button>
    </div>
  )
}

export default Login
