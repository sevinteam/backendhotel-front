

import React, { useState, useEffect, useMemo } from 'react';
import { XIcon, CheckIcon } from './icons';

interface ChatBubbleColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (color: string) => void;
  currentColor: string;
  theme: string;
}

const PRESET_COLORS = [
  '#6D28D9', // violet
  '#DB2777', // pink
  '#FFFFFF', // white
  '#DC2626', // red
  '#111827', // dark gray
  '#0284C7', // blue
  '#16A34A', // green
];

const isColorDark = (hexColor: string): boolean => {
    if (!hexColor || !hexColor.startsWith('#')) return false;
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hexColor = hexColor.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    if (!result) return false;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
};

const ChatBubbleColorModal: React.FC<ChatBubbleColorModalProps> = ({ isOpen, onClose, onSave, currentColor, theme }) => {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  
  const defaultColor = theme === 'dark' ? '#374151' : '#353535';

  useEffect(() => {
    if (isOpen) {
      setSelectedColor(currentColor || defaultColor);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen, currentColor, defaultColor]);

  const colorsToShow = useMemo(() => {
    const dynamicColors = new Set(PRESET_COLORS);
    dynamicColors.add(defaultColor);
    dynamicColors.add(currentColor);
    return Array.from(dynamicColors);
  }, [currentColor, defaultColor]);

  if (!isOpen) return null;

  const previewTextColor = isColorDark(selectedColor) ? 'text-white' : 'text-gray-800';

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex items-center justify-center z-[70] transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 my-8 mx-4 max-w-lg w-full transform transition-all duration-300 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">تغییر چت تایم</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 flex-1 text-right space-y-6">
          {/* Preview */}
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-900/50 space-y-4">
              <div className="flex justify-end">
                  <div className="flex items-end gap-2 max-w-[80%]">
                      <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-t-xl rounded-bl-xl">مشکلی در ورود به پنل کاربری داشتم، لطفا بررسی کنید.</div>
                  </div>
              </div>
               <div className="flex justify-start">
                  <div className="flex items-end gap-2 max-w-[80%]">
                       <div className={`p-3 rounded-t-xl rounded-br-xl ${previewTextColor}`} style={{ backgroundColor: selectedColor }}>ممنون، لطفا پس از بررسی اطلاع دهید.</div>
                  </div>
              </div>
          </div>
          
          {/* Color Options */}
          <div>
            <div className="flex flex-wrap gap-4 justify-center">
              {colorsToShow.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform duration-150 flex items-center justify-center ${selectedColor === color ? 'border-violet-500 scale-110 ring-2 ring-violet-300' : 'border-gray-300 dark:border-gray-600'}`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && <CheckIcon className={`w-6 h-6 ${isColorDark(color) ? 'text-white' : 'text-gray-800'}`} />}
                </button>
              ))}
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t dark:border-gray-700 flex justify-end flex-shrink-0">
          <button
            onClick={() => onSave(selectedColor)}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            انتخاب
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBubbleColorModal;