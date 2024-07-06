import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css';

const Article = () => {
  const [article, setArticle] = useState(null);
  const [articleId, setArticleId] = useState('');

  useEffect(() => {
    if (articleId) {
      axios.get(`http://localhost:3001/articles/${articleId}`)
        .then(response => {
          setArticle(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the article!', error);
        });
    }
  }, [articleId]);

  const handleInputChange = (event) => {
    setArticleId(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Article Details</h1>
        <input 
          type="number" 
          value={articleId} 
          onChange={handleInputChange} 
          placeholder="Enter article ID"
        />
        {article && (
          <div className="article-details">
            <h2>{article.title}</h2>
            <p>{article.contents}</p>
            <p><strong>From:</strong> {article.from}</p>
            <p><strong>Author:</strong> {article.author}</p>
            <p><strong>Date:</strong> {article.date}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
        )}
      </header>
    </div>
  );
};

export default Article;