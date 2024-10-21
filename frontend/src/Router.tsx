import React from "react";
import { Route, Routes } from "react-router-dom";
import ChatContent from "./Pages/ChatContent";
import HomePage from "./Pages/homepage";
import ChatList from "./Pages/ChatList";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import ProcessedChatRecommendation from "./Pages/ProcessedChatRecommendation";
import WebDevCourse from "./Presentation/WebDevCourse";

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chats" element={<ChatList />} />
      <Route
        path="/process_chat/:chatId"
        element={<ProcessedChatRecommendation />}
      />
      <Route path="/chat/:chatId?" element={<ChatContent />} />
      <Route path="/WebDevCourse" element={<WebDevCourse />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default Router;
