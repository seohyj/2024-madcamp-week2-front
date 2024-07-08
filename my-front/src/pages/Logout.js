import React from 'react';
import {backend_ip} from './constants.js';

const LogoutButton = ({ accessToken }) => {
  const handleLogout = () => {
    const logoutRedirectUri = `http://${backend_ip}:3001/logout/callback`; // 서버의 로그아웃 콜백 URI
    const logoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=17132d31284a95180bea1e6df5b24fb9&logout_redirect_uri=${logoutRedirectUri}`;

    // 카카오 로그아웃 URL로 리디렉션
    window.location.href = logoutUrl;
  };

  return (
    <button onClick={handleLogout}>카카오 로그아웃</button>
  );
};

export default LogoutButton;