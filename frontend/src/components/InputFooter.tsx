import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import ApiService from "../services/ApiService";
import { Mic, Square } from "lucide-react";

const InputFooterWrapper = styled.div`
  width: 100%;
  padding: 1rem 0;
  position: relative;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex-grow: 1;
  height: 1.8rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--primary-color);
  border-radius: 2rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: var(--bg-color);
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  margin-left: 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface MicButtonProps {
  isRecording: boolean;
}

const MicButton = styled.button<MicButtonProps>`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
  position: absolute;
  right: 3.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => (props.isRecording ? "red" : "var(--primary-color)")};
`;

interface InputFooterProps {
  onSendMessage: (message: string) => void;
}

const InputFooter: React.FC<InputFooterProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      ApiService.stopListening();
      setIsRecording(false);
    } else {
      ApiService.startListening();
      setIsRecording(true);
    }
  };

  // Add this useEffect to handle the speech recognition results
  React.useEffect(() => {
    const handleSpeechResult = (transcript: string) => {
      setInput((prevInput) => prevInput + " " + transcript);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    ApiService.setSpeechResultCallback(handleSpeechResult);

    return () => {
      ApiService.removeSpeechResultCallback();
    };
  }, []);

  return (
    <InputFooterWrapper>
      <Form onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <MicButton
          type="button"
          onClick={handleMicClick}
          isRecording={isRecording}
        >
          {isRecording ? <Square size={20} /> : <Mic size={20} />}
        </MicButton>
        <SubmitButton type="submit">➤</SubmitButton>
      </Form>
    </InputFooterWrapper>
  );
};

export default InputFooter;
