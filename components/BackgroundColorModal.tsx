

import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface BackgroundColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (background: string) => void;
  currentBackground: string;
}

// Expanded lists of colors and images
const colors = [
  '#FFFFFF', '#E5E7EB', '#F3F4F6', '#FECACA', '#FDE68A', 
  '#A7F3D0', '#BFDBFE', '#C4B5FD', '#FBCFE8',
  '#374151', '#111827',
];

const images = [
    { name: 'Galaxy', url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop' },
    { name: 'Forest', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Mountains', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Abstract', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2070&auto=format&fit=crop' },
];


const BackgroundColorModal: React.FC<BackgroundColorModalProps> = ({ isOpen, onClose, onSave, currentBackground }) => {
  const [selectedBackground, setSelectedBackground] = useState(currentBackground);

  useEffect(() => {
    if (isOpen) {
      setSelectedBackground(currentBackground);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, currentBackground]);

  if (!isOpen) return null;

  const previewStyle: React.CSSProperties = selectedBackground.startsWith('http')
    ? { backgroundImage: `url(${selectedBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: selectedBackground };

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
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">تغییر پس زمینه</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 flex-1 text-right space-y-6 overflow-y-auto pr-2 scrollbar-right">
          {/* Preview */}
          <div className="h-40 w-full rounded-lg border dark:border-gray-700" style={previewStyle}></div>
          
          {/* Color Options */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">رنگ ها</h4>
            <div className="flex flex-wrap gap-3">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedBackground(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform duration-150 ${selectedBackground === color ? 'border-violet-500 scale-110 ring-2 ring-violet-300' : 'border-gray-300 dark:border-gray-600'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          {/* Image Options */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">تصاویر</h4>
            <div className="grid grid-cols-4 gap-3">
              {images.map(image => (
                <button
                  key={image.name}
                  onClick={() => setSelectedBackground(image.url)}
                  className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-transform duration-150 ${selectedBackground === image.url ? 'border-violet-500 scale-110 ring-2 ring-violet-300' : 'border-transparent'}`}
                >
                    <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t dark:border-gray-700 flex justify-end flex-shrink-0">
          <button
            onClick={() => onSave(selectedBackground)}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            انتخاب
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundColorModal;