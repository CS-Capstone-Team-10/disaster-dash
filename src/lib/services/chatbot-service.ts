/**
 * CHATBOT SERVICE
 *
 * Handles chatbot message processing with mock responses and API integration points.
 *
 * Usage:
 * import { useChatbot } from '@/lib/services/chatbot-service';
 * const { messages, sendMessage, isTyping, quickReplies } = useChatbot();
 */

import { useState, useCallback } from 'react';
import type { Message } from '@/components/chatbot/types';

// ============================================================================
// API CONFIGURATION
// ============================================================================

const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL || 'http://localhost:8000/chat';
const USE_MOCK_CHATBOT = process.env.NEXT_PUBLIC_USE_MOCK_CHATBOT !== 'false'; // Default to mock

// ============================================================================
// MOCK DATA & RESPONSES
// ============================================================================

const INITIAL_GREETING: Message = {
  id: '1',
  content: "Hi! I'm the Atlas Alert Assistant. I can help you understand disaster data, get insights about specific regions, or answer questions about ongoing events. What would you like to know?",
  sender: 'bot',
  timestamp: new Date(),
};

const QUICK_REPLIES = [
  "What disasters are active right now?",
  "Show me California wildfires",
  "How many floods in the last 24h?",
  "Explain confidence scores",
];

// Mock knowledge base for disaster-related queries
const MOCK_RESPONSES: Record<string, string> = {
  'hello': "Hello! How can I assist you with disaster intelligence today?",
  'hi': "Hi there! What would you like to know about current disaster events?",
  'help': "I can help you with:\n• Current disaster statistics\n• Region-specific incidents\n• Understanding severity levels\n• Confidence score explanations\n• Historical trends\n\nWhat would you like to explore?",
  'active': "Based on recent data, we're currently tracking multiple active disaster events across the US. Would you like details on a specific disaster type or region?",
  'wildfire': "Wildfires are being monitored in several states. The highest concentrations are typically in California, Oregon, and Washington. Would you like to see the latest wildfire incidents on the map?",
  'california': "California has several active disaster alerts. The most common types are wildfires and earthquakes. Would you like me to filter the dashboard to show only California incidents?",
  'flood': "Flood alerts are being tracked across multiple states. Recent heavy rainfall has increased flood risks in several regions. Check the Live Map for specific locations.",
  'confidence': "Confidence scores (0-100%) indicate how certain our AI model is about the disaster classification. Scores above 80% are considered high-confidence. You can filter by confidence level in the Analytics page.",
  'earthquake': "Earthquake activity is primarily monitored along the West Coast and fault lines. Recent seismic events are classified by magnitude and confidence level.",
  'hurricane': "Hurricane tracking includes tropical storms and severe weather patterns. These are most common in Gulf Coast and Atlantic coastal regions during hurricane season.",
  'stats': "Current statistics show disaster incidents across all categories. Visit the Analytics page for detailed breakdowns by type, region, and time period.",
  'how': "Atlas Alert uses AI to analyze social media posts from Bluesky and Twitter, classifying disaster reports by type, location, and severity. Each incident is assigned a confidence score based on the analysis quality.",
  'thanks': "You're welcome! Let me know if you need anything else.",
  'thank you': "Happy to help! Feel free to ask more questions anytime.",
};


function generateMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }
  return "I'm still learning about that topic. You can explore the Dashboard, Live Map, or Analytics pages for more detailed information. Is there something specific about disasters or our data you'd like to know?";
}

async function callChatbotAPI(message: string): Promise<string> {
  try {
    const response = await fetch(CHATBOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context: {
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Chatbot API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || data.message || "I couldn't process that request.";
  } catch (error) {
    console.error('Chatbot API error:', error);
    throw error;
  }
}

async function getBotResponse(userMessage: string): Promise<string> {
  if (USE_MOCK_CHATBOT) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    return generateMockResponse(userMessage);
  } else {
    // Call real API
    return await callChatbotAPI(userMessage);
  }
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>(QUICK_REPLIES);

  const sendMessage = useCallback(async (userMessage: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      content: userMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setQuickReplies([]); // Hide quick replies after user sends a message

    // Show typing indicator
    setIsTyping(true);

    try {
      // Get bot response
      const botResponseText = await getBotResponse(userMessage);

      // Add bot response
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      // Add error message
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble responding right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const handleQuickReply = useCallback((reply: string) => {
    sendMessage(reply);
  }, [sendMessage]);

  return {
    messages,
    sendMessage,
    isTyping,
    quickReplies,
    onQuickReply: handleQuickReply,
  };
}


export const chatbotService = {
  getBotResponse,
  callChatbotAPI,
  useMockData: USE_MOCK_CHATBOT,
  apiUrl: CHATBOT_API_URL,
};