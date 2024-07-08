// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import headerlogoImage from '../assets/wordicle.png'; // 로고 이미지 경로
import logoutImage from '../assets/logoutbutton.png'; // 로그아웃 이미지 경로
import myPageImage from '../assets/mypagebutton.png'; // 마이페이지 이미지 경로
import { backend_ip } from '../pages/constants.js';

const handleLogout = () => {
    const logoutRedirectUri = `http://${backend_ip}:3001/kakao/logout/callback`;
    const logoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=17132d31284a95180bea1e6df5b24fb9&logout_redirect_uri=${logoutRedirectUri}`;
    localStorage.removeItem('kakaoId');
    window.location.href = logoutUrl;
  };

const Header = ({ handleLogout }) => {
  return (
    <HeaderContainer>
      <LogoContainer>
        <Logo src={headerlogoImage} alt="Wordicle Logo" />
      </LogoContainer>
      <Nav>
        <Button onClick={handleLogout}>
          <ButtonImageContainer>
            <ButtonImage src={logoutImage} alt="Log Out" />
          </ButtonImageContainer>
        </Button>
        <StyledLink to="/my-page">
          <Button>
            <ButtonImageContainer>
              <ButtonImage src={myPageImage} alt="My Page" />
            </ButtonImageContainer>
          </Button>
        </StyledLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;

// Styled Components

const HeaderContainer = styled.header`
  width: 100%;
  height: 80px;
  background: #545454;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 162px;
  box-sizing: border-box;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 124px;
  height: 25px;
`;

const Logo = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const Nav = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  width: 83px;
  height: 32px;
  padding: 8px;
  background: #E3E3E3;
  border-radius: 8px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background: #d3d3d3;
  }
`;

const ButtonImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ButtonImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;