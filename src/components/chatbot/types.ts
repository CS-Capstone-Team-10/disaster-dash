export interface Message {
  id: string;
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export interface ChatbotWidgetProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  quickReplies?: string[];
  onQuickReply?: (reply: string) => void;
  className?: string;
  'data-id'?: string;
}
