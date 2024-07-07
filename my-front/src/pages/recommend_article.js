import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {backend_ip} from './constants.js';
import axios from 'axios';
import '../styles/App.css';
const RecommendedArticle = () => {
  const [recommendedArticle, setRecommendedArticle] = useState(null);
  const [newWord, setNewWord] = useState('');
  const [words, setWords] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('kakao_id');
  
  useEffect(() => {
    axios.get(`http://${backend_ip}:3001/random-article?kakao_id=${userId}`)
      .then(response => {
        setRecommendedArticle(response.data);
      })
      .catch(error => {
        console.error('There was an error recommending an article!', error);
      });
  }, [userId]);

  const handleNewWordChange = (event) => {
    setNewWord(event.target.value);
  };

  const handleAddWord = () => {
    if (recommendedArticle) {
      axios.get(`http://${backend_ip}:3001/word?article_id=${recommendedArticle.article_id}&word=${newWord}`)
        .then(response => {
          if (response.data.success) {
            setWords([...words, { word: newWord }]);
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
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
};

export default RecommendedArticle;