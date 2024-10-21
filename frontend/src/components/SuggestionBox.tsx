import React from "react";
import styled from "@emotion/styled";

const SuggestionBoxContainer = styled.div`
  padding: 1.5rem;
  border-radius: 8px;
`;

const SuggestionButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const SuggestionButton = styled.button`
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--hover-color);
  }
`;

interface SuggestionBoxProps {
  onSuggestionClick: (message: string) => void;
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    "I'm feeling happy",
    "I'm feeling sad",
    "I'm feeling angry",
    "I'm feeling scared",
  ];

  return (
    <SuggestionBoxContainer>
      <h2 style={{ textAlign: "center" }}>How are you feeling today?</h2>
      <SuggestionButtons>
        {suggestions.map((suggestion, index) => (
          <SuggestionButton
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </SuggestionButton>
        ))}
      </SuggestionButtons>
    </SuggestionBoxContainer>
  );
};

export default SuggestionBox;
