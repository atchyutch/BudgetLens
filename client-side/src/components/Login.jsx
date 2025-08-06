import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sendLogin from '../api_helper/loginAxios.js';  
import axios from 'axios';
import Header from './Header.jsx';

function Login() {
    const navigator = useNavigate();

    const [username, setUsername] = React.useState('');  
    const [password, setPassword] = React.useState('');

    const UsernameChange = (e) => {
        setUsername(e.target.value);
    }
    const Passwordchange = (e) => {
        setPassword(e.target.value);
    }

    async function handleSubmit(event){
        event.preventDefault();
        const userData = {username, password};
        const {token, user} = await sendLogin(userData) 
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));  // am i storing the user name or id?  // yes i am storing the user id.
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;

        console.log("Token:", token);
        console.log("User:", user);

        if (!token) {
            alert("Invalid credentials. Please try again.");
            return;
        }
        const url_api = "http://localhost:5500/plaid/get/accounts";
        try{
            const res = await axios.get(url_api, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},withCredentials: true}); 
            console.log("→ go to /dashboard");
            navigator("/dashboard"); 
            }catch (err){
              if (err.response?.status === 404) {
                console.log("→ go to /userhome (no accounts yet)");
                navigator("/userhome");
              } else if (err.response?.status === 401) {
                alert("Session expired — please log in again.");
                navigator("/login");
              } else {
                console.error("Unexpected error fetching accounts:", err);
              }
            }

    }

    return (
      <div><Header />
        <main className="grid place-items-center h-180 w-350">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-sm rounded-lg shadow-md p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              LogIn to your BudgetLens Account 
            </h2>
      

            <input
              type="username"
              placeholder="Username"
              value={username}
              onChange={UsernameChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
      
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={Passwordchange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
      
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-medium py-2 rounded-md 
                         hover:bg-blue-600 transition-colors"
            >
              Submit
            </button>
          </form>
        </main>
        </div>
      );
      
}

export default Login;