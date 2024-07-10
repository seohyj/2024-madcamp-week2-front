import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {backend_ip} from './constants.js';
import axios from 'axios';
import '../styles/App.css';
import Loading from '../components/Loading';

import styled from 'styled-components';
import Header from '../components/header.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const RecommendedArticle = () => {
  const [recommendedArticle, setRecommendedArticle] = useState(null);
  const [newWord, setNewWord] = useState('');
  const [words, setWords] = useState([]);

  let { param } = useParams();
  let category = null;
  let article_id = null;
  const userId = localStorage.getItem('kakaoId');
  
  const isNumeric = (value) => {
    return /^\d+$/.test(value);
  };

  // param이 숫자이면 id, 문자가 섞여 있으면 category로 간주
  if (isNumeric(param)) {
    article_id = param;
  } else {
    category = param;
  }

  
  useEffect(() => {
    if(category!==null){
      axios.post(`http://${backend_ip}:3001/article/random-article`,{kakao_id: userId, category: category})
        .then(response => {
          setRecommendedArticle(response.data);
        })
        .catch(error => {
          console.error('There was an error recommending an article!', error);
        });
    }
    else if(article_id!==null){
      axios.get(`http://${backend_ip}:3001/article/choose-article`,{params:{article_id: article_id}})
        .then(response => {
          setRecommendedArticle(response.data);
        })
        .catch(error => {
          console.error('There was an error recommending an article!', error);
        });
    }
  },[]);
  useEffect(()=>{
    if(recommendedArticle!==null){
      axios.get(`http://${backend_ip}:3001/words/words`,{params:{article_id: article_id}})
        .then(response => {
          setWords(response.data);
        })
        .catch(error => {
          console.error('There was an error recommending an article!', error);
        });
    }
  },[recommendedArticle])
  

  const handleNewWordChange = (event) => {
    setNewWord(event.target.value);
  };

  const handleAddWord = () => {
    if (recommendedArticle) {
      axios.post(`http://${backend_ip}:3001/words/word`,{ article_id: recommendedArticle.article_id, word: newWord})
        .then(response => {
          if (response.data.word) {
            setWords([...words, response.data]);
            setNewWord('');
          }
        })
        .catch(error => {
          alert("위험한 단어");
          setNewWord('');
        });
    }
  };
  const handleDeleteWord = (word_id)=>{
    if (recommendedArticle) {
      axios.delete(`http://${backend_ip}:3001/words/delete-word`,{params:{word_id: word_id}})
        .then(response => {
          setWords((prevWords) => prevWords.filter((word) => word.word_id !== word_id));
        })
        .catch(error => {
          console.error('There was an error adding the word!', error);
        });
    }
  }

  const navigate = useNavigate();
  const handleToMainClick = () => {
    navigate('/main');
  };

  if(recommendedArticle===null){
    return <Loading />;
  }
  return (
    <Container>
      <Header />
      <MainContent>
        <TitleSection>
          <Title>{recommendedArticle.title}</Title>
          <InfoContainer>
            <InfoText>By: {recommendedArticle.author}</InfoText>
            <InfoText>Date: {recommendedArticle.date}</InfoText>
          </InfoContainer>
        </TitleSection>
        <ContentSection>
          <ArticleContainer>
            <ArticleText>{recommendedArticle.contents}</ArticleText>
          </ArticleContainer>
          <Sidebar>
            <VocabularyTitle>Your Vocabulary List</VocabularyTitle>
            <InputGroup>
              <Input
                type="text"
                value={newWord}
                onChange={handleNewWordChange}
                placeholder="Write and Enter to Save"
              />
              <AddButton onClick={handleAddWord}>Enter</AddButton>
            </InputGroup>
            <WordList>
              {words.map((word, index) => (
                <WordItem key={index}>
                  <Word>{word.word}</Word>
                  <Translation>{word.word_korean}</Translation>
                  <DeleteButton onClick={() => handleDeleteWord(word.word_id)}><FontAwesomeIcon icon={faTrash} /></DeleteButton>
                </WordItem>
              ))}
            </WordList>
            <TomainContainer onClick={handleToMainClick}>Save and Go to Main</TomainContainer>
          </Sidebar>
        </ContentSection>
      </MainContent>
    </Container>
  );
};

