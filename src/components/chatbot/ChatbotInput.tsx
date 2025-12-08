import React, { useState, KeyboardEvent } from 'react';
import { SendIcon } from 'lucide-react';

interface ChatbotInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatbotInput = ({ onSendMessage }: ChatbotInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-atlas-border bg-atlas-darker p-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about ongoing disasters..."
          className="flex-1 rounded-full bg-atlas-card border border-atlas-border px-4 py-2.5 text-sm text-atlas-text placeholder-atlas-text-muted focus:border-atlas-blue focus:outline-none focus:ring-1 focus:ring-atlas-blue"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-atlas-blue text-white transition-colors hover:bg-atlas-blue-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-atlas-blue"
          aria-label="Send message"
        >
          <SendIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
