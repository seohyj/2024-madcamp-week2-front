import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {backend_ip} from './constants.js';
import axios from 'axios';
import '../styles/App.css';

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
          console.error('There was an error adding the word!', error);
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
  if(recommendedArticle===null){
    return <div>Loading ... </div>;
  }
  return (
    <Container>
      <Header />
      <MainContent>
        <TitleSection>
          <Title>{recommendedArticle.title}</Title>
          <InfoText>By: {recommendedArticle.author}</InfoText>
          <InfoText>Date: {recommendedArticle.date}</InfoText>
        </TitleSection>
        <ContentSection>
          <ArticleContainer>
            <ArticleText>{recommendedArticle.contents}</ArticleText>
          </ArticleContainer>
          <Sidebar>
            <VocabularyTitle>Vocabulary List</VocabularyTitle>
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
  height: 100%;
  position: relative;
  background: #F4F3F8;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
`;

const TitleSection = styled.div`
  width: 100%;
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 160px;
`;

const Title = styled.h1`
  color: black;
  font-size: 35px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  line-height: auto;
`;

const InfoText = styled.div`
  color: black;
  font-size: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  line-height: auto;
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
  padding: 30px;
  border-radius: 37px 37px 0 0;
`;

const ArticleText = styled.div`
  color: black;
  font-size: 25px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  letter-spacing: -0.5px;
  word-wrap: break-word;
`;

const Sidebar = styled.div`
  flex: 1;
  background: white;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 37px;
  padding: 20px 30px;
  display: inline-block;
  flex-direction: column;
  gap: 10px;
`;
// Vocabulary List
const VocabularyTitle = styled.div`
  width: 100%;
  background: #191919;
  border-radius: 15px;
  color: white;
  font-size: 25px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  line-height: 52px;
  text-align: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  height: 48px;
  background: rgba(0, 0, 0, 0);
  border-radius: 8px;
  border-bottom: 1px solid #7F7F7F;
  padding: 0 8px;
  font-size: 23px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: 0.1px;
  color: black;
  text-align: center;

  &::placeholder {
    color: #BDBDBD;
  }
`;

const AddButton = styled.button`
  height: 48px;
  background: #191919;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 20px;
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
  border-bottom: 1px solid #7F7F7F;
  border-radius: 8px;
`;

const Word = styled.div`
  flex: 1;
  font-size: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  color: #BDBDBD;
`;

const Translation = styled.div`
  flex: 1;
  font-size: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  color: #BDBDBD;
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
    border: 1.5px solid #1E1E1E;
  }
`;
