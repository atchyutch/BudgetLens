import React from 'react';
import Homepage from './components/Homepage';
import Signup from './components/Signup';
import Login from './components/Login';
import UserHomepage from './components/UserHomepage';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Routes,Route} from 'react-router-dom'

function App() {

  return (<>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path ="/login" element = {<Login />}/>
      <Route path="/userhome" element = {<UserHomepage />}/>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
  </>
  );

}

export default App