export default RecommendedArticle;

// Styled Components
const Container = styled.div`
  width: 100%;
  height: max-content;
  position: relative;
  background: #f4f3f8;
`;

const MainContent = styled.div`
  background: #f4f3f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-top: 20px;
  padding-left: 50px;
  margin-top: 0.5;
  margin-bottom: 0rem;
  margin-left: 0rem;
  margin-right: 0rem;
`;

const TitleSection = styled.div`
  width: 100%;
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 0px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: 0rem;
  margin-right: 0rem;
`;

const Title = styled.h1`
  color: black;
  font-size: 32px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  letter-spacing: -0.3px;
  margin-left: 5rem;
  width: max-content;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap:2rem;
  margin-left: 3rem;
  margin-right: 14rem;
`;

const InfoText = styled.div`
  color: black;
  font-size: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  line-height: auto;
  margin-right: 1rem;
  width: max-content;
`;

const ContentSection = styled.div`
  display: flex;
  width: 100%;
  max-width: 1920px;
  margin-top: 20px;
`;

const ArticleContainer = styled.div`
  flex: 3;
  background: #DEE3E5;
  padding-top: 30px;
  padding-bottom: 50px;
  padding-left: 50px;
  padding-right: 50px;
  margin-left: 2.5rem;
  margin-right: 2.5rem;
  border-radius: 37px 37px 0 0;
  max-width: 1000px;
`;

const ArticleText = styled.div`
  color: black;
  font-size: 25px;
  font-family: 'Avenir', sans-serif;
  font-weight: 500;
  letter-spacing: -0.9px;
  word-wrap: break-word;
`;

const Sidebar = styled.div`
  flex: 0.3;
  background: white;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 37px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 30px;
  padding-bottom: 20px;
  display: inline-block;
  flex-direction: column;
  gap: 10px;
`;
// Vocabulary List
const VocabularyTitle = styled.div`
  width: 100%;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 15px;
  color: white;
  font-size: 20px;
  font-family: 'Avenir', sans-serif;
  font-weight: 600;
  line-height: 52px;
  letter-spacing: 0.3px;
  text-align: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const InputGroup = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  height: 48px;
  background: rgba(0, 0, 0, 0);
  border-radius: 8px;
  border-bottom: 1px solid #7F7F7F;
  padding: 0 8px;
  font-size: 23px;
  font-family: 'Avenir', sans-serif;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: -0.5px;
  color: black;
  text-align: center;

  &::placeholder {
    color: #BDBDBD;
  }
  &:focus {
    outline: none;
    border: 1px solid ; /* 포커스 시 경계선 색상 */
  }
`;

const AddButton = styled.button`
  height: 48px;
  background: #191919;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 18px;
  padding-left: 10px;
  padding-right: 10px;
  margin-right: 0px;
  margin-left: 10px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #333333;
  }
`;

const WordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const WordItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.21);
  border-bottom: 1.3px solid #7F7F7F;
  border-radius: 0px;
`;

// 입력한 영단어
const Word = styled.div`
  flex: 1;
  font-size: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  padding-left: 10px;
  color: black;
`;

// 입력한 영단어 한글
const Translation = styled.div`
  flex: 1;
  font-size: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  color: black;
  padding-left: 1rem;
  margin: 0 0 0 0rem;
`;

const DeleteButton = styled.button`
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  position: relative;
  cursor: pointer;

  &::before {
    content: ‘’;
    position: absolute;
    top: 2px;
    left: 3px;
    width: 18px;
    height: 20px;
    border: 1.5px solid black;
  }
  &:hover {
    color: grey;
  }
`;

const TomainContainer = styled.div`
  width: 100%;
  background: rgba(240, 240, 240, 0.75);
  border-radius: 15px;
  color: black;
  font-size: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  line-height: 52px;
  text-align: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-top: 2rem;
  cursor: pointer;
`;
