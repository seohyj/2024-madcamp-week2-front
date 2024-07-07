import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {backend_ip} from './constants.js';
import LogoutButton from '../pages/Logout';
import axios from 'axios';
import '../styles/App.css';
import '../pages/recommend_article.js';

const Main = () => {
  const [userId, setUserId] = useState(''); // user_id
  const [articleId, setArticleId] = useState(''); //word
  const [words, setWords] = useState([]);
  const [articleNum, setArticleNum] = useState(''); //article
  const [articleDetails, setArticleDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (articleId) {
      axios.get(`http://${backend_ip}:3001/words?article_id=${articleId}`)
        .then(response => {
          setWords(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the words!', error);
        });
    }
  }, [articleId]);

  useEffect(() => {
    if (articleNum) {
      axios.get(`http://${backend_ip}:3001/article?id=${articleNum}`)
        .then(response => {
          setArticleDetails(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching article!', error);
        });
    }
  }, [articleNum]);

  // 입력 필드가 변경될 때 호출되는 함수
  const handleInputChange = (event) => {
    setArticleId(event.target.value);
    // 입력된 값을 articleId 상태에 저장
  };

  // 기사 번호 입력 필드가 변경될 때 호출되는 함수
  const handleArticleNumChange = (event) => {
    setArticleNum(event.target.value);
    // 입력된 값을 articleNum 상태에 저장
  };

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
    // 입력된 값을 User_id 상태에 저장
  };
  const handleLogout = () => {
    const logoutRedirectUri = `http://${backend_ip}:3001/logout/callback`; // 서버의 로그아웃 콜백 URI
    const logoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=17132d31284a95180bea1e6df5b24fb9&logout_redirect_uri=${logoutRedirectUri}`;
    localStorage.removeItem('kakaoId');
    // 카카오 로그아웃 URL로 리디렉션
    window.location.href = logoutUrl;
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
          type="string" 
          value={nickname} 
          onChange={handleUserIdChange} 
          placeholder="Enter user nickname"
        />
        <input 
          type="number" 
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

        <input
          type="number"
          value={articleNum}
          onChange={handleArticleNumChange}
          placeholder='Enter article number'
        />
        {articleDetails && (
          <div className="article-details">
            <h2>{articleDetails.title}</h2>
            <p>{articleDetails.contents}</p>
            <p><strong>From:</strong> {articleDetails.from}</p>
            <p><strong>Author:</strong> {articleDetails.author}</p>
            <p><strong>Date:</strong> {articleDetails.date}</p>
            <a href={articleDetails.url} target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
        )}

        <h1>Welcome, {nickname}</h1>
        <button onClick={handleLogout}>카카오 로그아웃</button>
        <Link to={`/recommended-article?kakao_id=${localStorage.getItem('kakaoId')}`}>
          <button>Article Recommendation</button>
        </Link>
      </header>
    </div>
  );
};

export default Main;