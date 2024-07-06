// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import KakaoLogin from './kakaologin';
import Main from './Main';

function App() {
  

  return (
    /*<div className="App">
      <header className="App-header">
        <h1>Wordbook</h1>
        <input 
          type="integer" 
          value={articleId} 
          onChange={handleInputChange} 
          placeholder="Enter article ID"
        />
        <div className="word-list">
          {words.map((word, index) => (
            <div key={index} className="word-item">
              <strong>{word.word}</strong>: {word.korean_word}
            </div>
          ))}
        </div>*/
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
        
      //</header>
    //</div>
  );
}

export default App;
