import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {backend_ip} from './constants.js';
import axios from 'axios';
import '../styles/App.css';
import './recommend_article.js';

const Main = () => {
  const [userId, setUserId] = useState(''); // user_id
  const [articleId, setArticleId] = useState(''); //word
  const [words, setWords] = useState([]);
  const [articleNum, setArticleNum] = useState(''); //article
  const [articleDetails, setArticleDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (articleId) {
      axios.get(`http://${backend_ip}:3001/words/words?article_id=${articleId}`)
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
      axios.get(`http://${backend_ip}:3001/article/article?id=${articleNum}`)
        .then(response => {
          setArticleDetails(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching article!', error);
        });
    }
  }, [articleNum]);

  /*
  // 입력 필드가 변경될 때 호출되는 함수
  const handleInputChange = (event) => {
    setArticleId(event.target.value);
    // 입력된 값을 articleId 상태에 저장
  };
  */

  /*
  // 기사 번호 입력 필드가 변경될 때 호출되는 함수
  const handleArticleNumChange = (event) => {
    setArticleNum(event.target.value);
    // 입력된 값을 articleNum 상태에 저장
  };
  */

  /*
  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
    // 입력된 값을 User_id 상태에 저장
  };
  */

  const handleLogout = () => {
    const logoutRedirectUri = `http://${backend_ip}:3001/kakao/logout/callback`; // 서버의 로그아웃 콜백 URI
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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-background-custom text-white p-4 flex justify-between items-center logoheader">
        <div className="inline-flex justify-end items-center gap-1431px">
          <div className="logo-image">Logo image should be inserted here</div>
          <div>
            <button className="bg-gray-700 px-4 py-2 rounded mr-2">
              <Link to="/my-page">My Page</Link>
            </button>
            <button className="bg-gray-700 px-4 py-2 rounded" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </header>
      <main className="p-8">
        <h1 className="text-4xl font-bold mb-8">Welcome, User</h1>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Articles to Read</h2>
          <div className="mb-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
              <Link to="/select-category">Setup Your Main-Interest Categories</Link>
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              <Link to="/article-study">Just Get a Random Piece of Article</Link>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-white p-4 rounded shadow">
              <Link to="/article-study">Science</Link>
            </button>
            <button className="bg-white p-4 rounded shadow">
              <Link to="/article-study">Culture</Link>
            </button>
            <button className="bg-white p-4 rounded shadow">
              <Link to="/article-study">Health</Link>
            </button>
            <button className="bg-white p-4 rounded shadow">
              <Link to="/article-study">Technology</Link>
            </button>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Review your Vocabularies</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">Title of the Article Here</h3>
              <button className="bg-gray-300 px-2 py-1 rounded mr-2">
                <Link to="/wordslistView">View Vocab Lists from this Article</Link>
              </button>
              <button className="bg-gray-300 px-2 py-1 rounded">
                <Link to="/take-quiz">Take Quiz with the words you studied</Link>
              </button>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">Title of the Article Here</h3>
              <button className="bg-gray-300 px-2 py-1 rounded mr-2">
                <Link to="/wordslistView">View Vocab Lists from this Article</Link>
              </button>
              <button className="bg-gray-300 px-2 py-1 rounded">
                <Link to="/take-quiz">Take Quiz with the words you studied</Link>
              </button>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">Title of the Article Here</h3>
              <button className="bg-gray-300 px-2 py-1 rounded mr-2">
                <Link to="/wordslistView">View Vocab Lists from this Article</Link>
              </button>
              <button className="bg-gray-300 px-2 py-1 rounded">
                <Link to="/take-quiz">Take Quiz with the words you studied</Link>
              </button>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">Title of the Article Here</h3>
              <button className="bg-gray-300 px-2 py-1 rounded mr-2">
                <Link to="/wordslistView">View Vocab Lists from this Article</Link>
              </button>
              <button className="bg-gray-300 px-2 py-1 rounded">
                <Link to="/take-quiz">Take Quiz with the words you studied</Link>
              </button>
            </div>
          </div>
        </section>
        <div className="text-center mt-8">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            <Link to="/articlelistView">View All Read Articles</Link>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Main;