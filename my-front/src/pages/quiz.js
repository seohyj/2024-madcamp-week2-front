import React, { useState, useEffect, useRef } from 'react';
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
    margin: 0;
    padding: 0;
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
  
  const inputRef =useRef(null);
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

  if(words.length === 0){
    return <div>There are no words for Quiz.</div>;
  }
  if(index >= words.length){ //퀴즈 끝난 부분 구현
    const countTrueFalse = (TFList) => {
      let trueCount = 0;
      let falseCount = 0;
    
      TFList.forEach((value) => {
        if (value === true) {
          trueCount++;
        } else if (value === false) {
          falseCount++;
        }
      });
    
      return { trueCount, falseCount };
    };
    const tfcounts = countTrueFalse(TFList);    
    return(
      <Container>
        <Header />
        <GlobalStyle />
        <MainContent style={{ backgroundImage: 'url("이미지 경로 삽입")' }}>
          <ResultsContainer>
            <div>맞은 개수 : {tfcounts.trueCount}</div>
            <div>틀린 개수 : {tfcounts.falseCount}</div>
            {words.map((word, index) => (
              <WordResult key={index}>
                <strong>{word.word}</strong>
                <strong>{word.word_korean}</strong>
                <div>{TFList[index] ? "Correct" : "Wrong"}</div>
              </WordResult>
            ))}
          </ResultsContainer>
          <LinkButton to='/main'>End Quiz</LinkButton>
        </MainContent>
    </Container>
    );
  }

  return (
    <Container>
      <GlobalStyle />
      <Header />
      <MainContent style={{ backgroundImage: 'url("이미지 경로 삽입")' }}>
        <ArticleInfo>
          <Title>{articleDetails.title || 'Article Title'}</Title>
          <Meta>
            <Author>By: {articleDetails.author || 'Author'}</Author>
            <Date>Date: {articleDetails.date || '2024-00-00'}</Date>
          </Meta>
          <Description>Take a Quiz and Boost up your English!</Description>
        </ArticleInfo>
        <QuizSection>
          <QuizWord>{show_type ? words[index].word : words[index].word_korean}</QuizWord>
          <QuizButton onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? (show_type ? words[index].word_korean : words[index].word) : "Click to see the answer"}
          </QuizButton>
          <AnswerInput placeholder="Fill in your Answer Here" ref={inputRef} />
          <ButtonGroup>
            <ResultButton correct onClick={() => { setIndex(index + 1); setShowAnswer(false); setTFList([...TFList, true]); inputRef.current.value=''; }}>Correct</ResultButton>
            <ResultButton onClick={() => { setIndex(index + 1); setShowAnswer(false); setTFList([...TFList, false]); inputRef.current.value=''; }}>Wrong</ResultButton>
          </ButtonGroup>
        </QuizSection>
      </MainContent>
    </Container>
  );
};

export default QuizView;

// Styled Components

const Container = styled.div`
  min-height: 100vh;
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
  background-size: cover;
  background-repeat: no-repeat;
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
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 43px;
  margin-bottom: 1rem;
`;

const Author = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: black;
  font-family: 'Maven Pro', sans-serif;
  line-height: 52px;
  word-wrap: break-word;
`;

const Date = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: black;
  font-family: 'Maven Pro', sans-serif;
  line-height: 52px;
  word-wrap: break-word;
`;

const Description = styled.div`
  font-size: 27px;
  font-weight: 400;
  color: black;
  font-family: 'Poppins', sans-serif;
  line-height: 25px;
  word-wrap: break-word;
  opacity: 0.8;
`;

const QuizSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  margin-top: 30px;
`;

const QuizWord = styled.div`
  width: 700px;
  background: rgba(247, 242, 250, 0.9);
  box-shadow: 0px 7px 15px rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  text-align: center;
  color: black;
  font-size: 50px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  line-height: 28px;
  word-wrap: break-word;
  padding: 30px 0;
`;

const QuizButton = styled.button`
  width: 100%;
  height: 130px;
  background: rgba(247, 242, 250, 0.9);
  box-shadow: 0px 7px 15px rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  text-align: center;
  color: black;
  font-size: 30px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  line-height: 28px;
  word-wrap: break-word;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    transform: scale(1.05);
  }
`;

const AnswerInput = styled.input`
  width: 100%;
  height: 130px;
  background: rgba(247, 242, 250, 0.9);
  box-shadow: 0px 7px 15px rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  text-align: center;
  color: black;
  font-size: 30px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  line-height: 28px;
  word-wrap: break-word;
  padding: 0 20px;
  &:focus {
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 45px;
`;

const ResultButton = styled.button`
  width: 100%;
  height: 130px;
  background: ${props => props.correct ? '#C8E4E3' : '#AFC6DE'};
  box-shadow: 0px 7px 15px rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  text-align: center;
  color: black;
  font-size: 30px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  line-height: 28px;
  word-wrap: break-word;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }
`;

  const ResultsContainer = styled.div`
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 20px; 
    padding: 20px;
  `;

  const WordResult = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(247, 242, 250, 0.9);
    box-shadow: 0px 7px 15px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    font-size: 20px;
    font-family: 'Poppins', sans-serif;
    color: black;
  `;

  const LinkButton = styled(Link)`
    display: inline-block;
    background: #f8f8f8;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 30px;
    padding: 15px 30px;
    font-size: 30px;
    font-family: 'Poppins', sans-serif;
    color: #1e1e1e;
    text-decoration: none;
    margin-top: 20px;
    cursor: pointer; 
    &:hover { background: #e0e0e0; }
  `;