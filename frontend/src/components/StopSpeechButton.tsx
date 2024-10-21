import React from "react";
import styled from "@emotion/styled";

const StopButton = styled.button`
  position: fixed;
  right: 20px;
  bottom: 80px;
  background-color: #f42548;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  z-index: 1000;
`;

const PulseAnimation = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #86d0db;
  margin-right: 10px;
  animation: pulse 1s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

interface StopSpeechButtonProps {
  onStop: () => void;
  isVisible: boolean;
}

const StopSpeechButton: React.FC<StopSpeechButtonProps> = ({
  onStop,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <StopButton onClick={onStop}>
      <PulseAnimation />
      Stop
    </StopButton>
  );
};

export default StopSpeechButton;
