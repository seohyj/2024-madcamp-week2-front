import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { backend_ip } from './constants.js';
import axios from 'axios';
import styled from 'styled-components';

import Header from './src/components/header.js';

const Main = () => {
  const [userId, setUserId] = useState('');
  const [articleId, setArticleId] = useState('');
  const [words, setWords] = useState([]);
  const [articleNum, setArticleNum] = useState('');
  const [articleDetails, setArticleDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (articleId) {
      axios.get(`http://${backend_ip}:3001/words/words?article_id=${articleId}`)
        .then(response => {
          setWords(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the words!', error);
        });
    }
  }, [articleId]);

  useEffect(() => {
    if (articleNum) {
      axios.get(`http://${backend_ip}:3001/article/article?id=${articleNum}`)
        .then(response => {
          setArticleDetails(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching article!', error);
        });
    }
  }, [articleNum]);

  const handleLogout = () => {
    const logoutRedirectUri = `http://${backend_ip}:3001/kakao/logout/callback`;
    const logoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=17132d31284a95180bea1e6df5b24fb9&logout_redirect_uri=${logoutRedirectUri}`;
    localStorage.removeItem('kakaoId');
    window.location.href = logoutUrl;
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nickname = queryParams.get('nickname');
  const accessToken = queryParams.get('accessToken');

  return (
    <Container>
      <Header handleLogout={handleLogout} />
      <MainContent>
        <WelcomeMessage>Welcome, {nickname || 'User'}</WelcomeMessage>
        <Section>
          <SectionTitle>Articles to Read</SectionTitle>
          <ButtonGroup>
            <StyledLinkButton to="/categories">Setup Your Main-Interest Categories</StyledLinkButton>
            <StyledLinkButton to="/article-study">Just Get a Random Piece of Article</StyledLinkButton>
          </ButtonGroup>
          <Grid>
            <GridItem>
              <StyledLink to="/article-study">Science</StyledLink>
            </GridItem>
            <GridItem>
              <StyledLink to="/article-study">Culture</StyledLink>
            </GridItem>
            <GridItem>
              <StyledLink to="/article-study">Health</StyledLink>
            </GridItem>
            <GridItem>
              <StyledLink to="/article-study">Technology</StyledLink>
            </GridItem>
          </Grid>
        </Section>
        <Section>
          <SectionTitle>Review your Vocabularies</SectionTitle>
          <Grid cols={4}>
            <GridItem>
              <ArticleTitle>Title of the Article Here</ArticleTitle>
              <ButtonGroup>
                <StyledLinkButton to="/wordslistView">View Vocab Lists from this Article</StyledLinkButton>
                <StyledLinkButton to="/take-quiz">Take Quiz with the words you studied</StyledLinkButton>
              </ButtonGroup>
            </GridItem>
            <GridItem>
              <ArticleTitle>Title of the Article Here</ArticleTitle>
              <ButtonGroup>
                <StyledLinkButton to="/wordslistView">View Vocab Lists from this Article</StyledLinkButton>
                <StyledLinkButton to="/take-quiz">Take Quiz with the words you studied</StyledLinkButton>
              </ButtonGroup>
            </GridItem>
            <GridItem>
              <ArticleTitle>Title of the Article Here</ArticleTitle>
              <ButtonGroup>
                <StyledLinkButton to="/wordslistView">View Vocab Lists from this Article</StyledLinkButton>
                <StyledLinkButton to="/take-quiz">Take Quiz with the words you studied</StyledLinkButton>
              </ButtonGroup>
            </GridItem>
            <GridItem>
              <ArticleTitle>Title of the Article Here</ArticleTitle>
              <ButtonGroup>
                <StyledLinkButton to="/wordslistView">View Vocab Lists from this Article</StyledLinkButton>
                <StyledLinkButton to="/take-quiz">Take Quiz with the words you studied</StyledLinkButton>
              </ButtonGroup>
            </GridItem>
          </Grid>
        </Section>
        <CenterButton>
          <StyledLinkButton to="/articlelistView">View All Read Articles</StyledLinkButton>
        </CenterButton>
      </MainContent>
    </Container>
  );
};

export default Main;

// Styled Components

const Container = styled.div`
  min-height: 100vh;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const MainContent = styled.main`
  padding: 2rem;
  flex: 1;
`;

const WelcomeMessage = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StyledLinkButton = styled(Link)`
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  text-decoration: none;
  text-align: center;

  &:hover {
    background: #0056b3;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 2}, 1fr);
  gap: 1rem;
`;

const GridItem = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 0.25rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ArticleTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const CenterButton = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const BackgroundSection = styled.div`
  background-image: url('image.png'); /* 이미지 경로를 설정해 주세요 */
  background-size: cover;
  background-position: center;
  padding: 2rem;
`;