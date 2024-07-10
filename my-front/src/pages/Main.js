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
  const [readArticleNum, setReadArticleNum] = useState(0);
  const [readWordNum, setReadWordNum] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState(['economy','Lifestyle','Culture','Economy']);
  const [readArticles, setReadArticles] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { //userId 가져오는 코드
    if(userId===''){
      setUserId(localStorage.getItem('kakaoId'));
    }
  }, [userId]);

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
  useEffect(() => { //읽은 기사 개수 가져오는 코드
    if(userId!==''){
      axios.get(`http://${backend_ip}:3001/article/read-article-num?user_id=${userId}`)
      .then(response => {
        //console.log(response.data[0]['COUNT(*)']);
        setReadArticleNum(response.data[0]['COUNT(*)']);
      })
      .catch(error => {
        console.error('There was an error fetching nickname!', error);
      });
    }
  }, [userId]);
  useEffect(() => { //단어장의 단어 개수 가져오는 코드
    if(userId!==''){
      axios.get(`http://${backend_ip}:3001/words/read-word-num?user_id=${userId}`)
      .then(response => {
        //console.log(response.data[0]['COUNT(words.word_id)']);
        setReadWordNum(response.data[0]['COUNT(words.word_id)']);
      })
      .catch(error => {
        console.error('There was an error fetching nickname!', error);
      });
    }
  }, [userId]);
  useEffect(() => { //category 가져오는 코드
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
    
  },[userId]);


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
        <Headcontainer>
        <WelcomeMessage>Welcome, {nickname || 'User'}</WelcomeMessage>
          <Colcontainer>
            <div>Read Articles: {readArticleNum}</div>
            <div>Studied Vocabs: {readWordNum}</div>
          </Colcontainer>
        </Headcontainer>
        <SectionWrapper>
          <ImageContainer backgroundImage={mainb1}></ImageContainer>
        </SectionWrapper>
        <CenterRowGrid>
          <TopButtonGroup>
              <TopStyledLinkButton to="/categories">Setup Your Main-Interest Categories</TopStyledLinkButton>
              <TopStyledLinkButton to="/article-study">Just Get a Random Piece of Article</TopStyledLinkButton>
          </TopButtonGroup>
        </CenterRowGrid>
          <Grid>
            <TopGridItem>
              <StyledLink to={`/article-study/${selectedCategories[0]}`}>{selectedCategories[0]}</StyledLink>
            </TopGridItem>
            <TopGridItem>
              <StyledLink to={`/article-study/${selectedCategories[1]}`}>{selectedCategories[1]}</StyledLink>
            </TopGridItem>
            <TopGridItem>
              <StyledLink to={`/article-study/${selectedCategories[2]}`}>{selectedCategories[2]}</StyledLink>
            </TopGridItem>
            <TopGridItem>
              <StyledLink to={`/article-study/${selectedCategories[3]}`}>{selectedCategories[3]}</StyledLink>
            </TopGridItem>
          </Grid>
        <SectionWrapper>
          <ImageContainer backgroundImage={mainb2}></ImageContainer>
        </SectionWrapper>
          <BottomGrid cols={4}>
              <GridItem>
                <ArticleTitle>{readArticles && readArticles.length>0? readArticles[0].title : "read more articles ..."}</ArticleTitle>
                {(readArticles && readArticles.length>0)?(
                  <ButtonGroup>
                    <StyledLinkButton to={`/article-study/${readArticles[0].article_id}`}>View Vocab Lists from this Article</StyledLinkButton>
                    <StyledLinkButton to={`/take-quiz/${readArticles[0].article_id}`}>Take Quiz</StyledLinkButton>
                  </ButtonGroup>
                ):null
                }
              </GridItem>
              <GridItem>
                <ArticleTitle>{readArticles && readArticles.length>1? readArticles[1].title : "read more articles ..."}</ArticleTitle>
                {(readArticles && readArticles.length>1)?(
                  <ButtonGroup>
                    <StyledLinkButton to={`/article-study/${readArticles[1].article_id}`}>View Vocab Lists from this Article</StyledLinkButton>
                    <StyledLinkButton to={`/take-quiz/${readArticles[1].article_id}`}>Take Quiz</StyledLinkButton>
                  </ButtonGroup>
                ):null
                }
              </GridItem>
              <GridItem>
                <ArticleTitle>{readArticles && readArticles.length>2? readArticles[2].title : "read more articles ..."}</ArticleTitle>
                {(readArticles && readArticles.length>2)?(
                  <ButtonGroup>
                    <StyledLinkButton to={`/article-study/${readArticles[2].article_id}`}>View Vocab Lists from this Article</StyledLinkButton>
                    <StyledLinkButton to={`/take-quiz/${readArticles[2].article_id}`}>Take Quiz</StyledLinkButton>
                  </ButtonGroup>
                ):null
                }
              </GridItem>
              <GridItem>
                <ArticleTitle>{readArticles && readArticles.length>3? readArticles[3].title : "read more articles ..."}</ArticleTitle>
                {(readArticles && readArticles.length>3)?(
                  <ButtonGroup>
                    <StyledLinkButton to={`/article-study/${readArticles[3].article_id}`}>View Vocab Lists from this Article</StyledLinkButton>
                    <StyledLinkButton to={`/take-quiz/${readArticles[3].article_id}`}>Take Quiz</StyledLinkButton>
                  </ButtonGroup>
                ):null
                }
              </GridItem>
          </BottomGrid>
        <SectionWrapper>
          <CenterButton>
            <StyledLinkButton to="/articlelistView">View All Read Articles</StyledLinkButton>
          </CenterButton>
        </SectionWrapper>
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

const Headcontainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1600px;
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
  margin-right: 0rem;
  margin-left: 0rem;
  padding-left: 0.7rem;
  padding-right: 2rem;
`;

const Colcontainer = styled.div`
  display: flex;
  gap: 1rem;

  div {
    background: #f7f2fa;
    padding: 1rem 1rem;
    border-radius: 0.7rem;
    font-size: 1rem;
    font-weight: 500;
    color: #1d1b20;
    text-align: center;
  }
`;
const MainContent = styled.main`
  background: #ffffff;
  flex: center;
  width: 100%;
  max-width: 1920px;
  padding-left: 160px;
  padding-right: 160px;
  padding-bottom: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
`;

const WelcomeMessage = styled.h1`
  font-style: Poppins;
  font-size: 2.5rem;
  font-weight: 500;
  margin-top: 0.5rem;
  margin-bottom: 0rem;
  text-align: center;
`;

const SectionWrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0rem;
  margin-bottom: 0rem;
`;

const ImageContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  height: 274px;
  background-image: url(${props => props.backgroundImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;
const TopButtonGroup = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  justify-content: flex-end;
  align-items: flex-end;
`;

const TopStyledLinkButton = styled(Link)`
  width: 100%;
  background: #f7f2fa;
  color: #1D1B20;
  padding: 6px 16px 6px 16px;
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  font-size: 20px;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  display: flex;
  height: var(--sds-size-icon-medium);
  justify-content: center;
  align-items: center;
  gap: var(--sds-size-space-200);
  flex: center;

  &:hover {
    background: #e5dce6;
  }
`;

const StyledLinkButton = styled(Link)`
  width: 100%;
  background: #f7f2fa;
  color: #1D1B20;
  padding: 6px 16px 6px 16px;
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  display: flex;
  height: var(--sds-size-icon-medium);
  justify-content: center;
  align-items: center;
  gap: var(--sds-size-space-200);
  flex: center;

  &:hover {
    background: #e5dce6;
  }
`;

const CenterRowGrid = styled.div`
  padding: 8px 0px 0px 0px;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center; /* Align content to center */
`;

const Grid = styled.div`
  padding: 13px 0px 10px 0px;
  align-items: center;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(${props => props.cols || 2}, 1fr);
  gap: 1rem;
`;

const BottomGrid = styled.div`
  width: 100%;
  padding: 18px 0px 10px 0px;
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 4}, 1fr);
  column-gap: 20px; /* Adjusted gap to 44px */
  justify-content: center;
  align-items: center;
`;

const TopGridItem = styled.div`
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center; /* Align content to center */
`;

const GridItem = styled.div`
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  text-align: center;
  display: flex;
  min-height: 195px;
  height: auto;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center; /* Align content to center */
`;

const ArticleTitle = styled.h3`
  font-family: Avenir;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const CenterButton = styled.div`
  display: flex;
  justify-content: center;
  width: 30%;
  text-align: center;
  margin-top: 0.5rem;
`;

const StyledLink = styled(Link)`
  color: #0C0C0D;
  font-family: 'Poppins', sans-serif;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%; /* 48px */
  letter-spacing: -1.2px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;