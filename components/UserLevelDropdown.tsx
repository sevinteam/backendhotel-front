import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, LevelBadgeIcon } from './icons';
import type { UserLevel } from '../types';

interface UserLevelDropdownProps {
  value: UserLevel;
  onChange: (value: UserLevel) => void;
}

const levels: { name: UserLevel; label: string }[] = [
  { name: 'طلایی', label: 'سطح طلایی' },
  { name: 'نقره ای', label: 'سطح نقره ای' },
  { name: 'برنزی', label: 'سطح برنزی' },
];

const UserLevelDropdown: React.FC<UserLevelDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLevel = levels.find(l => l.name === value) || levels[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (levelName: UserLevel) => {
    onChange(levelName);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">سطح کاربری</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-right bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 min-h-[52px] border border-transparent focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
      >
        <div className="flex items-center gap-3">
          <LevelBadgeIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-800 dark:text-gray-200 font-semibold">{selectedLevel.label}</span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-10 overflow-hidden p-2">
          <ul className="space-y-1">
            {levels.map(level => (
              <li key={level.name}>
                <button
                  onClick={() => handleSelect(level.name)}
                  className={`w-full flex items-center gap-3 p-3 text-right rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${value === level.name ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  <LevelBadgeIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  <span className="font-semibold">{level.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserLevelDropdown;
