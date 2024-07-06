import React, { useEffect } from 'react';

const KakaoLogin = () => {
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

    // 세션과 토큰을 명확히 제거
    window.Kakao.Auth.setAccessToken(undefined, true);
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.trim().split("=")[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });
    localStorage.clear();
    sessionStorage.clear();
    console.log('All cookies, local storage, and session storage cleared');

    window.Kakao.Auth.authorize({
      redirectUri: 'http://localhost:3001/auth/kakao/callback' // 서버의 redirect URI
    });
  };

  return (
    <button onClick={handleLogin}>카카오 로그인</button>
  );
};

export default KakaoLogin;