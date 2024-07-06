import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LogoutButton from './Logout';
import axios from 'axios';
import './App.css';

const Main = () => {
  const [words, setWords] = useState([]);
  const [articleId, setArticleId] = useState('');

  useEffect(() => {
    if (articleId) {
      axios.get(`http://localhost:3001/words?article_id=${articleId}`)
        .then(response => {
          setWords(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the words!', error);
        });
    }
  }, [articleId]);

  const handleInputChange = (event) => {
    setArticleId(event.target.value);
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nickname = queryParams.get('nickname');
  const accessToken = queryParams.get('accessToken'); // 액세스 토큰 가져오기

  return (
    <div className="App">
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
        </div>
        <h1>Welcome, {nickname}</h1>
      <LogoutButton accessToken={accessToken} /> {/* 액세스 토큰 전달 */}
      </header>
    </div>
  );
};

export default Main;