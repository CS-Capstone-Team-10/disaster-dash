'use client';

import React, { useEffect, useState } from 'react';
import { X, Monitor, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeOptions = [
    { id: 'light', label: 'Light', icon: <Sun className="w-5 h-5" />, description: 'Light mode' },
    { id: 'dark', label: 'Dark', icon: <Moon className="w-5 h-5" />, description: 'Dark mode' },
    { id: 'system', label: 'System', icon: <Monitor className="w-5 h-5" />, description: 'Use system settings' },
  ];

  return (
    <motion.aside
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: isOpen ? 0 : 300, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed w-80 bg-card rounded-3xl shadow-2xl flex flex-col z-50 border border-border"
      style={{
        height: 'calc(100vh - 2rem)',
        maxHeight: 'calc(100vh - 2rem)',
        top: '1rem',
        left: 'calc(256px + 2rem + 1rem)', // Sidebar width (256px) + sidebar margin (2rem) + gap (1rem)
        right: 'auto'
      }}
    >
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Settings</h2>
            <p className="text-xs text-muted-foreground">Customize your experience</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Theme Settings Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              Appearance
            </h3>
            <div className="space-y-2">
              {themeOptions.map((option, index) => {
                const isActive = mounted && theme === option.id;
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => setTheme(option.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm ring-2 ring-blue-500/50'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground bg-muted/30'
                    }`}
                  >
                    <div className={`${isActive ? 'text-white' : 'text-muted-foreground'}`}>
                      {option.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className={`text-xs ${isActive ? 'text-blue-200' : 'text-muted-foreground'}`}>
                        {option.description}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Additional Settings Sections (Placeholder) */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              About
            </h3>
            <div className="bg-muted/30 rounded-2xl p-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex justify-between">
                  <span>Version</span>
                  <span className="text-foreground font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Build</span>
                  <span className="text-foreground font-medium">2025.01</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="bg-muted/50 rounded-2xl p-4">
          <p className="text-xs text-muted-foreground text-center">
            Atlas Alert © 2025
          </p>
        </div>
      </div>
    </motion.aside>
  );
}
