import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

function Homepage(){

    const navigator = useNavigate();

   function handleSignup(){
        navigator('/signup');
    }

    function handleLogin(){ 
        navigator('/login');
    }

    return(
        <div>
        <Header></Header>
    <div className="grid place-items-center h-180 w-350">
        <div className= "text-white rounded-lg p-6 w-70%">
            <h1 className="bg-black text-2xl font-bold mb-2">   Welcome, Budget Lens Here!  </h1>
            <p className="bg-black text-2xl font-bold mb-2" >Spend better and live better.</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2'>
            <button className="text-emerald-800 px-4 py-2 text-sm 
            font-medium mt-8 bg-black rounded-md" onClick={handleSignup}> Sign up!</button>
            <button className="text-emerald-800 px-4 py-2 text-sm 
            font-medium mt-8 bg-black rounded-md" onClick={handleLogin}> LogIn!</button>
            </div>
        </div>
    </div>
    </div>
);
}


export default Homepage;