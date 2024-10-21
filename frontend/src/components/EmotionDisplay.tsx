import React from "react";
import styled from "@emotion/styled";
import { useEmotion } from "../EmotionContext";

const EmotionContainer = styled.div`
  display: flex;
  align-items: center;
  display: flex;
  justify-content: center;
  background-color: var(--background-color);
  border-radius: 8px;
  padding: 0.75rem 1rem;
`;

const EmotionLabel = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-right: 0.5rem;
`;

const EmotionValue = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-color);
`;

const EmotionIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.75rem;
`;

const EmotionDisplay: React.FC = () => {
  const { currentEmotion } = useEmotion();

  const getEmotionIcon = (emotion: string) => {
    const emotionIcons: { [key: string]: string } = {
      joy: "😊",
      sad: "😢",
      anger: "😠",
      fear: "😐",
    };
    return emotionIcons[emotion.toLowerCase()] || "🤔";
  };

  return (
    <EmotionContainer>
      <EmotionIcon>{getEmotionIcon(currentEmotion)}</EmotionIcon>
      <EmotionLabel>Current emotion:</EmotionLabel>
      <EmotionValue>{currentEmotion}</EmotionValue>
    </EmotionContainer>
  );
};

export default EmotionDisplay;
