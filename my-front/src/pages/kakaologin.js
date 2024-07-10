import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {backend_ip} from './constants.js';
import styled from 'styled-components';

import logoImage from '../assets/logoimage.png';
import backgroundImage from '../assets/background.png'; // 배경 이미지 경로

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
      redirectUri: `http://${backend_ip}:3001/kakao/auth/kakao/callback` // 서버의 redirect URI
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
    <Container>
      <Header />
      <MainSection>
        <LeftSection>
          <LogoContainer>
            <LogoImage src={logoImage} />
          </LogoContainer>
        </LeftSection>
        <RightSection>
          <Content>
            <TitleContainer>
              <Title>Study English with your Favorite Articles</Title>
            </TitleContainer>
            <ButtonContainer>
              <LoginButton onClick={handleLogin}>
                <ButtonText>Log In with your Kakao ID</ButtonText>
              </LoginButton>
            </ButtonContainer>
          </Content>
        </RightSection>
      </MainSection>
      <Footer />
    </Container>
  );
};

export default KakaoLogin;

// Styled Components

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const Header = styled.div`
  align-self: stretch;
  height: 64px;
  padding: 8px 12px;
  background: white;
`;

const MainSection = styled.div`
  width: 100%;
  height: calc(100vh - 128px); /* Adjust height according to the footer and header */
  display: flex;
  background: url(${backgroundImage}) no-repeat center center;
  background-size: cover;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftSection = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
  }
`;

const RightSection = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
  }
`;

const LogoContainer = styled.div`
  width: 418px;
  height: 406px;
  position: relative;

  @media (max-width: 1024px) {
    width: 300px;
    height: 300px;
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;


const Content = styled.div`
  width: 868px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 41px;

  @media (max-width: 1024px) {
    width: 90%;
    gap: 20px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
    gap: 20px;
  }
`;

const TitleContainer = styled.div`
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Title = styled.div`
  width: 777px;
  color: #0c0c0d;
  font-size: 37px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  line-height: 48px;
  word-wrap: break-word;
  text-align: center;

  @media (max-width: 1024px) {
    width: 100%;
    font-size: 32px;
    line-height: 40px;
  }

  @media (max-width: 768px) {
    font-size: 24px;
    line-height: 32px;
  }
`;

const ButtonContainer = styled.div`
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    height: auto;
  }
`;

const LoginButton = styled.button`
  width: 768px;
  height: 120px;
  background: #292a2a;
  box-shadow: -3px -3px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  cursor: pointer;

  @media (max-width: 1024px) {
    width: 100%;
    height: 100px;
  }

  @media (max-width: 768px) {
    height: 80px;
  }
`;

const ButtonText = styled.div`
  text-align: center;
  color: #f4ffb1;
  font-size: 32px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  line-height: 50px;
  word-wrap: break-word;
  padding-left: 15px;
  padding-right: 15px;

  @media (max-width: 1024px) {
    font-size: 40px;
    line-height: 40px;
  }

  @media (max-width: 768px) {
    font-size: 24px;
    line-height: 24px;
  }
`;

const Footer = styled.div`
  align-self: stretch;
  height: 64px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;