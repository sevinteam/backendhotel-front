
import React, { useEffect } from 'react';
import { XIcon } from './icons';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ isOpen, onClose, imageUrl }) => {
  // useEffect برای مدیریت رویدادها و عوارض جانبی
  useEffect(() => {
    // تابع برای بستن مودال با فشردن کلید Escape
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // جلوگیری از اسکرول پس‌زمینه
    } else {
      document.body.style.overflow = 'auto'; // بازگرداندن اسکرول
    }

    // تابع پاکسازی برای حذف event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex items-center justify-center z-[100] transition-opacity duration-300"
      onClick={onClose} // بستن با کلیک روی پس‌زمینه
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] transform transition-all duration-300 scale-95"
        style={isOpen ? { transform: 'scale(1)', opacity: 1 } : { transform: 'scale(0.95)', opacity: 0 }}
        onClick={e => e.stopPropagation()} // جلوگیری از بستن با کلیک روی تصویر
      >
        <div className="bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
          <img src={imageUrl} alt="Preview" className="block max-w-full max-h-full rounded-lg" />
        </div>
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors"
          aria-label="Close image preview"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ImagePreviewModal;