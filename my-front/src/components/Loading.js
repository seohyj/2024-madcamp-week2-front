import React from 'react';
import styled from 'styled-components';
import '../assets/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <Background>
      <LoadingText>Loading Contents ...</LoadingText>
      <div className="loadingio-spinner-spinner-nq4q5u6dq7r">
        <div className="ldio-x2uulkbinbj">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </Background>
  );
};

export default LoadingSpinner;

const Background = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.div`
  font: 2rem 'Avenir';
  font-weight: 500;
  text-align: center;
  letter-spacing: -0.7px;
`;