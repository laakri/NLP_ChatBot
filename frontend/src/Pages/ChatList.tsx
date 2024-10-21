import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import ApiService from "../services/ApiService";

const ChatListWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const ChatItem = styled(Link)`
  display: block;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: var(--secondary-color);
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-color);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--primary-color);
    color: var(--bg-color);
  }
`;

const NewChatButton = styled(Link)`
  display: block;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: var(--primary-color);
  border-radius: 8px;
  text-decoration: none;
  color: var(--bg-color);
  text-align: center;
  font-weight: bold;
`;

const ChatList: React.FC = () => {
  const [chats, setChats] = useState<
    Array<{ id: string; last_updated: string }>
  >([]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const chatList = await ApiService.getChats();
      setChats(chatList);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  return (
    <ChatListWrapper>
      <NewChatButton to="/">Start New Chat</NewChatButton>
      {chats.map((chat) => (
        <ChatItem key={chat.id} to={`/chat/${chat.id}`}>
          Chat {chat.id.slice(0, 8)} - Last updated:{" "}
          {new Date(chat.last_updated).toLocaleString()}
        </ChatItem>
      ))}
    </ChatListWrapper>
  );
};

export default ChatList;
