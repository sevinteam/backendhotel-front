import React, { useEffect } from 'react';
import { TrashIcon } from './icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  iconContainerClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  icon = <TrashIcon className="h-10 w-10 text-red-500" />,
  confirmText = 'حذف',
  cancelText = 'انصراف',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700',
  iconContainerClass = 'bg-red-100 dark:bg-red-900/50',
}) => {
  // useEffect برای جلوگیری از اسکرول شدن صفحه در پس‌زمینه هنگام باز بودن مودال
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // تابع پاکسازی برای اطمینان از بازگشت اسکرول هنگام بسته شدن یا حذف کامپوننت
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // اگر مودال باز نیست، چیزی رندر نکن
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex items-center justify-center z-[999] transition-opacity duration-300"
      onClick={onClose} // بستن مودال با کلیک روی پس‌زمینه
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 m-4 max-w-md w-full text-center transform transition-all duration-300 scale-95"
        style={isOpen ? { transform: 'scale(1)', opacity: 1 } : { transform: 'scale(0.95)', opacity: 0 }}
        onClick={e => e.stopPropagation()} // جلوگیری از بسته شدن مودال با کلیک روی خود مودال
      >
        <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-4 ${iconContainerClass}`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-3 px-8 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`text-white font-bold py-3 px-8 rounded-lg transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;