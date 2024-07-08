import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {backend_ip} from './constants.js';

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
      redirectUri: `http://${backend_ip}:3001/auth/kakao/callback` // 서버의 redirect URI
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
    <div className="flex flex-col items-center w-full h-screen bg-surface-container-lowest rounded-t-extra-large">
      <header className="flex justify-end items-center h-16 w-full px-8 bg-surface-container-lowest">
        <div className="opacity-stroke-border">Header Content</div>
      </header>
      <div className="w-full h-full bg-gradient-custom">
        <div className="flex flex-col justify-center items-center gap-10 h-[334px] w-full">
          <div className="flex flex-col justify-center items-center gap-2 px-4">
            <h1 className="text-custom-black text-4xl font-normal leading-[120%] tracking-[-1.2px] opacity-stroke-border">
              Study English with your Favorite Articles
            </h1>
          </div>
          <button
            onClick={handleLogin}
            className="flex justify-center items-center w-[868px] px-4 py-3 bg-custom-gray text-custom-green text-2xl font-medium rounded-lg shadow-custom opacity-stroke-border"
          >
            Log In with your Kakao ID
          </button>
        </div>
      </div>
      <footer className="flex justify-end items-center h-16 w-full px-8 bg-surface-container-lowest">
        <div className="opacity-stroke-border">Footer Content</div>
      </footer>
    </div>
  );
};

export default KakaoLogin;