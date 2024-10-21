import React, { useEffect, useState, useMemo } from "react";
import styled from "@emotion/styled";
import { useEmotion } from "../EmotionContext";

const ParticleContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`;

interface ParticleProps {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  amplitude: number;
  direction: number;
}

const Particle = styled.div<ParticleProps>`
  position: absolute;
  left: ${(props) => props.x}%;
  top: ${(props) => props.y}%;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  opacity: 0.5;
  transition: all 0.5s ease;
  animation: float-${(props) => props.direction} ${(props) => props.speed}s infinite
    alternate;

  @keyframes float-1 {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    100% {
      transform: translate(
          ${(props) => props.amplitude}px,
          ${(props) => props.amplitude}px
        )
        rotate(360deg);
    }
  }

  @keyframes float-2 {
    0% {
      transform: translate(0, 0) scale(1);
    }
    100% {
      transform: translate(
          -${(props) => props.amplitude}px,
          ${(props) => props.amplitude}px
        )
        scale(1.5);
    }
  }

  @keyframes float-3 {
    0% {
      transform: translate(0, 0) skew(0deg);
    }
    100% {
      transform: translate(
          ${(props) => props.amplitude}px,
          -${(props) => props.amplitude}px
        )
        skew(10deg);
    }
  }
`;

const getEmotionConfig = (emotion: string) => {
  switch (emotion) {
    case "joy":
      return {
        colors: ["#FFD700", "#FFA500", "#FF4500", "#FF6347", "#FF8C00"],
        speedRange: [3, 6],
        amplitudeRange: [30, 50],
      };
    case "sadness":
      return {
        colors: ["#4682B4", "#1E90FF", "#87CEEB", "#6495ED", "#B0E0E6"],
        speedRange: [8, 12],
        amplitudeRange: [10, 20],
      };
    case "anger":
      return {
        colors: ["#FF0000", "#FF4500", "#FF6347", "#DC143C", "#B22222"],
        speedRange: [1, 3],
        amplitudeRange: [40, 60],
      };
    case "fear":
      return {
        colors: ["#800080", "#8A2BE2", "#9400D3", "#9932CC", "#BA55D3"],
        speedRange: [5, 8],
        amplitudeRange: [20, 40],
      };
    default:
      return {
        colors: ["#FFFFFF", "#F0F0F0", "#E0E0E0", "#D3D3D3", "#C0C0C0"],
        speedRange: [4, 8],
        amplitudeRange: [15, 35],
      };
  }
};

const FloatingParticles: React.FC = () => {
  const { currentEmotion } = useEmotion();
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const particleCount = 50; // Increased particle count

  const generateParticles = useMemo(
    () => (config: ReturnType<typeof getEmotionConfig>) => {
      return Array.from({ length: particleCount }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 2,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        speed:
          Math.random() * (config.speedRange[1] - config.speedRange[0]) +
          config.speedRange[0],
        amplitude:
          Math.random() *
            (config.amplitudeRange[1] - config.amplitudeRange[0]) +
          config.amplitudeRange[0],
        direction: Math.floor(Math.random() * 3) + 1,
      }));
    },
    [particleCount]
  );

  useEffect(() => {
    const config = getEmotionConfig(currentEmotion);
    setParticles(generateParticles(config));
  }, [currentEmotion, generateParticles]);

  return (
    <ParticleContainer>
      {particles.map((particle, index) => (
        <Particle key={index} {...particle} />
      ))}
    </ParticleContainer>
  );
};

export default FloatingParticles;
