// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import axios from 'axios';
import './styles/App.css';
import KakaoLogin from './pages/kakaologin';
import Main from './pages/Main';
import RecommendedArticle from './pages/recommend_article';
import Categories from './pages/categories';
import QuizSelect from './pages/quiz_select';
import ArticlelistView from './pages/articlelist';
import QuizView from './pages/quiz';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); //로그인을 한적이 있는지 확인하는 State 변수
  const [loading, setLoading] = useState(true); // 초기 로딩 상태
  useEffect(() => {
    const kakaoId = localStorage.getItem('kakaoId');
    if (kakaoId) {
      setIsAuthenticated(true);
    }
    setLoading(false); // 로딩 완료
  }, []);


  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 보여줄 UI
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/Main" /> : <KakaoLogin setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/main"
          element={isAuthenticated ? <Main /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/main" : "/login"} />}
        />
        <Route
          path="/article-study/:param"
          element={isAuthenticated ? <RecommendedArticle /> : <Navigate to="/login" />}
        />
        <Route
          path="/article-study"
          element={isAuthenticated ? <RecommendedArticle /> : <Navigate to="/login" />}
        />
        <Route
          path="/categories"
          element={isAuthenticated ? <Categories /> : <Navigate to="/login" />}
        />
        <Route
          path="/take-quiz/:articleId"
          element={isAuthenticated ? <QuizSelect /> : <Navigate to="/login" />}
        />
        <Route
          path="/articlelistView"
          element={isAuthenticated ? <ArticlelistView /> : <Navigate to="/login" />}
        />
        <Route
          path="/quiz/:articleId/:quizType"
          element={isAuthenticated ? <QuizView /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
