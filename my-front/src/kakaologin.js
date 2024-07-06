import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const KakaoLogin = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('b9b5f8f52b6873a052db52f2fac7a344'); // YOUR_APP_KEY 부분을 발급받은 JavaScript 키로 변경
      console.log('Kakao SDK initialized');
    }
  }, []);

  const handleLogin = () => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('b9b5f8f52b6873a052db52f2fac7a344'); // YOUR_APP_KEY 부분을 발급받은 JavaScript 키로 변경
    }

    window.Kakao.Auth.authorize({
      redirectUri: 'http://localhost:3001/auth/kakao/callback' // 서버의 redirect URI
    });
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const kakaoId = params.get('kakaoId');
    if (kakaoId) {
      localStorage.setItem('kakaoId', kakaoId);
      setIsAuthenticated(true);
      navigate('/main');
    }
  }, [navigate, setIsAuthenticated]);
  return (
    <button onClick={handleLogin}>카카오 로그인</button>
  );
};

export default KakaoLogin;