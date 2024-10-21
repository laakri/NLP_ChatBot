import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { BarChart2, X } from "lucide-react";

const InsightsContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  width: 350px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  svg {
    width: 24px;
    height: 24px;
    color: var(--text-color);
  }
`;

const InsightsContent = styled.div`
  color: var(--text-color);
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const ChartContainer = styled.div`
  height: 200px;
  margin-bottom: 20px;
`;

interface EmotionData {
  emotion: string;
  emotionScores?: {
    anger: number;
    fear: number;
    joy: number;
    sadness: number;
  };
}

interface EmotionInsightsProps {
  emotionData: EmotionData[];
}

const EmotionScoresChart: React.FC<{ data: EmotionData | undefined }> = ({
  data,
}) => {
  if (!data || !data.emotionScores) {
    return <div>You need to send a message to see emotion scores.</div>;
  }

  const chartData = Object.entries(data.emotionScores).map(
    ([emotion, score]) => ({
      emotion,
      score,
    })
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <XAxis dataKey="emotion" stroke="#FFFFFF" tick={{ fill: "#FFFFFF" }} />
        <YAxis stroke="#FFFFFF" tick={{ fill: "#FFFFFF" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            border: "none",
          }}
          labelStyle={{ color: "#FFFFFF" }}
          itemStyle={{ color: "#FFFFFF" }}
        />
        <Bar dataKey="score" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const EmotionInsights: React.FC<EmotionInsightsProps> = ({ emotionData }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [chartData, setChartData] = useState<
    Array<{ name: string; score: number }>
  >([]);

  const emotionToScore = (emotion: string): number => {
    const emotionScores: { [key: string]: number } = {
      joy: 1,
      sadness: -1,
      anger: -0.5,
      fear: -0.75,
      neutral: 0,
    };
    return emotionScores[emotion.toLowerCase()] || 0;
  };

  useEffect(() => {
    const data = emotionData.map((entry, index) => ({
      name: `Message ${index + 1}`,
      score: emotionToScore(entry.emotion),
    }));
    setChartData(data);
  }, [emotionData]);

  const toggleInsights = () => setIsOpen(!isOpen);

  return (
    <>
      <ToggleButton onClick={toggleInsights}>
        {isOpen ? <X /> : <BarChart2 />}
      </ToggleButton>
      {isOpen && (
        <InsightsContainer>
          <InsightsContent>
            <SectionTitle>Emotion History</SectionTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    stroke="#FFFFFF"
                    tick={{ fill: "#FFFFFF" }}
                  />
                  <YAxis
                    stroke="#FFFFFF"
                    tick={{ fill: "#FFFFFF" }}
                    domain={[-1, 1]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                    }}
                    labelStyle={{ color: "#FFFFFF" }}
                    itemStyle={{ color: "#FFFFFF" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    activeDot={{ r: 8, stroke: "#fff", strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <SectionTitle>Latest Emotion Scores</SectionTitle>
            <ChartContainer>
              <EmotionScoresChart data={emotionData[emotionData.length - 1]} />
            </ChartContainer>
          </InsightsContent>
        </InsightsContainer>
      )}
    </>
  );
};

export default EmotionInsights;
