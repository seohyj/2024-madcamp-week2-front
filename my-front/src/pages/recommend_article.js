import React, { useState, useEffect } from 'react';
import { useLocation,useParams } from 'react-router-dom';
import {backend_ip} from './constants.js';
import axios from 'axios';
import '../styles/App.css';


const ListItem = ({ item }) => (
  <div>
    <h3>{item.word}</h3>
    <p>{item.word_korean}</p>
  </div>
);

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
    return <div>로딩중</div>;
  }
  return (
    <div className="App">
      <header className="App-header">
        {recommendedArticle && (
          <div className="recommended-article">
            <h2>{recommendedArticle.title}</h2>
            <p>{recommendedArticle.contents}</p>
            <p>{recommendedArticle.category}</p>
            <p><strong>Author:</strong> {recommendedArticle.author}</p>
            <p><strong>Date:</strong> {recommendedArticle.date}</p>
          </div>
        )}
        <div className="sidebar">
          <h2>Word List</h2>
          <div className="input-group">
            <input
              type="text"
              value={newWord}
              onChange={handleNewWordChange}
              placeholder='Enter new word'
            />
            <button onClick={handleAddWord}>Enter button</button>
          </div>
          <div className="word-list">
            {words.map((word, index) => (
              <div key={index} className="word-item">
                <strong>{word.word}</strong>
                <strong>{word.word_korean}</strong>
                <button onClick={() => handleDeleteWord(word.word_id)}>삭제</button>
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
    
  );
};

export default RecommendedArticle;