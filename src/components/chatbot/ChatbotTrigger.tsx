import React from 'react';
import { MessageCircleIcon } from 'lucide-react';

interface ChatbotTriggerProps {
  onClick: () => void;
}

export const ChatbotTrigger = ({ onClick }: ChatbotTriggerProps) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-atlas-blue shadow-lg transition-all hover:bg-atlas-blue-hover hover:shadow-xl hover:scale-105"
      aria-label="Open Atlas Alert Assistant"
    >
      <MessageCircleIcon className="h-6 w-6 text-white" />
      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-atlas-success border-2 border-atlas-darker"></span>
    </button>
  );
};
