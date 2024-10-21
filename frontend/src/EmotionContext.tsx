import React, { createContext, useContext, useState, ReactNode } from "react";

type Emotion = "joy" | "sadness" | "anger" | "fear" | "neutral" | string;

interface EmotionContextType {
  currentEmotion: Emotion;
  setCurrentEmotion: (emotion: Emotion) => void;
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export const useEmotion = () => {
  const context = useContext(EmotionContext);
  if (context === undefined) {
    throw new Error("useEmotion must be used within an EmotionProvider");
  }
  return context;
};

export const EmotionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("neutral");

  return (
    <EmotionContext.Provider value={{ currentEmotion, setCurrentEmotion }}>
      {children}
    </EmotionContext.Provider>
  );
};
