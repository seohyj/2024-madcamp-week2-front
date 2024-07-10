import React, { useState, useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import Header from '../components/header.js';
import { backend_ip } from './constants.js';
import QuizBackImage from '../assets/quizselectbackground.png';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 400;
  }
`;

const QuizSelect = () => {
  const [articleDetails, setArticleDetails] = useState({});
  const navigate = useNavigate();
  let { articleId } = useParams();
  useEffect(() => {
    if (articleId) {
      axios.get(`http://${backend_ip}:3001/article/choose-article?article_id=${articleId}`)
        .then(response => {
          setArticleDetails(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the article details!', error);
        });
    }
  }, [articleId]);

  const handleQuizSelection = (type) => {
    navigate(`/quiz/${articleId}/${type}`);
  };

  return (
    <Container>
      <GlobalStyle />
      <Header />
      <MainContent>
        <ArticleInfo>
          <Title>{articleDetails.title || 'Article Title'}</Title>
          <Meta>
            By: {articleDetails.author || 'Author'} | Date: {articleDetails.date || '2024-00-00'}
          </Meta>
          <Description>Take a Quiz and Boost up your English!</Description>
        </ArticleInfo>
        <ButtonContainer>
          <QuizButton onClick={() => handleQuizSelection('ENG')}>Fill English</QuizButton>
          <QuizButton onClick={() => handleQuizSelection('KOR')}>Fill Korean</QuizButton>
        </ButtonContainer>
      </MainContent>
    </Container>
  );
};

export default QuizSelect;

// Styled Components

const Container = styled.div`
  min-height: 100vh;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainContent = styled.main`
  padding: 2rem;
  flex: 1;
  width: 100%;
  max-width: 1920px;
  padding-left: 160px;
  padding-right: 160px;
  box-sizing: border-box;
  background-image: url(${QuizBackImage});
  background-size: cover; /* 배경 이미지 크기를 조절하여 요소를 덮도록 설정 */
  background-position: center; /* 배경 이미지의 위치를 중앙으로 설정 */
  background-repeat: no-repeat; /* 배경 이미지가 반복되지 않도록 설정 */
`;

const ArticleInfo = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  font-family: Avenir;
  letter-spacing: -0.7px;

`;

const Meta = styled.div`
  font-family: Avenir;
  letter-spacing: -0.5px;
  font-weight: 500;
  font-size: 1.17rem;
  margin-bottom: 1rem;
`;

const Description = styled.div`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const QuizButton = styled.button`
  width: 600px;
  height: 220px;
  background: #e4dee8;
  border: none;
  border-radius: 170px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  font-family: Avenir;
  font-size: 2.3rem;
  font-weight: 500;
  letter-spacing: -1px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;