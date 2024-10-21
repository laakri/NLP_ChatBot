import React, { useState } from "react";
import styled from "@emotion/styled";
import StopSpeechButton from "./StopSpeechButton";
import ApiService from "../services/ApiService";
import ReactMarkdown from "react-markdown";

const ChatWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const MessageBubble = styled.div<{ isUser: boolean; isReading: boolean }>`
  max-width: 70%;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  background-color: ${(props) =>
    props.isUser ? "var(--primary-color)" : "var(--secondary-color)"};

  color: ${(props) => (props.isUser ? "var(--bg-color)" : "var(--text-color)")};

  ${(props) =>
    props.isReading &&
    `
    box-shadow: 0 0 10px var(--primary-color);
    animation: pulse 1s infinite;
  `}

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--primary-color);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
  }
`;

const ReadButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  margin-left: 0.5rem;
  font-size: 0.8rem;
`;

const SkeletonBubble = styled.div`
  width: 70%;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  align-self: flex-start;
  background-color: var(--secondary-color);
  opacity: 0.7;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.7;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 0.7;
    }
  }
`;

const MarkdownContent = styled.div`
  p {
    margin-bottom: 0.5rem;
  }

  ul {
    margin-left: 1rem;
    margin-bottom: 0.5rem;
  }

  strong {
    font-weight: bold;
  }
`;

interface ChatContainerProps {
  messages: Array<{ text: string; isUser: boolean }>;
  isLoading: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
}) => {
  const [readingIndex, setReadingIndex] = useState<number | null>(null);

  const handleRead = (index: number) => {
    if (readingIndex !== null) {
      ApiService.stopSpeech();
    }
    setReadingIndex(index);
    ApiService.speakAIResponse(messages[index].text, () =>
      setReadingIndex(null)
    );
  };

  const handleStopSpeech = () => {
    ApiService.stopSpeech();
    setReadingIndex(null);
  };

  const renderMessage = (text: string) => {
    return (
      <MarkdownContent>
        <ReactMarkdown>{text}</ReactMarkdown>
      </MarkdownContent>
    );
  };

  return (
    <ChatWrapper>
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          isUser={message.isUser}
          isReading={index === readingIndex}
        >
          {renderMessage(message.text)}
          {!message.isUser && (
            <ReadButton onClick={() => handleRead(index)}>
              {index === readingIndex ? "Reading..." : "Read"}
            </ReadButton>
          )}
        </MessageBubble>
      ))}
      {isLoading && (
        <SkeletonBubble>
          <div style={{ width: "200px", height: "20px" }}></div>
          <div
            style={{ width: "150px", height: "20px", marginTop: "10px" }}
          ></div>
        </SkeletonBubble>
      )}
      <StopSpeechButton
        onStop={handleStopSpeech}
        isVisible={readingIndex !== null}
      />
    </ChatWrapper>
  );
};

export default ChatContainer;
