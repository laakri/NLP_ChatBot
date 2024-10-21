import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import toast from "react-hot-toast";
import { ChevronRight } from "lucide-react";
import SuggestionBox from "../components/SuggestionBox";
import ChatContainer from "../components/ChatContainer";
import InputFooter from "../components/InputFooter";
import StopSpeechButton from "../components/StopSpeechButton";
import EmotionInsights from "../components/EmotionInsights";
import Toast from "../components/Toast";
import ApiService from "../services/ApiService";
import { useEmotion } from "../EmotionContext";

const ContentWrapper = styled.div`
  width: 800px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 280px);
  padding: 1rem;
`;

const RecommendationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: white;

  border: none;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 16px 0;

  &:hover {
    background-color: var(--primary-color-dark);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
    color: white;
  }

  &:disabled {
    background-color: transparent;
    color: #a0a0a0;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  svg {
    margin-left: 8px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

interface Message {
  text: string;
  isUser: boolean;
  emotion?: string;
  emotionScores?: {
    anger: number;
    fear: number;
    joy: number;
    sadness: number;
  };
}

const ChatContent: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const { setCurrentEmotion } = useEmotion();

  useEffect(() => {
    if (chatId) {
      loadChatMessages(chatId);
    }
  }, [chatId]);

  const loadChatMessages = async (id: string) => {
    try {
      const chatMessages = await ApiService.getChatMessages(id);
      const formattedMessages = chatMessages.flatMap((msg) => [
        { text: msg.user_input, isUser: true },
        {
          text: msg.bot_response,
          isUser: false,
          emotion: msg.emotion,
        },
      ]);
      setMessages(formattedMessages);
      if (chatMessages.length > 0) {
        setCurrentEmotion(chatMessages[chatMessages.length - 1].emotion);
      }
    } catch (error) {
      console.error("Error loading chat messages:", error);
      toast.error("Failed to load chat messages. Please try again.");
    }
  };

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setShowSuggestions(false);
    setIsWaitingForResponse(true);
    const loadingToast = toast.loading("Sending message...");

    try {
      const response = await ApiService.sendMessage(message, chatId);
      setMessages((prev) => [
        ...prev,
        {
          text: response.response,
          isUser: false,
          emotion: response.emotion,
          emotionScores: response.emotion_scores,
        },
      ]);
      setCurrentEmotion(response.emotion);
      setIsSpeaking(true);
      ApiService.speakAIResponse(response.response, () => setIsSpeaking(false));
      toast.success("Message sent successfully", { id: loadingToast });

      if (!chatId) {
        navigate(`/chat/${response.chat_id}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, an error occurred. Please try again.", isUser: false },
      ]);
      toast.error("Failed to send message. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const handleStopSpeech = () => {
    ApiService.stopSpeech();
    setIsSpeaking(false);
    toast.success("Speech stopped");
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const emotionData = useMemo(() => {
    return messages
      .filter((msg) => !msg.isUser && msg.emotion)
      .map((msg) => ({
        emotion: msg.emotion!,
        emotionScores: msg.emotionScores,
      }));
  }, [messages]);

  const handleViewRecommendations = () => {
    if (chatId) {
      navigate(`/process_chat/${chatId}`);
    } else {
      toast.error("No active chat. Please start a conversation first.");
    }
  };

  return (
    <ContentWrapper>
      <Toast />
      {showSuggestions && (
        <SuggestionBox onSuggestionClick={handleSuggestionClick} />
      )}
      <ChatContainer messages={messages} isLoading={isWaitingForResponse} />
      <EmotionInsights emotionData={emotionData} />
      <RecommendationButton
        onClick={handleViewRecommendations}
        disabled={!chatId || messages.length === 0}
      >
        View Recommendations
        <ChevronRight size={20} />
      </RecommendationButton>
      <InputFooter onSendMessage={handleSendMessage} />
      <StopSpeechButton onStop={handleStopSpeech} isVisible={isSpeaking} />
    </ContentWrapper>
  );
};

export default ChatContent;
