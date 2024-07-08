import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { backend_ip } from './constants.js';

import Header from '../components/header.js';


import politicsimg from '../assets/categoryImages/politics.png';
import businessimg from '../assets/categoryImages/business.png';
import economyimg from '../assets/categoryImages/economy.png';
import scienceimg from '../assets/categoryImages/science.png';
import healthimg from '../assets/categoryImages/health.png';
import lifestyleimg from '../assets/categoryImages/lifestyle.png';
import cultureimg from '../assets/categoryImages/culture.png';
import technologyimg from '../assets/categoryImages/technology.png'; // 각 카테고리의 이미지를 import하세요.

const categories = [
    { id: 1, name: 'Politics', image: politicsimg },
    { id: 2, name: 'Business', image: businessimg },
    { id: 3, name: 'Economy', image: economyimg },
    { id: 4, name: 'Science', image: scienceimg },
    { id: 5, name: 'Health', image: healthimg },
    { id: 6, name: 'Lifestyle', image: lifestyleimg },
    { id: 7, name: 'Culture', image: cultureimg },
    { id: 8, name: 'Technology', image: technologyimg },
  ];

  const Categories = ({ userId }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();
  
    const handleCategoryClick = (category) => {
      setSelectedCategories((prevSelected) => {
        if (prevSelected.includes(category)) {
          return prevSelected.filter((cat) => cat !== category);
        } else if (prevSelected.length < 4) {
          return [...prevSelected, category];
        } else {
          return prevSelected;
        }
      });
    };
    const kakaoId = localStorage.getItem('kakaoId');
    const handleSaveSelection = async () => {
      try {
        await Promise.all(
          selectedCategories.map((category, index) =>
            axios.post(`http://${backend_ip}:3001/user/update-category`, {
              user_id: kakaoId,
              category_number: index + 1,
              category_text: category.name,
            })
          )
        );
        alert('Categories updated successfully');
        navigate('/main');
      } catch (error) {
        console.error('There was an error updating the categories!', error);
        alert('Error updating categories');
      }
    };

    const handleLogout = () => {
        const logoutRedirectUri = `http://${backend_ip}:3001/kakao/logout/callback`;
        const logoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=17132d31284a95180bea1e6df5b24fb9&logout_redirect_uri=${logoutRedirectUri}`;
        localStorage.removeItem('kakaoId');
        window.location.href = logoutUrl;
      };
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const nickname = queryParams.get('nickname');
    const accessToken = queryParams.get('accessToken');

    return (
        <Container>
          <Header handleLogout={handleLogout} />
          <MainContent>
            <Title>Select your most interested article categories for recommendation</Title>
            <Subtitle>Start studying English by reading our recommended articles!</Subtitle>
            <CategoriesGrid>
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  selected={selectedCategories.includes(category)}
                >
                  <CategoryImage src={category.image} alt={category.name} />
                  <CategoryName>{category.name}</CategoryName>
                </CategoryCard>
              ))}
            </CategoriesGrid>
            <SelectedCategories>
              {selectedCategories.map((category) => (
                <SelectedCategory key={category.id}>{category.name}</SelectedCategory>
              ))}
            </SelectedCategories>
            <SaveButton onClick={handleSaveSelection}>Save Selection</SaveButton>
          </MainContent>
        </Container>
      );
    };
    
export default Categories;
    
// Styled Components
    
const Container = styled.div`
  min-height: 100vh;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
`;
    

const Logo = styled.img`
  width: 124px;
  height: 25px;
`;

const Nav = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  width: 83px;
  height: 32px;
  padding: 8px;
  background: #E3E3E3;
  border-radius: 8px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  
  &:hover {
    background: #d3d3d3;
  }
`;

const ButtonImage = styled.img`
  width: 100%;
  height: 100%;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
    
    const MainContent = styled.main`
      padding: 2rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;
    
    const Title = styled.h1`
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
      text-align: center;
    `;
    
    const Subtitle = styled.h2`
      font-size: 1.5rem;
      font-weight: normal;
      margin-bottom: 2rem;
      text-align: center;
    `;
    
    const CategoriesGrid = styled.div`
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    `;
    
    const CategoryCard = styled.div`
      background: ${(props) => (props.selected ? '#007bff' : 'white')};
      color: ${(props) => (props.selected ? 'white' : 'black')};
      border: ${(props) => (props.selected ? '2px solid #0056b3' : '1px solid #ccc')};
      border-radius: 0.25rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      transition: background 0.3s, color 0.3s, border 0.3s;
    `;
    
    const CategoryImage = styled.img`
      width: 100px;
      height: 100px;
      margin-bottom: 0.5rem;
    `;
    
    const CategoryName = styled.div`
      font-size: 1.25rem;
      font-weight: bold;
    `;
    
    const SelectedCategories = styled.div`
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    `;
    
    const SelectedCategory = styled.div`
      background: #007bff;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-size: 1rem;
    `;
    
    const SaveButton = styled.button`
      background: #007bff;
      color: white;
      padding: 1rem 2rem;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 1.25rem;
    
      &:hover {
        background: #0056b3;
      }
    `;
  