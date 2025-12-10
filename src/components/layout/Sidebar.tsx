'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, AlertCircle, TrendingUp, Settings, Bell, X, User, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
}

export function Sidebar({ isOpen, onClose, onSettingsClick }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, href: '/' },
    { id: 'map', label: 'Live Map', icon: <Map className="w-5 h-5" />, href: '/live-map' },
    { id: 'alerts', label: 'Alerts', icon: <AlertCircle className="w-5 h-5" />, href: '/alerts' },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" />, href: '/analytics' },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, href: '/notifications' },
  ];

  const settingsItem = { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> };

  const accountItems = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, href: '/profile' },
    { id: 'signin', label: 'Sign In', icon: <LogIn className="w-5 h-5" />, href: '/sign-in' },
    { id: 'signup', label: 'Sign Up', icon: <UserPlus className="w-5 h-5" />, href: '/sign-up' },
  ];

  return (
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: isOpen ? 0 : -300, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed w-64 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex flex-col z-50 m-4"
        style={{ height: 'calc(100vh - 2rem)', maxHeight: 'calc(100vh - 2rem)' }}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Atlas Alert Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Atlas Alert</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Disaster Intelligence</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          {/* Settings Button */}
          <div className="mt-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: menuItems.length * 0.05 }}
              onClick={onSettingsClick}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            >
              {settingsItem.icon}
              <span className="font-medium">{settingsItem.label}</span>
            </motion.button>
          </div>

          <div className="mt-6 mb-3 px-4">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Account Pages
            </h3>
          </div>

          <ul className="space-y-2">
            {accountItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (menuItems.length + index) * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-900 dark:to-blue-800 rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-white mb-1">Need Help?</p>
            <p className="text-xs text-blue-100 dark:text-gray-300 mb-3">Check our documentation</p>
            <button className="w-full bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white text-sm font-medium py-2.5 rounded-xl hover:from-blue-800 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
              View Docs
            </button>
          </div>
        </div>
      </motion.aside>
  );
}
