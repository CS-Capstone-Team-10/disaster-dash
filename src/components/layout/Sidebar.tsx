'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Map, AlertCircle, TrendingUp, Settings, Bell, X, User, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'map', label: 'Live Map', icon: <Map className="w-5 h-5" /> },
    { id: 'alerts', label: 'Alerts', icon: <AlertCircle className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const accountItems = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'signin', label: 'Sign In', icon: <LogIn className="w-5 h-5" /> },
    { id: 'signup', label: 'Sign Up', icon: <UserPlus className="w-5 h-5" /> },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: isOpen ? 0 : -300, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed w-64 bg-gray-900 rounded-3xl shadow-2xl flex flex-col z-50 m-4"
        style={{ height: 'calc(100vh - 2rem)', maxHeight: 'calc(100vh - 2rem)' }}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Atlas Alert</h1>
                <p className="text-xs text-gray-400">Disaster Intelligence</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    activeItem === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              </motion.li>
            ))}
          </ul>

          <div className="mt-6 mb-3 px-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Account Pages
            </h3>
          </div>

          <ul className="space-y-2">
            {accountItems.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: (menuItems.length + index) * 0.05 }}
              >
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    activeItem === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="p-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-white mb-1">Need Help?</p>
            <p className="text-xs text-gray-300 mb-3">Check our documentation</p>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
              View Docs
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
