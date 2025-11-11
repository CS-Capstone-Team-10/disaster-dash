'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { SettingsPanel } from '@/components/layout/SettingsPanel';
import { AnimatePresence, motion } from 'framer-motion';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleCloseAll = () => {
    setSidebarOpen(false);
    setSettingsOpen(false);
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-950">
      {/* Blurred backdrop when sidebar or settings is open */}
      <AnimatePresence>
        {(sidebarOpen || settingsOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40"
            onClick={handleCloseAll}
          />
        )}
      </AnimatePresence>

      {/* Sidebar as overlay */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSettingsClick={handleSettingsToggle}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onSettingsClick={handleSettingsToggle}
        />

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
