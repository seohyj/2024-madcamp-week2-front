// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './styles/App.css';
import KakaoLogin from './pages/kakaologin';
import Main from './pages/Main';

function App() {
  
  return (
    <div>
      <header className='App-header'>
        <Router>
          <Routes>
            <Route path="/" element={<KakaoLogin/>} />
            <Route path="/main" element={<Main/>} />
            <Route path="/login" element={<KakaoLogin/>} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
