import React, { useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { signUp } from "../services/authService";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const SignUpContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.1);

  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  margin: 2rem auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: var(--text-color);
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  font-size: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SubmitButton = styled.button`
  background-color: var(--accent-color);
  color: var(--text-color);
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--accent-color-hover);
  }
`;

const LoginPrompt = styled.p`
  color: var(--text-color);
  text-align: center;
  margin-top: 1rem;
`;

const LoginLink = styled.span`
  color: var(--accent-color);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

interface SignUpProps {
  onSwitchToLogin?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const signUpPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const firebaseUser = await signUp(email, password);
        setIsLoggedIn(true);
        setUser(firebaseUser);
        resolve();
        navigate("/");
      } catch (error) {
        console.error("Sign up error:", error);
        reject(error);
      }
    });

    toast.promise(
      signUpPromise,
      {
        loading: "Signing up...",
        success: "Sign up successful!",
        error: (err) => `Sign up failed: ${err.message || "Please try again"}`,
      },
      {
        style: {
          minWidth: "250px",
        },
        success: {
          duration: 5000,
          icon: "🎉",
        },
        error: {
          duration: 5000,
          icon: "❌",
        },
      }
    );
  };

  const handleSwitchToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      navigate("/login");
    }
  };

  return (
    <SignUpContainer>
      <Title>Sign Up</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <SubmitButton type="submit">Sign Up</SubmitButton>
      </Form>
      <LoginPrompt>
        Already have an account?{" "}
        <LoginLink onClick={handleSwitchToLogin}>Login</LoginLink>
      </LoginPrompt>
    </SignUpContainer>
  );
};

export default SignUp;
