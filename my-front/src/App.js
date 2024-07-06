import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [words, setWords] = useState([]);
  const [articleId, setArticleId] = useState('');

  useEffect(() => {
    if (articleId) {
      axios.get(`http://localhost:3001/words?article_id=${articleId}`)
        .then(response => {
          setWords(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the words!', error);
        });
    }
  }, [articleId]);

  const handleInputChange = (event) => {
    setArticleId(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wordbook</h1>
        <input 
          type="integer" 
          value={articleId} 
          onChange={handleInputChange} 
          placeholder="Enter article ID"
        />
        <div className="word-list">
          {words.map((word, index) => (
            <div key={index} className="word-item">
              <strong>{word.word}</strong>: {word.korean_word}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;