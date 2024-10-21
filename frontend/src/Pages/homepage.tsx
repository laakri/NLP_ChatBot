import React, { useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import SuggestionBox from "../components/SuggestionBox";
import InputFooter from "../components/InputFooter";
import ApiService from "../services/ApiService";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const HomePageWrapper = styled.div`
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: calc(100vh - 280px);
  padding: 2rem;
`;

const WelcomeMessage = styled.h2`
  font-size: 2rem;
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 2rem;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const handleSendMessage = async (message: string) => {
    setIsCreatingChat(true);
    try {
      const response = await toast.promise(
        ApiService.sendMessage(message),
        {
          loading: "Creating new chat...",
          success: "New chat created!",
          error: "Failed to create chat",
        },
        {
          style: {
            minWidth: "250px",
          },
        }
      );
      navigate(`/chat/${response.chat_id}`, {
        state: { initialMessage: message },
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <HomePageWrapper>
      <div>
        <WelcomeMessage>
          Welcome to EchoSoul. What's on your mind?
        </WelcomeMessage>
        <SuggestionBox onSuggestionClick={handleSuggestionClick} />
      </div>
      <InputFooter onSendMessage={handleSendMessage} />
      {isCreatingChat && (
        <LoadingOverlay>
          <Loader size={48} color="var(--primary-color)" />
        </LoadingOverlay>
      )}
    </HomePageWrapper>
  );
};

export default HomePage;
