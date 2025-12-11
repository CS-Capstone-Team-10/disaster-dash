/**
 * CHATBOT SERVICE
 *
 * Handles chatbot message processing with Google ADK API integration.
 * Supports session management and streaming responses.
 *
 * Usage:
 * import { useChatbot } from '@/lib/services/chatbot-service';
 * const { messages, sendMessage, isTyping, quickReplies } = useChatbot();
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message } from '@/components/chatbot/types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const ADK_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_CHATBOT_API_URL || 'http://127.0.0.1:4000',
  appName: process.env.NEXT_PUBLIC_ADK_APP_NAME || 'multi_tool_agent',
  timeout: 30000, // 30 seconds
};

// ============================================================================
// TYPES
// ============================================================================

interface ADKSession {
  id: string;
  app_name: string;
  user_id: string;
  state: Record<string, unknown>;
  events: ADKEvent[];
  last_update_time: number;
}

interface ADKEvent {
  id?: string;
  timestamp?: number;
  author?: string;
  content?: {
    role?: string;
    parts?: Array<{ text?: string; function_call?: unknown; function_response?: unknown }>;
  };
  actions?: {
    state_delta?: Record<string, unknown>;
  };
}

interface ADKRunRequest {
  app_name: string;
  user_id: string;
  session_id: string;
  new_message: {
    role: string;
    parts: Array<{ text: string }>;
  };
  streaming?: boolean;
}

interface ChatbotState {
  isConnected: boolean;
  sessionId: string | null;
  userId: string;
  error: string | null;
}

// ============================================================================
// ADK CLIENT CLASS
// ============================================================================

class ADKClient {
  private baseUrl: string;
  private appName: string;

  constructor(baseUrl: string, appName: string) {
    this.baseUrl = baseUrl;
    this.appName = appName;
  }

  /**
   * Check if the ADK server is available by trying to list apps
   * Returns detailed error info for debugging
   */
  async healthCheck(): Promise<{ ok: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/list-apps`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        return { ok: true };
      }
      
      return { ok: false, error: `Server returned ${response.status}` };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      
      // Check for common CORS error patterns
      if (message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('CORS')) {
        return { 
          ok: false, 
          error: `CORS or network error. Make sure ADK server is running with: adk api_server --allow-origins="*"` 
        };
      }
      
      return { ok: false, error: message };
    }
  }

  /**
   * List available apps on the ADK server
   */
  async listApps(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/list-apps`);
    if (!response.ok) {
      throw new Error(`Failed to list apps: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Create a new session for a user
   */
  async createSession(userId: string, sessionId: string): Promise<ADKSession> {
    const url = `${this.baseUrl}/apps/${this.appName}/users/${userId}/sessions/${sessionId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state: {},
      }),
    });

    if (!response.ok) {
      // Session might already exist, try to get it
      if (response.status === 400 || response.status === 409) {
        return this.getSession(userId, sessionId);
      }
      throw new Error(`Failed to create session: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get an existing session
   */
  async getSession(userId: string, sessionId: string): Promise<ADKSession> {
    const url = `${this.baseUrl}/apps/${this.appName}/users/${userId}/sessions/${sessionId}`;
    
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get session: ${response.status}`);
    }

    return response.json();
  }

  /**
   * List all sessions for a user
   */
  async listSessions(userId: string): Promise<ADKSession[]> {
    const url = `${this.baseUrl}/apps/${this.appName}/users/${userId}/sessions`;
    
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to list sessions: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Delete a session
   */
  async deleteSession(userId: string, sessionId: string): Promise<void> {
    const url = `${this.baseUrl}/apps/${this.appName}/users/${userId}/sessions/${sessionId}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete session: ${response.status}`);
    }
  }

  /**
   * Send a message and get a response (non-streaming)
   */
  async run(userId: string, sessionId: string, message: string): Promise<string> {
    const url = `${this.baseUrl}/run`;
    
    const request: ADKRunRequest = {
      app_name: this.appName,
      user_id: userId,
      session_id: sessionId,
      new_message: {
        role: 'user',
        parts: [{ text: message }],
      },
      streaming: false,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(ADK_CONFIG.timeout),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ADK run error:', errorText);
      throw new Error(`ADK API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return this.extractResponseText(data);
  }

  /**
   * Send a message and get a streaming response (SSE)
   */
  async runStream(
    userId: string,
    sessionId: string,
    message: string,
    onChunk: (text: string) => void,
    onComplete: (fullText: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const url = `${this.baseUrl}/run_sse`;
    
    const request: ADKRunRequest = {
      app_name: this.appName,
      user_id: userId,
      session_id: sessionId,
      new_message: {
        role: 'user',
        parts: [{ text: message }],
      },
      streaming: true,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`ADK SSE error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const text = this.extractEventText(data);
              if (text) {
                fullText += text;
                onChunk(text);
              }
            } catch {
              // Skip non-JSON lines
            }
          }
        }
      }

      onComplete(fullText);
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Extract text from ADK response (handles various formats)
   */
  private extractResponseText(data: unknown): string {
    if (!data) return '';

    // Handle array of events
    if (Array.isArray(data)) {
      let lastText = '';
      for (const event of data) {
        const text = this.extractEventText(event);
        if (text) lastText = text;
      }
      return lastText;
    }

    // Handle single event
    return this.extractEventText(data as ADKEvent);
  }

  /**
   * Extract text from a single ADK event
   */
  private extractEventText(event: ADKEvent | Record<string, unknown>): string {
    // Check content.parts[].text
    const content = event.content as ADKEvent['content'];
    if (content?.parts) {
      const texts: string[] = [];
      for (const part of content.parts) {
        if (part.text) {
          texts.push(part.text);
        }
      }
      if (texts.length > 0) {
        return texts.join('');
      }
    }

    // Fallback to common fields
    const record = event as Record<string, unknown>;
    if (typeof record.response === 'string') return record.response;
    if (typeof record.message === 'string') return record.message;
    if (typeof record.text === 'string') return record.text;
    if (typeof record.output === 'string') return record.output;

    return '';
  }
}

