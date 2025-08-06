import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sendUser from "../api_helper/signupAxios.js"
import Header from './Header.jsx';

function Signup() {
    const navigator = useNavigate();
    const [firstname, setFirstName] = React.useState('');
    const [lastname, setLastName] = React.useState('');
    const [username, setUsername] = React.useState('');  
    const [password, setPassword] = React.useState('');
    const [email, setEmailChange] = useState('');

    const FirstNamechange = (e) => {
        setFirstName(e.target.value);
    }
    const LastNamechange = (e) => {
        setLastName(e.target.value);
    }
    const UsernameChange = (e) => {
        setUsername(e.target.value);
    }
    const Passwordchange = (e) => {
        setPassword(e.target.value);
    }

    const EmailChange = (e) => {
        setEmailChange(e.target.value);
    }

    function handleSubmit(event){
        event.preventDefault(); // Prevent the default form submission behavior
        const userData = {email, firstname, lastname, username, password};
        sendUser(userData)
        .then(() => {
            navigator('/login');
        })
        .catch((error) => {
            console.error('Error in registering User:', error);
            alert('Registration failed. Please try again.');
            return;
        });
            
    }

    return (
      <div>
      <Header />
        <main className="grid place-items-center h-180 w-350">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-sm rounded-lg shadow-md p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              Register here with your details
            </h2>
      
            <input
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={FirstNamechange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
      
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={LastNamechange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
      
            <input
              type="username"
              placeholder="Username"
              value={username}
              onChange={UsernameChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

<input
              type="email"
              placeholder="Email"
              value={email}
              onChange={EmailChange}
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
              Create
            </button>
          </form>
        </main>
        </div>
      );
      
}

export default Signup;