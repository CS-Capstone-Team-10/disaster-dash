'use client';

import React from 'react';
import Image from 'next/image';
import { Bell, User, Menu, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onMenuClick: () => void;
  onSettingsClick: () => void;
}

export function Header({ onMenuClick, onSettingsClick }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/50 dark:bg-gray-900/50 border-b border-gray-200/40 dark:border-gray-800/40 backdrop-blur-sm px-6 py-3 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-all hover:scale-105"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
            <Image
              src="/logo.png"
              alt="Atlas Alert Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-all hover:scale-105 relative">
            <User className="w-4 h-4" />
          </button>
          <button
            onClick={onSettingsClick}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-all hover:scale-105"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-all hover:scale-105">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
