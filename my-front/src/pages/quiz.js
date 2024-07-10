import React, { useState, useEffect, useRef } from 'react';
import { useNavigate,useParams,Link } from 'react-router-dom';
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
        <MainContent>
            <ResultsContainer>
              {words.map((word, index) => (
                <WordResult key={index}>
                  <EngWord><strong>{word.word}</strong></EngWord>
                  <KorWord><strong>{word.word_korean}</strong></KorWord>
                  <ResWord><div>{TFList[index] ? "Correct" : "Wrong"}</div></ResWord>
                </WordResult>
              ))}
            </ResultsContainer>
            <CenterContainer>
              <ResultCounts>
                <div>맞은 개수: {tfcounts.trueCount}</div>
                <div>틀린 개수: {tfcounts.falseCount}</div>
              </ResultCounts>
            <LinkButton to='/main'>End Quiz</LinkButton>
            </CenterContainer>
        </MainContent>
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
        <QuizSection>
          <QuizWord>{show_type ? words[index].word : words[index].word_korean}</QuizWord>
          <QuizButton onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? (show_type ? words[index].word_korean : words[index].word) : "Click to Check Answer"}
          </QuizButton>
          <AnswerInput placeholder="Fill in your Answer Here" ref={inputRef}/>
        </QuizSection>
        <ButtonGroup>
            <ResultButton correct onClick={() => { setIndex(index + 1); setShowAnswer(false); setTFList([...TFList, true]);inputRef.current.value=''; }}>Correct</ResultButton>
            <ResultButton onClick={() => { setIndex(index + 1); setShowAnswer(false); setTFList([...TFList, false]); inputRef.current.value=''; }}>Wrong</ResultButton>
          </ButtonGroup>
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
  background: #f0f0f0;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  flex: 3;
  width: 100%;
  max-width: 1920px;
  padding-left: 160px;
  padding-right: 160px;
  background-image: url(${QuizBackImage});
  background-size: cover; /* 배경 이미지 크기를 조절하여 요소를 덮도록 설정 */
  background-position: center; /* 배경 이미지의 위치를 중앙으로 설정 */
  background-repeat: no-repeat; /* 배경 이미지가 반복되지 않도록 설정 */
  box-sizing: border-box;
`;

const ArticleInfo = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  font-family: 'Avenir', sans-serif;
  letter-spacing: -1.2px;
`;

const Meta = styled.div`
  font-family: 'Maven Pro', sans-serif;
  letter-spacing: 0px;
  font-weight: 500;
  font-size: 1.17rem;
  margin-bottom: 1rem;
  justify-content: center;
  align-items: center;
`;

const Description = styled.div`
  font-size: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 0rem;
`;

const QuizSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 0px;
`;

const QuizWord = styled.div`
  min-width: 700px;
  background: rgba(247, 242, 250, 0.9);
  box-shadow: 0px 7px 15px rgba(0, 0, 0, 0.5);
  border-radius: 100px;
  text-align: center;
  color: black;
  font-size: 30px;
  font-weight: 600;
  font-family: 'Maven Pro', sans-serif;
  line-height: 28px;
  word-wrap: break-word;
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 0rem;
  padding-right: 0rem;
`;

const QuizButton = styled.button`
  min-width: 700px;
  background: transparent;
  border-radius: 100px;
  border-color: transparent;
  text-align: center;
  color: black;
  font-size: 30px;
  font-weight: 600;
  font-family: 'Maven Pro', sans-serif;
  line-height: 28px;
  word-wrap: break-word;
  margin: 0 0 0 0rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 0rem;
  padding-right: 0rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    transform: scale(1.05);
  }
`;

const AnswerInput = styled.input`
  min-width: 700px;
  margin-top: 0rem;
  margin-bottom: 4rem;
  margin-left: 0rem;
  margin-top: 0rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 0rem;
  padding-right: 0rem;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0px 7px 15px rgba(0, 0, 0, 0.1);
  border-radius: 100px;
  border-color: rgba(0, 0, 0, 0.02);
  text-align: center;
  color: black;
  font-size: 30px;
  font-weight: 600;
  font-family: 'Maven Pro', sans-serif;
  letter-spacing: -0.5px;
  word-wrap: break-word;
  &:focus {
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3rem;
  align-items: center;
  justify-content: center;
`;

const ResultButton = styled.button`
  width: 430px;
  height: 130px;
  background: ${props => props.correct ? 'rgba(255, 2, 2, 0.17)' : 'rgba(2, 2, 255, 0.17)'};
  box-shadow: 0px 7px 15px rgba(0, 0, 0, 0.25);
  border-color: transparent;
  border-radius: 100px;
  text-align: center;
  color: black;
  font-size: 40px;
  font-weight: 700;
  font-family: 'Maven Pro', sans-serif;
  font-size: 1.5rem;
  letter-spacing: -0.3px;
  word-wrap: break-word;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.01);
  }
`;

  const ResultsContainer = styled.div`
    width: 100%;
    height: 120%;
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 2rem; 
    padding: 20px;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
  `;

  const WordResult = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 1rem;
    padding-bottom: 1rem;
    gap: 1rem;
    background: rgba(247, 242, 250, 0.8);
    box-shadow: 0px 7px 15px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
    text-align: center;
    font-weight: 500;
    color: black;
  `;

  const EngWord = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: transparent;
    border-radius: 15px;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    font-family: 'Avenir', sans-serif;
    color: black;
  `;
  
  const KorWord = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: transparent;
    border-radius: 15px;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    font-family: 'Avenir', sans-serif;
    color: black;
  `;

  const ResWord = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: transparent;
    border-radius: 15px;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    font-family: 'Avenir', sans-serif;
    letter-spacing: -0.3px;
    color: ${props => (props.isCorrect ? '#a53f3b' : '#2e3b99')};
  `;

  const LinkButton = styled(Link)`
    flex-direction: column;
    display: inline-block;
    background: #f8f8f8;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 35px;
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 15px;
    padding-bottom: 15px;
    font-size: 27px;
    font-weight: 600;
    font-family: 'Avenir', sans-serif;
    color: #1e1e1e;
    text-decoration: none;
    align-self: center;
    justify-content: center;
    cursor: pointer; 
    &:hover { background: #e0e0e0; }
  `;

  const ResultCounts = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem; /* Adjust margin as needed */
    font-size: 25px;
    font-weight: 600;
    font-family: 'Maven Pro', sans-serif;
    color: black;
    gap: 0.7rem;
  `;

  const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
`;