import React, { useState } from 'react';
import { ChatbotTrigger } from './ChatbotTrigger';
import { ChatbotWindow } from './ChatbotWindow';
import { ChatbotWidgetProps } from './types';

export const ChatbotWidget = ({
  messages,
  onSendMessage,
  isTyping = false,
  quickReplies,
  onQuickReply,
  className = '',
  'data-id': dataId,
}: ChatbotWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`} data-id={dataId}>
      {!isOpen && <ChatbotTrigger onClick={() => setIsOpen(true)} />}
      {isOpen && (
        <ChatbotWindow
          messages={messages}
          onSendMessage={onSendMessage}
          isTyping={isTyping}
          quickReplies={quickReplies}
          onQuickReply={onQuickReply}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
