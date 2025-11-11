"use client";

import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  label?: string;
  'data-id'?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select option",
  className = "",
  label,
  'data-id': dataId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef} data-id={dataId}>
      {label && (
        <label className="block text-sm text-gray-400 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={toggleDropdown}
        className={`
          w-full px-3 py-2
          bg-gray-800 border rounded-lg
          text-sm text-gray-200 text-left
          transition-all duration-200
          flex items-center justify-between
          hover:bg-gray-750
          ${isOpen
            ? 'border-blue-500 ring-1 ring-blue-500/50'
            : 'border-gray-700 hover:border-gray-600'
          }
          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50
        `}
      >
        <span className={selectedOption ? 'text-gray-200' : 'text-gray-500'}>
          {selectedOption?.label || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="
              absolute z-50 mt-2 w-full
              rounded-lg border border-gray-700
              bg-gray-800 shadow-2xl
              overflow-hidden
              max-h-60 overflow-y-auto
            "
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02, duration: 0.15 }}
                  className={`
                    flex items-center justify-between w-full px-4 py-2.5
                    text-left text-sm transition-colors
                    ${option.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-700/50 cursor-pointer'
                    }
                    ${isSelected
                      ? 'bg-blue-600/10 text-blue-400'
                      : 'text-gray-200'
                    }
                  `}
                  data-id={`dropdown-option-${option.value}`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check size={16} className="text-blue-400" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface DropdownMenuItemProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  'data-id'?: string;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  icon,
  label,
  onClick,
  disabled = false,
  danger = false,
  'data-id': dataId
}) => {
  return (
    <button
      type="button"
      className={`
        flex items-center w-full px-4 py-2.5 text-left text-sm
        transition-colors
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-gray-700/50 cursor-pointer'
        }
        ${danger
          ? 'text-red-400 hover:bg-red-900/20'
          : 'text-gray-200'
        }
      `}
      onClick={onClick}
      disabled={disabled}
      data-id={dataId}
    >
      {icon && <span className="mr-3 text-gray-400">{icon}</span>}
      <span className="flex-grow">{label}</span>
    </button>
  );
};

export const DropdownMenuDivider: React.FC = () => {
  return <div className="border-b border-gray-700 my-1" />;
};

export interface CustomDropdownMenuProps {
  trigger: React.ReactNode;
  items: (DropdownMenuItemProps | 'divider')[];
  align?: 'left' | 'right';
  'data-id'?: string;
}

export const CustomDropdownMenu: React.FC<CustomDropdownMenuProps> = ({
  trigger,
  items,
  align = 'left',
  'data-id': dataId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef} data-id={dataId}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`
              absolute z-50 mt-2
              min-w-[200px] md:min-w-[240px]
              rounded-lg border border-gray-700
              bg-gray-800 shadow-2xl
              overflow-hidden
              ${align === 'right' ? 'right-0' : 'left-0'}
            `}
          >
            {items.map((item, index) => {
              if (item === 'divider') {
                return <DropdownMenuDivider key={`divider-${index}`} />;
              } else {
                return (
                  <motion.div
                    key={`item-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02, duration: 0.15 }}
                  >
                    <DropdownMenuItem
                      icon={item.icon}
                      label={item.label}
                      onClick={() => {
                        item.onClick?.();
                        setIsOpen(false);
                      }}
                      disabled={item.disabled}
                      danger={item.danger}
                      data-id={`dropdown-item-${index}`}
                    />
                  </motion.div>
                );
              }
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
