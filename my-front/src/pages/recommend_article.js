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

  let { category } = useParams();
  //해당부분 post 변경으로 사용불가-> user_id는 localStorage에서 가져올수 있음.
  //const location = useLocation();
  //const queryParams = new URLSearchParams(location.search);
  //const userId = queryParams.get('kakao_id');
  const userId = localStorage.getItem('kakaoId');
  

  
  useEffect(() => {
    axios.post(`http://${backend_ip}:3001/article/random-article`,{kakao_id: userId, category: category})
      .then(response => {
        setRecommendedArticle(response.data);
      })
      .catch(error => {
        console.error('There was an error recommending an article!', error);
      });
  },[]);
  

  const handleNewWordChange = (event) => {
    setNewWord(event.target.value);
  };

  const handleAddWord = () => {
    if (recommendedArticle) {
      axios.post(`http://${backend_ip}:3001/words/word`,{ article_id: recommendedArticle.article_id, word: newWord})
        .then(response => {
          if (response.data.word) {
            setWords([...words, { word: newWord, word_korean:response.data.word_korean }]);
            setNewWord('');
          }
        })
        .catch(error => {
          console.error('There was an error adding the word!', error);
        });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {recommendedArticle && (
          <div className="recommended-article">
            <h2>{recommendedArticle.title}</h2>
            <p>{recommendedArticle.contents}</p>
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
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
    
  );
};

export default RecommendedArticle;