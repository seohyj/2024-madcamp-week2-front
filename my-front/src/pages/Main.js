import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { backend_ip } from './constants.js';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';

import Header from '../components/header.js';
import mainb1 from '../assets/main_b1.png';
import mainb2 from '../assets/main_b2.png';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 400;
  }
`;

const Main = () => {
  const [userId, setUserId] = useState('');
  const [nickname, setNickName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['economy','Lifestyle','Culture','Economy']);
  const navigate = useNavigate();
  useEffect(() => {
    if(userId===''){
      setUserId(localStorage.getItem('kakaoId'));
    }
  }, [userId]);
  useEffect(() => {
    if(userId!==''){
      axios.get(`http://${backend_ip}:3001/kakao/nickname?kakao_id=${userId}`)
      .then(response => {
        setNickName(response.data.nickname);
      })
      .catch(error => {
        console.error('There was an error fetching article!', error);
      });
    }
  }, [userId]);
  useEffect(() => {
    if(userId!==''){
      const fetchCategories = async () => {
        let category_buffer = ['', '', '', ''];
        const requests = [];

        for (let i = 1; i <= 4; i++) {
          requests.push(
            axios.get(`http://${backend_ip}:3001/user/get-category`, {
              params: {
                user_id: userId,
                category_number: i,
              }
            })
            .then(response => {
              category_buffer[i - 1] = response.data.category_text || selectedCategories[i - 1];
            })
            .catch(error => {
              console.error('There was an error fetching article!', error);
            })
          );
        }

        await Promise.all(requests);
        setSelectedCategories(category_buffer);
      };
      fetchCategories();
    }
  }, [userId]);
  const handleLogout = () => {
    const logoutRedirectUri = `http://${backend_ip}:3001/kakao/logout/callback`;
    const logoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=17132d31284a95180bea1e6df5b24fb9&logout_redirect_uri=${logoutRedirectUri}`;
    localStorage.removeItem('kakaoId');
    window.location.href = logoutUrl;
  }; 

  return (
    <Container>
      <GlobalStyle />
      <Header handleLogout={handleLogout} />
      <MainContent>
        <WelcomeMessage>Welcome, {nickname || 'User'}</WelcomeMessage>
        <SectionWrapper>
          <ImageContainer backgroundImage={mainb1}></ImageContainer>
        </SectionWrapper>
        <ButtonGroup>
            <StyledLinkButton to="/categories">Setup Your Main-Interest Categories</StyledLinkButton>
            <StyledLinkButton to="/article-study">Just Get a Random Piece of Article</StyledLinkButton>
          </ButtonGroup>
          <Grid>
            <GridItem>
              <StyledLink to={`/article-study/${selectedCategories[0]}`}>{selectedCategories[0]}</StyledLink>
            </GridItem>
            <GridItem>
              <StyledLink to={`/article-study/${selectedCategories[1]}`}>{selectedCategories[1]}</StyledLink>
            </GridItem>
            <GridItem>
              <StyledLink to={`/article-study/${selectedCategories[2]}`}>{selectedCategories[2]}</StyledLink>
            </GridItem>
            <GridItem>
              <StyledLink to={`/article-study/${selectedCategories[3]}`}>{selectedCategories[3]}</StyledLink>
            </GridItem>
          </Grid>
        <SectionWrapper>
          <ImageContainer backgroundImage={mainb2}></ImageContainer>
        </SectionWrapper>
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

const MainContent = styled.main`
  padding: 2rem;
  flex: 1;
  width: 100%;
  max-width: 1920px;
  padding-left: 160px;
  padding-right: 160px;
  box-sizing: border-box;
`;

const WelcomeMessage = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
`;

const SectionWrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
`;

const ImageContainer = styled.div`
  width: 1600px;
  height: 274px;
  background-image: url(${props => props.backgroundImage});
  background-size: contain;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
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

const StyledLink = styled(Link)`
  color: #0C0C0D;
  font-family: 'Poppins', sans-serif;
  font-size: 25px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 48px */
  letter-spacing: -1.2px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;