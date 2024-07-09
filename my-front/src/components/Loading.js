import React from 'react';
import axios from 'axios';
import '../styles/App.css';
import styled from 'styled-components';
import Spinner from '../assets/Loading.html';

export const Loading = () => {
  return (
    <Background>
        <LoadingText>Loading Contents ...</LoadingText>
        <img src={Spinner} alt="Loading" width="5%" />
    </Background>
  );
};
    
export default Loading;

const Background = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #ffffffb7;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.div`
  font: 1rem 'Avenir';
  text-align: center;
`;