import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
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
      axios.get(`http://localhost:3001/words?article_id=${articleId}`)
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
      axios.get(`http://localhost:3001/article?id=${articleNum}`)
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
        <LogoutButton accessToken={accessToken} />
        <Link to={`/recommended-article?kakao_id=${userId}`}>
          <button>Article Recommendation</button>
        </Link>
      </header>
    </div>
  );
};

export default Main;