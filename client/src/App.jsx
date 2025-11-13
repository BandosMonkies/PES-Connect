import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { getAuth } from './utils/auth';
import './App.css';

function App() {
  const { token } = getAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/login'
          element={!token ? <Login /> : <Navigate to='/chat' />}
        />
        <Route
          path='/register'
          element={!token ? <Register /> : <Navigate to='/chat' />}
        />
        <Route
          path='/chat'
          element={token ? <Chat /> : <Navigate to='/login' />}
        />
      </Routes>
    </>
  );
}

export default App;