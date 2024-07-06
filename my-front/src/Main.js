import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import LogoutButton from './Logout';
import axios from 'axios';
import './App.css';

const Main = () => {
  const [words, setWords] = useState([]);
  const [articleId, setArticleId] = useState('');
  const [nickname, setNickname] = useState('');

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
    axios.get(`http://localhost:3001/nickname?kakao_id=${localStorage.getItem('kakaoId')}`)
        .then(response => {
          //console.log(response.data.nickname);
          setNickname(response.data.nickname);
        })
        .catch(error => {
          console.error('There was an error fetching the words!', error);
        });
  }, [articleId]);

  const handleInputChange = (event) => {
    setArticleId(event.target.value);
  };

  //여기서 부터 login, logout 관련 code

  const navigate = useNavigate();


  const handleLogout = () => {
    const logoutRedirectUri = 'http://localhost:3001/logout/callback'; // 서버의 로그아웃 콜백 URI
    const logoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=17132d31284a95180bea1e6df5b24fb9&logout_redirect_uri=${logoutRedirectUri}`;
    localStorage.removeItem('kakaoId');
    // 카카오 로그아웃 URL로 리디렉션
    window.location.href = logoutUrl;
  };

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
        <button onClick={handleLogout}>카카오 로그아웃</button>
      </header>
    </div>
  );
};

export default Main;