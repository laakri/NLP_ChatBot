import React from "react";
import styled from "@emotion/styled";
import { Link, useLocation } from "react-router-dom";
import EmotionDisplay from "./EmotionDisplay";

const HeaderContainer = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  animation: fadeInDown 1s ease-out;
  transition: transform 0.5s ease, opacity 0.5s ease;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const TitleLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin: 0;
  transition: color 0.3s ease;

  &:hover {
    color: var(--hover-color);
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--soft-text-color);
  margin: 0.5rem 0 0;
`;

const Header: React.FC = () => {
  const location = useLocation();
  const isChatRoute = location.pathname.startsWith("/chat/");

  return (
    <HeaderContainer>
      <TitleLink to="/">
        <Title>EchoSoul</Title>
      </TitleLink>
      <Subtitle>Explore your inner world through poetic dialogue</Subtitle>
      {isChatRoute && <EmotionDisplay />}
    </HeaderContainer>
  );
};

export default Header;
