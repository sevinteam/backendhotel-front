
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './icons';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef}>
      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-right bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 min-h-[44px] border border-transparent focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
        >
          <div className="flex items-center gap-2">
            {selectedOption?.icon}
            <span className="text-gray-800 dark:text-gray-200 font-semibold">{selectedOption?.label}</span>
          </div>
          <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-600 z-10 overflow-hidden p-2">
            <ul className="space-y-1 max-h-60 overflow-y-auto scrollbar-right pr-2">
              {options.map(option => (
                <li key={option.value}>
                  <button
                    onClick={() => handleSelect(option.value)}
                    className={`w-full flex items-center gap-3 p-3 text-right rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${value === option.value ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                  >
                    {option.icon}
                    <span className="font-semibold">{option.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
