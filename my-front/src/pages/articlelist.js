import React, { useState, useEffect } from 'react';
import { useLocation,useParams,Link } from 'react-router-dom';
import {backend_ip} from './constants.js';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import '../styles/App.css';
import Header from '../components/header.js';

import businessSquare from '../assets/categorysquares/businesssquare.png';
import cultureSquare from '../assets/categorysquares/culturesquare.png';
import economySquare from '../assets/categorysquares/economysquare.png';
import healthSquare from '../assets/categorysquares/healthsquare.png';
import lifestyleSquare from '../assets/categorysquares/lifestylesquare.png';
import politicsSquare from '../assets/categorysquares/politicssquare.png';
import scienceSquare from '../assets/categorysquares/sciencesquare.png';
import technologySquare from '../assets/categorysquares/technologysquare.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Avenir', sans-serif;
    font-style: normal;
    font-weight: 400;
  }
`;

const categoryImages = {
  Business: businessSquare,
  Culture: cultureSquare,
  Economy: economySquare,
  Health: healthSquare,
  Lifestyle: lifestyleSquare,
  Politics: politicsSquare,
  Science: scienceSquare,
  Technology: technologySquare,
};

const articles = [
    { id: 1, title: "Article Title" },
    { id: 2, title: "Article Title" },
    { id: 3, title: "Article Title" },
    { id: 4, title: "Article Title" },
    { id: 5, title: "Article Title" },
    { id: 6, title: "Article Title" }
];

const userId = localStorage.getItem('kakaoId');

const ArticlelistView = () => {
  const [readArticles, setReadArticles] = useState([]);
  const [nickname, setNickName] = useState('');

  const handleDeleteArticle = (article_id)=>{
    
    axios.delete(`http://${backend_ip}:3001/article/delete-article`,{params:{article_id: article_id}})
      .then(response => {
        setReadArticles((prevArticles) => prevArticles.filter((article) => article.article_id !== article_id));
      })
      .catch(error => {
        console.error('There was an error adding the word!', error);
      });
  }

  useEffect(() => { //닉네임 가져오는 코드
    if(userId!==''){
      axios.get(`http://${backend_ip}:3001/kakao/nickname?kakao_id=${userId}`)
      .then(response => {
        setNickName(response.data.nickname);
      })
      .catch(error => {
        console.error('There was an error fetching nickname!', error);
      });
    }
  }, [userId]);
  
  useEffect(() => {
    if(userId!==''){
      axios.get(`http://${backend_ip}:3001/article/articles`,{params: {user_id: userId}})
      .then(response => {
        setReadArticles(response.data);
        console.log(readArticles);
      })
      .catch(error => {
        console.error('There was an error recommending an article!', error);
      });
    }
  },[]);

  return (
    <Container>
      <GlobalStyle />
      <Header />
      <Content>
        <TitleSection>
          <h1>Welcome, {nickname || 'User'}</h1>
          <TopContainer>
            <h2>Review your Vocabularies with Wordicle.</h2>
            <p>Here's a list of all articles you studied before.</p>
          </TopContainer>
        </TitleSection>
        <Articles>
          {readArticles.map(article => (
            <ArticleItem key={article.article_id}>
              <ImageContainer>
                <img src={categoryImages[article.category] || 'https://via.placeholder.com/80x80?text=Default'} alt={article.category} />
              </ImageContainer>
              <ArticleContent>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ButtonGroup>
                  <StyledLink to={`/article-study/${article.article_id}`}>View Vocab Lists from this Article</StyledLink>
                  <StyledLink to={`/take-quiz/${article.article_id}`}>Take Quiz with the words you studied</StyledLink>
                </ButtonGroup>
              </ArticleContent>
              <DeleteButton onClick={() => handleDeleteArticle(article.article_id)}><FontAwesomeIcon icon={faTrash} /></DeleteButton>
            </ArticleItem>
          ))}
        </Articles>
      </Content>
    </Container>
  );
};

export default ArticlelistView;

// Styled Components

const Container = styled.div`
  min-height: 100vh;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
`;

const TopContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 0rem;
  margin-left: 0rem;
  margin-bottom: 0rem;
  padding: 0 0 0 0rem;
  display: flex;
  flex-direction: column;
  background: #e4dee8;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  align-items: center;
`;

const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: -0.5px;
    color: #1D1B20;
    text-align: left;
    margin-top: 0rem;
    margin-bottom: 0.3rem;
    margin-left: 1.5rem;
    margin-right:0rem;
  }
  
  h2 {
    margin-top: 1rem;
    margin-bottom: 0rem;
    margin-left: 1.5rem;
    margin-right:0rem;
    font-size: 2rem;
    font-weight: 600;
    color: #1D1B20;
    letter-spacing: -0.3px;
  }
  
  p {
    margin-top: 0.7rem;
    margin-bottom: 1rem;
    margin-left: 1.5rem;
    margin-right: 0rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1D1B20;
    letter-spacing: -0.3px;
  }
`;

const Articles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0rem;
  padding-top: 0rem;
`;

const ArticleItem = styled.div`
  display: flex;
  padding: 1rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  align-items: center;
`;

const ImageContainer = styled.div`
  flex-shrink: 0;
  img {
    width: 80px;
    height: 80px;
    border-radius: 16px;
  }
`;

const ArticleContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 2rem;
  padding-top: 0rem;
  padding-bottom: 0rem;
  margin-top: 0rem;
  margin-bottom: 0rem;
`;

const ArticleTitle = styled.h3`
  font-size: 23px;
  font-weight: 600;
  color: #1D1B20;
  line-height: 28px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F7F2FA;
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  height: 48px;
  padding: 0 1rem;
  font-size: 17px;
  font-weight: 500;
  color: #1D1B20;
  text-decoration: none;
  text-align: center;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #545454;
  cursor: pointer;
  font-size: 20px;
  margin-right: 1rem;
`;