import React, { useState, useEffect } from 'react';
import { useNavigate,useParams,Link } from 'react-router-dom';
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

const QuizView = () => {
  const [articleDetails, setArticleDetails] = useState({});
  const [words, setWords] = useState([]);
  const [TFList,setTFList] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();
  let { articleId, quizType } = useParams();
  const show_type = (quizType==='KOR') ? 1 : 0; //1이면 영어를 0이면 한글을 default로 보여줌
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
  }, []);

  useEffect(()=>{
    if(articleDetails.title!==null||articleDetails.title!==undefined){
      axios.get(`http://${backend_ip}:3001/words/words`,{params:{article_id: articleId}})
        .then(response => {
          setWords(response.data);
        })
        .catch(error => {
          console.error('There was an error recommending an article!', error);
        });
    }
  },[articleDetails])

  if(words.length===0){
    return <div>there are no words</div>;
  }
  if(index>=words.length){ //퀴즈 끝난 부분 구현
    return(
        <Container>
            {words.map((word, index) => (
              <div key={index} className="word-item">
                <strong>{word.word}</strong>
                <strong>{word.word_korean}</strong>
                <div>{TFList[index] ? "true" : "false"}</div>
              </div>
            ))}
            <Link to='/main'>end quiz</Link>
        </Container>
    );
  }

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
        <div>{show_type? words[index].word:words[index].word_korean}</div> 
        <button onClick={()=>showAnswer? setShowAnswer(false) :setShowAnswer(true)}>
            {showAnswer?  (show_type? words[index].word_korean:words[index].word) :"click to answer"}</button>
        <input></input>
        <button onClick={()=>{setIndex((index)=>index+1); setShowAnswer(false);setTFList((prevTF) => [...prevTF, true]);}}>set correct</button>
        <button onClick={()=>{setIndex((index)=>index+1); setShowAnswer(false);setTFList((prevTF) => [...prevTF, false]);}}>set false</button>
      </MainContent>
    </Container>
  );
};

export default QuizView;

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