// ============================================================================
// USER & SESSION MANAGEMENT
// ============================================================================

function getUserId(): string {
  if (typeof window === 'undefined') return 'server-user';
  
  const storageKey = 'atlas_alert_user_id';
  let userId = localStorage.getItem(storageKey);
  
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(storageKey, userId);
  }
  
  return userId;
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function getStoredSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('atlas_alert_session_id');
}

function storeSessionId(sessionId: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('atlas_alert_session_id', sessionId);
  }
}

function clearStoredSessionId(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('atlas_alert_session_id');
  }
}

// ============================================================================
// CONSTANTS
// ============================================================================

const QUICK_REPLIES = [
  "What disasters are active right now?",
  "Show recent earthquakes",
  "Get weather alerts for Texas",
  "Tell me about hurricane safety",
];

// ============================================================================
// SINGLETON ADK CLIENT
// ============================================================================

let adkClient: ADKClient | null = null;

function getADKClient(): ADKClient {
  if (!adkClient) {
    adkClient = new ADKClient(ADK_CONFIG.baseUrl, ADK_CONFIG.appName);
  }
  return adkClient;
}

// ============================================================================
// MAIN CHATBOT HOOK
// ============================================================================

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>(QUICK_REPLIES);
  const [connectionState, setConnectionState] = useState<ChatbotState>({
    isConnected: false,
    sessionId: null,
    userId: '',
    error: null,
  });

  const sessionIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string>('');
  const clientRef = useRef<ADKClient | null>(null);
  const initializingRef = useRef(false);

  // Add initial greeting based on connection status
  const addGreeting = useCallback((isConnected: boolean, error?: string) => {
    const greeting: Message = {
      id: 'greeting',
      content: isConnected
        ? "Hi! I'm the Atlas Alert Assistant. I can help you understand disaster data, get real-time information about earthquakes, hurricanes, wildfires, and weather alerts. What would you like to know?"
        : `⚠️ **Unable to connect to the chatbot server.**\n\n${error || 'The server is not available.'}\n\nPlease make sure the ADK server is running at:\n\`${ADK_CONFIG.baseUrl}\`\n\nYou can start it with:\n\`adk api_server --allow-origins="*"\``,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages([greeting]);
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    const initialize = async () => {
      if (initializingRef.current) return;
      initializingRef.current = true;

      const userId = getUserId();
      userIdRef.current = userId;
      clientRef.current = getADKClient();

      // Try to restore existing session or create new one
      let sessionId = getStoredSessionId();
      if (!sessionId) {
        sessionId = generateSessionId();
      }

      console.log('ADK Chatbot initializing:', {
        baseUrl: ADK_CONFIG.baseUrl,
        appName: ADK_CONFIG.appName,
        userId,
        sessionId,
      });

      try {
        // Check if server is running by calling /list-apps
        const healthResponse = await fetch(`${ADK_CONFIG.baseUrl}/list-apps`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });

        if (!healthResponse.ok) {
          throw new Error(`Server returned ${healthResponse.status}`);
        }

        const apps = await healthResponse.json();
        console.log('Available ADK apps:', apps);

        // Check if our app is available
        if (Array.isArray(apps) && !apps.includes(ADK_CONFIG.appName)) {
          console.warn(`App "${ADK_CONFIG.appName}" not found in available apps:`, apps);
        }

        // Create the session on the ADK server
        await clientRef.current.createSession(userId, sessionId);
        console.log('ADK session created:', sessionId);

        storeSessionId(sessionId);
        sessionIdRef.current = sessionId;

        setConnectionState({
          isConnected: true,
          sessionId,
          userId,
          error: null,
        });

        addGreeting(true);
        console.log('ADK chatbot connected successfully');
      } catch (error) {
        console.error('ADK connection failed:', error);
        
        let errorMessage = 'Connection failed';
        
        if (error instanceof Error) {
          errorMessage = error.message;
          
          // Detect CORS errors
          if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('Load failed')) {
            errorMessage = `CORS/Network error. Start ADK server with:\nadk api_server --allow-origins="*"`;
          } else if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
            errorMessage = `Connection timeout. Is the ADK server running at ${ADK_CONFIG.baseUrl}?`;
          }
        }
        
        // Store session ID for retry
        storeSessionId(sessionId);
        sessionIdRef.current = sessionId;
        
        setConnectionState({
          isConnected: false,
          sessionId,
          userId,
          error: errorMessage,
        });

        addGreeting(false, errorMessage);
      }

      initializingRef.current = false;
    };

    initialize();
  }, [addGreeting]);

  // Send message handler
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Check if connected
    if (!connectionState.isConnected) {
      const errorMsg: Message = {
        id: `error_${Date.now()}`,
        content: `⚠️ **Cannot send message - not connected to server.**\n\nPlease click "Retry Connection" or make sure the ADK server is running at \`${ADK_CONFIG.baseUrl}\``,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      content: userMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setQuickReplies([]);
    setIsTyping(true);

    try {
      const client = clientRef.current || getADKClient();
      const sessionId = sessionIdRef.current || generateSessionId();
      
      const botResponseText = await client.run(
        userIdRef.current,
        sessionId,
        userMessage
      );

      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        content: botResponseText || "I received your message but got an empty response. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Update connection state if it seems like a connection issue
      if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('timeout')) {
        setConnectionState(prev => ({
          ...prev,
          isConnected: false,
          error: errorMessage,
        }));
      }

      const errorMsg: Message = {
        id: `error_${Date.now()}`,
        content: `❌ **Error sending message**\n\n${errorMessage}\n\nPlease try again or check if the server is still running.`,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [connectionState.isConnected]);

  // Quick reply handler
  const handleQuickReply = useCallback((reply: string) => {
    sendMessage(reply);
  }, [sendMessage]);

  // Reset session
  const resetSession = useCallback(async () => {
    const client = clientRef.current;
    const oldSessionId = sessionIdRef.current;

    // Clear local state
    clearStoredSessionId();

    // Generate new session
    const newSessionId = generateSessionId();
    sessionIdRef.current = newSessionId;
    storeSessionId(newSessionId);

    if (connectionState.isConnected && client) {
      try {
        // Delete old session
        if (oldSessionId) {
          await client.deleteSession(userIdRef.current, oldSessionId);
        }
        // Create new session
        await client.createSession(userIdRef.current, newSessionId);
        
        setConnectionState(prev => ({
          ...prev,
          sessionId: newSessionId,
        }));

        addGreeting(true);
        setQuickReplies(QUICK_REPLIES);
      } catch (error) {
        console.error('Session reset failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to reset session';
        
        setConnectionState(prev => ({
          ...prev,
          isConnected: false,
          error: errorMessage,
        }));

        addGreeting(false, errorMessage);
      }
    } else {
      addGreeting(false, connectionState.error || 'Not connected');
      setQuickReplies(QUICK_REPLIES);
    }
  }, [connectionState.isConnected, connectionState.error, addGreeting]);

  // Retry connection
  const retryConnection = useCallback(async () => {
    setIsTyping(true);
    
    const retryMsg: Message = {
      id: `system_${Date.now()}`,
      content: '🔄 Attempting to reconnect to the server...',
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, retryMsg]);
    
    try {
      // Check if server is running by calling /list-apps
      const healthResponse = await fetch(`${ADK_CONFIG.baseUrl}/list-apps`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (!healthResponse.ok) {
        throw new Error(`Server returned ${healthResponse.status}`);
      }

      const sessionId = sessionIdRef.current || generateSessionId();

      // Create the session on the ADK server
      const client = clientRef.current || getADKClient();
      await client.createSession(userIdRef.current, sessionId);
      console.log('ADK session created on retry:', sessionId);

      sessionIdRef.current = sessionId;
      storeSessionId(sessionId);

      setConnectionState(prev => ({
        ...prev,
        isConnected: true,
        sessionId,
        error: null,
      }));

      const successMsg: Message = {
        id: `system_${Date.now() + 1}`,
        content: '✅ **Successfully connected!** You can now start chatting.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, successMsg]);
      setQuickReplies(QUICK_REPLIES);
    } catch (error) {
      let errorMessage = 'Connection failed';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('Load failed')) {
          errorMessage = `CORS/Network error. Start ADK server with:\nadk api_server --allow-origins="*"`;
        }
      }
      
      setConnectionState(prev => ({
        ...prev,
        isConnected: false,
        error: errorMessage,
      }));

      const failMsg: Message = {
        id: `system_${Date.now() + 1}`,
        content: `❌ **Connection failed**\n\n${errorMessage}\n\nMake sure the ADK server is running at \`${ADK_CONFIG.baseUrl}\``,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, failMsg]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  return {
    // State
    messages,
    isTyping,
    quickReplies,
    isConnected: connectionState.isConnected,
    sessionId: connectionState.sessionId,
    userId: connectionState.userId,
    error: connectionState.error,
    
    // Actions
    sendMessage,
    onQuickReply: handleQuickReply,
    resetSession,
    retryConnection,
  };
}

// ============================================================================
// EXPORTED SERVICE OBJECT
// ============================================================================

export const chatbotService = {
  getClient: getADKClient,
  getUserId,
  generateSessionId,
  config: ADK_CONFIG,
};

// Export types
export type { ADKSession, ADKEvent, ChatbotState };
