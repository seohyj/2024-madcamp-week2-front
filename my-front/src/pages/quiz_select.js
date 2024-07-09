import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import Header from '../components/header.js';
import { backend_ip } from './constants.js';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 400;
  }
`;

const QuizSelect = () => {
  const [articleId, setArticleId] = useState('');
  const [articleDetails, setArticleDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedArticleId = localStorage.getItem('selectedArticleId');
    if (storedArticleId) {
      setArticleId(storedArticleId);
    } else {
      console.error('No articleId found in localStorage');
    }
  }, []);

  useEffect(() => {
    if (articleId) {
      axios.get(`http://${backend_ip}:3001/article/article?id=${articleId}`)
        .then(response => {
          setArticleDetails(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the article details!', error);
        });
    }
  }, [articleId]);

  const handleQuizSelection = (type) => {
    navigate(`/quiz/${type}`);
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
          <QuizButton onClick={() => handleQuizSelection('quiz_eng')}>Fill English</QuizButton>
          <QuizButton onClick={() => handleQuizSelection('quiz_kor')}>Fill Korean</QuizButton>
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
`;

const ArticleInfo = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Meta = styled.div`
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const Description = styled.div`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const QuizButton = styled.button`
  width: 300px;
  height: 80px;
  background: #ffffff;
  border: none;
  border-radius: 40px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;