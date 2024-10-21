import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Film,
  Book,
  Coffee,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: var(--text-color);
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: var(--primary-color);
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: var(--soft-text-color);
  font-size: 1.2rem;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(134, 208, 219, 0.1);
  border-left: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmotionSummary = styled.div`
  background-color: rgba(134, 208, 219, 0.1);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const EmotionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const EmotionText = styled.p`
  line-height: 1.6;
`;

const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const RecommendationCard = styled(motion.div)`
  background-color: var(--bg-color);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

const RecommendationTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--primary-color);
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--soft-color);
`;

const RecommendationList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const RecommendationItem = styled.li`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: var(--text-color);
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary-color);
    transform: translateX(5px);
  }

  &::before {
    content: "•";
    color: var(--primary-color);
    font-size: 1.5rem;
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: var(--soft-color);

  &:hover {
    background-color: var(--primary-color);
    color: var(--bg-color);
  }
`;

interface Recommendation {
  emotion_summary: string;
  music_recommendations: string[];
  movie_recommendations: string[];
  book_recommendations: string[];
  activity_suggestions: string[];
}

const ProcessedChatRecommendation: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [recommendations, setRecommendations] = useState<Recommendation | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/process_chat/${chatId}`
        );
        console.log(response);
        const data = await response.json();
        setRecommendations(data);
      } catch (error: any) {
        console.error("Error processing chat:", error);
        setError(`Failed to load recommendations: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [chatId]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderRecommendationItems = (items: string[], maxItems: number = 3) => {
    const visibleItems = expandedSections[items[0]]
      ? items.slice(1)
      : items.slice(1, maxItems);
    return (
      <>
        {visibleItems.map((item, index) => (
          <RecommendationItem key={index}>{item}</RecommendationItem>
        ))}
        {items.length > maxItems && (
          <ExpandButton onClick={() => toggleSection(items[0])}>
            {expandedSections[items[0]] ? (
              <>
                <ChevronUp size={16} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Show More
              </>
            )}
          </ExpandButton>
        )}
      </>
    );
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>Chat Insights & Recommendations</Title>
        <Subtitle>Personalized suggestions based on your conversation</Subtitle>
      </Header>

      <AnimatePresence>
        {recommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ContentContainer>
              <EmotionSummary>
                <EmotionTitle>
                  <BarChart2 size={24} />
                  Emotion Summary
                </EmotionTitle>
                <EmotionText>{recommendations.emotion_summary}</EmotionText>
              </EmotionSummary>

              <RecommendationsGrid>
                <RecommendationCard>
                  <RecommendationTitle>
                    <Music size={24} />
                    Music Recommendations
                  </RecommendationTitle>
                  <RecommendationList>
                    {renderRecommendationItems(
                      recommendations.music_recommendations
                    )}
                  </RecommendationList>
                </RecommendationCard>

                <RecommendationCard>
                  <RecommendationTitle>
                    <Film size={24} />
                    Movie Recommendations
                  </RecommendationTitle>
                  <RecommendationList>
                    {renderRecommendationItems(
                      recommendations.movie_recommendations
                    )}
                  </RecommendationList>
                </RecommendationCard>

                <RecommendationCard>
                  <RecommendationTitle>
                    <Book size={24} />
                    Book Recommendations
                  </RecommendationTitle>
                  <RecommendationList>
                    {renderRecommendationItems(
                      recommendations.book_recommendations
                    )}
                  </RecommendationList>
                </RecommendationCard>

                <RecommendationCard>
                  <RecommendationTitle>
                    <Coffee size={24} />
                    Activity Suggestions
                  </RecommendationTitle>
                  <RecommendationList>
                    {renderRecommendationItems(
                      recommendations.activity_suggestions
                    )}
                  </RecommendationList>
                </RecommendationCard>
              </RecommendationsGrid>
            </ContentContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

// Add these new styled components
const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 2rem;
`;

export default ProcessedChatRecommendation;
