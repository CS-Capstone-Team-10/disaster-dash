import React, { useEffect, useRef } from 'react';
import { ChatbotHeader } from './ChatbotHeader';
import { ChatbotMessage } from './ChatbotMessage';
import { ChatbotInput } from './ChatbotInput';
import { Message } from './types';

interface ChatbotWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  quickReplies?: string[];
  onQuickReply?: (reply: string) => void;
  onClose: () => void;
}

export const ChatbotWindow = ({
  messages,
  onSendMessage,
  isTyping,
  quickReplies,
  onQuickReply,
  onClose,
}: ChatbotWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col w-[380px] h-[600px] bg-atlas-card border border-atlas-border rounded-lg shadow-2xl animate-scale-in overflow-hidden">
      <ChatbotHeader onClose={onClose} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatbotMessage key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-atlas-blue/20">
              <div className="h-2 w-2 rounded-full bg-atlas-blue"></div>
            </div>
            <div className="flex items-center gap-1 rounded-2xl bg-atlas-dark px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-atlas-text-muted animate-bounce"></div>
              <div
                className="h-2 w-2 rounded-full bg-atlas-text-muted animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="h-2 w-2 rounded-full bg-atlas-text-muted animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        )}

        {quickReplies && quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => onQuickReply?.(reply)}
                className="rounded-full border border-atlas-blue/50 bg-atlas-dark px-4 py-2 text-sm text-atlas-blue transition-colors hover:bg-atlas-blue/10"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatbotInput onSendMessage={onSendMessage} />
    </div>
  );
};
