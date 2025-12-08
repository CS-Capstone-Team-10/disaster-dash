import React from 'react';
import { Message } from './types';

interface ChatbotMessageProps {
  message: Message;
}

export const ChatbotMessage = ({ message }: ChatbotMessageProps) => {
  const isBot = message.sender === 'bot';
  const time = message.timestamp.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className={`flex items-start gap-3 ${!isBot ? 'flex-row-reverse' : ''}`}>
      {isBot && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-atlas-blue/20">
          <div className="h-2 w-2 rounded-full bg-atlas-blue"></div>
        </div>
      )}

      <div className={`flex flex-col gap-1 ${!isBot ? 'items-end' : ''}`}>
        <div
          className={`max-w-[280px] rounded-2xl px-4 py-3 ${
            isBot ? 'bg-atlas-dark text-atlas-text' : 'bg-atlas-blue text-white'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <span className="text-xs text-atlas-text-muted">{time}</span>
      </div>
    </div>
  );
};
