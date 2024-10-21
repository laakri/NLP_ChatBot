import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { GlobalStyles } from "./styles/GlobalStyles";
import Header from "./components/Header";
import SuggestionBox from "./components/SuggestionBox";
import ChatContainer from "./components/ChatContainer";
import InputFooter from "./components/InputFooter";
import FloatingParticles from "./components/FloatingParticles";
import ApiService from "./services/ApiService";
import StopSpeechButton from "./components/StopSpeechButton";
import { useEmotion } from "./EmotionContext";
import Sidebar from "./components/Sidebar";
import Router from "./Router";

const AppContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  min-width: 320px;
  padding: 2rem;
  border-radius: 10px;
  transition: background-color 0.5s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 90vh;
`;
const MainContent = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;
const AppContent: React.FC = () => {
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false); // New state
  const { currentEmotion, setCurrentEmotion } = useEmotion();

  const emotionColors = {
    joy: "#3a3a0a",
    sadness: "#1a3a4a",
    anger: "#3a1a1a",
    fear: "#2a1a3a",
    neutral: "#061118",
  };
  useEffect(() => {
    const color =
      emotionColors[currentEmotion as keyof typeof emotionColors] ||
      emotionColors.neutral;
    document.body.style.background = `linear-gradient(to top, #061118, ${color})`;
  }, [currentEmotion]);

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setIsWaitingForResponse(true); // Set to true when sending a message
    try {
      const response = await ApiService.sendMessage(message);
      setMessages((prev) => [
        ...prev,
        { text: response.response, isUser: false },
      ]);
      setCurrentEmotion(response.emotion);
      setIsSpeaking(true);
      ApiService.speakAIResponse(response.response, () => setIsSpeaking(false));
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsWaitingForResponse(false); // Set to false when response is received or error occurs
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
    setShowSuggestions(false);
  };

  const handleStopSpeech = () => {
    ApiService.stopSpeech();
    setIsSpeaking(false);
  };

  return (
    <>
      <GlobalStyles />
      <FloatingParticles />
      <MainContent>
        <AppContainer>
          <Header />
          <Sidebar />
          <Router />
        </AppContainer>
      </MainContent>
    </>
  );
};

export default AppContent;
