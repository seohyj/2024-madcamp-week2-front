import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import LogoutButton from '../pages/Logout';
import axios from 'axios';
import '../styles/App.css';

const Main = () => {
  const [userId, setUserId] = useState(''); // user_id
  const [articleId, setArticleId] = useState(''); //word
  const [articleNum, setArticleNum] = useState(''); //article

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
          type="number" 
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
        <input
          type="number"
          value={articleNum}
          onChange={handleArticleNumChange}
          placeholder='Enter article number'
        />
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