import React from "react";
import AppContent from "./AppContent";
import { EmotionProvider } from "./EmotionContext";
import { BrowserRouter } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <EmotionProvider>
        <AppContent />
      </EmotionProvider>
    </BrowserRouter>
  );
};

export default App;
