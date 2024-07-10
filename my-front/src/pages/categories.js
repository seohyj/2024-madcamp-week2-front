import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { backend_ip } from './constants.js';

import Header from '../components/header.js';


import politicsimg from '../assets/categorysquares/politicssquare.png';
import businessimg from '../assets/categorysquares/businesssquare.png';
import economyimg from '../assets/categorysquares/economysquare.png';
import scienceimg from '../assets/categorysquares/sciencesquare.png';
import healthimg from '../assets/categorysquares/healthsquare.png';
import lifestyleimg from '../assets/categorysquares/lifestylesquare.png';
import cultureimg from '../assets/categorysquares/culturesquare.png';
import technologyimg from '../assets/categorysquares/technologysquare.png'; // 각 카테고리의 이미지를 import하세요.
import BackgrndImg from '../assets/backgrndimg.png';

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
          <TitleContainer>
            <Title>Select your most interested article categories for recommendation</Title>
            <Subtitle>Start studying English by reading our recommended articles!</Subtitle>
          </TitleContainer>
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

const TitleContainer = styled.div`
  max-width: 1600px;
  height: 100%;
  padding-top: 3px;
  padding-bottom: 3px;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  gap: 5px;
`;

const MainContent = styled.main`
  padding: 1em;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${BackgrndImg}); /* 배경 이미지 추가 */
  background-size: cover; /* 배경 이미지가 컨테이너를 덮도록 설정 */
  background-position: center; /* 배경 이미지 위치 설정 */
`;

// select your ...
const Title = styled.h1`
    margin: 0 0 0 0rem;
    padding: 0 0 0 0rem;
    color: black;
    font-size: 50px;
    letter-spacing: -2.3px;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    line-height: 52px;
    word-wrap: break-word;
    text-align: left;
`;

// start studying ...
const Subtitle = styled.h2`
    opacity: 0.80;
    color: black;
    font-size: 27px;
    letter-spacing: -1px;
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    line-height: 25px;
    word-wrap: break-word;
    text-align: left;
`;

// 4*2 Grid
const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryCard = styled.div`
  background: #f7f2fa;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  //background: ${(props) => (props.selected ? '#f7f2fa' : 'transparent')};
  border: ${(props) => (props.selected ? ' #f7f2fa' : 'none')};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column; /* Flex direction set to column */
  align-items: center;    /* Center items horizontally */
  justify-content: center; /* Center items vertically */
  padding: 0.5px;
  align-items: center;
  justify-items: center;
  transition: background 0.3s, border 0.3s;
  position: relative;
  width: 366px;   /* Ensure the card has the desired width */
  height: 290px;  /* Ensure the card has the desired height */

  &:hover {
    background: #bfb7d3;
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
`;

const CategoryName = styled.div`
  position: absolute;
  top: 8px;
  left: 15px;
  background: rgba(0, 0, 0, 0);
  color: black;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 1.3rem;
  font-family: Avenir;
  font-weight: bold;
`;

const SelectedCategories = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SelectedCategory = styled.div`
  background: #e3dbe8;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: bold;
  font-family: Avenir;
`;

const SaveButton = styled.button`
  width: 349px;
  height: 59px;
  padding: 8px;
  background: #F8F8F8;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  border-color: rgba(0, 0, 0, 0);
  overflow: hidden;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: #1e1e1e;
  font-size: 1.5rem;
  font-family: Avenir;
  font-weight: 500;

  &:hover {
    background: #bfb7d3;
  }
`;