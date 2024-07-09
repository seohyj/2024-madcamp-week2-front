import React, { useState, useEffect } from 'react';
import { useLocation,useParams,Link } from 'react-router-dom';
import {backend_ip} from './constants.js';
import axios from 'axios';
import '../styles/App.css';
const articles = [
    { id: 1, title: "Article Title" },
    { id: 2, title: "Article Title" },
    { id: 3, title: "Article Title" },
    { id: 4, title: "Article Title" },
    { id: 5, title: "Article Title" },
    { id: 6, title: "Article Title" }
];
const userId = localStorage.getItem('kakaoId');
const ArticlelistView = () => {
  const [readArticles, setReadArticles] = useState([]);

  const handleDeleteArticle = (article_id)=>{
    
    axios.delete(`http://${backend_ip}:3001/article/delete-article`,{params:{article_id: article_id}})
      .then(response => {
        setReadArticles((prevArticles) => prevArticles.filter((article) => article.article_id !== article_id));
      })
      .catch(error => {
        console.error('There was an error adding the word!', error);
      });
  }
  
  
  useEffect(() => {
    if(userId!==''){
      axios.get(`http://${backend_ip}:3001/article/articles`,{params: {user_id: userId}})
      .then(response => {
        setReadArticles(response.data);
        console.log(readArticles);
      })
      .catch(error => {
        console.error('There was an error recommending an article!', error);
      });
    }
    
  },[]);


  return (
    <div className="article-list">
        {readArticles.map((article) => (
            <div className="article-item" key={article.id}>
                <div className="article-content">
                    <h3>{article.title}</h3>
                    <Link to={`/article-study/${article.article_id}`}>View Vocab Lists from this Article</Link>
                    <div>     </div>
                    <Link to={`/take-quiz/${article.article_id}`}>Take Quiz with the words you studied</Link>
                </div>
                <button className="delete-button" onClick={() => handleDeleteArticle(article.article_id)}>삭제</button>
            </div>
        ))}
    </div>

  );
};

export default ArticlelistView;