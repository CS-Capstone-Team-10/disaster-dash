import React from 'react';
import { XIcon } from 'lucide-react';

interface ChatbotHeaderProps {
  onClose: () => void;
}

export const ChatbotHeader = ({ onClose }: ChatbotHeaderProps) => {
  return (
    <div className="flex items-center justify-between bg-atlas-blue px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">
            Atlas Alert Assistant
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-atlas-success"></span>
            Online
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Close chat"
      >
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
