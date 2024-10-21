import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import { User, LogIn, Menu, X, MessageSquare, ArrowRight } from "lucide-react";
import ApiService from "../services/ApiService";
import { useAuthStore } from "../store/authStore";
import { logout } from "../services/authService";

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  width: ${(props) => (props.isOpen ? "250px" : "0")};
  height: 100vh;
  background-color: rgba(6, 11, 18, 0.2);
  backdrop-filter: blur(10px);
  padding: ${(props) => (props.isOpen ? "1rem" : "0")};
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(134, 208, 219, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  overflow: hidden;
`;

const ProjectName = styled.h1`
  color: var(--primary-color);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ChatHistory = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin: 1rem 0;
  padding-right: 0.5rem;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const ChatItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  background-color: rgba(134, 208, 219, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  color: var(--text-color);

  &:hover {
    background-color: rgba(134, 208, 219, 0.2);
    transform: translateX(5px);
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const NewChatButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: var(--primary-color);
  color: var(--bg-color);
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    background-color: var(--hover-color);
    transform: translateY(-2px);
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const LoginSection = styled.div`
  margin-top: auto;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: rgba(134, 208, 219, 0.05);
  border-radius: 8px;
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: var(--bg-color);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.5s ease;
  font-weight: bold;
  width: 100%;

  &:hover {
    background-color: var(--hover-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(134, 208, 219, 0.1);
  }
`;

const LogoutButton = styled(LoginButton)`
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);

  &:hover {
    background-color: rgba(134, 208, 219, 0.1);
    color: var(--text-color);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: var(--text-color);
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  background-color: rgba(134, 208, 219, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1001;

  &:hover {
    background-color: rgba(134, 208, 219, 0.3);
  }

  svg {
    width: 24px;
    height: 24px;
    color: var(--text-color);
  }
`;

const ChatListLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: var(--text-color);

  &:hover {
    background-color: rgba(134, 208, 219, 0.2);
  }
`;

const UserEmail = styled.span`
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
`;

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<
    Array<{ id: string; last_updated: string }>
  >([]);
  const navigate = useNavigate();

  // Use the authStore
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useAuthStore();

  useEffect(() => {
    loadChats();
  }, []);

  // New useEffect to handle login state changes
  useEffect(() => {
    if (isLoggedIn && user) {
      loadChats();
    } else {
      setChats([]);
    }
  }, [isLoggedIn, user]);

  const loadChats = async () => {
    try {
      const chatList = await ApiService.getChats();
      setChats(chatList);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <ToggleButton onClick={toggleSidebar}>
        {isOpen ? <X /> : <Menu />}
      </ToggleButton>
      <SidebarContainer isOpen={isOpen}>
        <ProjectName>EchoSoul</ProjectName>

        <NewChatButton to="/" style={{ marginTop: "40px" }}>
          <MessageSquare size={18} />
          New Chat
        </NewChatButton>

        <ChatHistory>
          {chats.map((chat) => (
            <ChatItem key={chat.id} to={`/chat/${chat.id}`}>
              <MessageSquare size={18} />
              Chat {chat.id.slice(0, 8)}
            </ChatItem>
          ))}
          <ChatListLink to="/chats">
            <span>View All Chats</span>
            <ArrowRight size={18} />
          </ChatListLink>
        </ChatHistory>

        <LoginSection>
          {isLoggedIn && user ? (
            <>
              <UserInfo>
                <UserAvatar>
                  <User size={18} />
                </UserAvatar>
                <UserEmail>
                  {user.email ? user.email : "Default User"}
                </UserEmail>
              </UserInfo>
              <LogoutButton onClick={handleLogout}>
                <LogIn size={18} />
                <span style={{ marginLeft: "0.5rem" }}>Logout</span>
              </LogoutButton>
            </>
          ) : (
            <LoginButton onClick={handleLogin}>
              <LogIn size={18} />
              <span style={{ marginLeft: "0.5rem" }}>Login</span>
            </LoginButton>
          )}
        </LoginSection>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
