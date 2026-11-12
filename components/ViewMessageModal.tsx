import React, { useEffect } from 'react';
import { XIcon } from './icons';
import type { ContactMessage } from '../types';

interface ViewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ContactMessage;
}

const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400">{label}:</label>
        <div 
            className="mt-2 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg min-h-[44px]"
            dir={value && value.startsWith('+') ? 'ltr' : undefined}
        >
            {value}
        </div>
    </div>
);

const ViewMessageModal: React.FC<ViewMessageModalProps> = ({ isOpen, onClose, message }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[70] transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 my-8 mx-4 max-w-2xl w-full transform transition-all duration-300 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
             پیام تماس با ما “{message.name}”
          </h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />
        
        <div className="py-6 flex-1 text-right space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField label="نام و نام خانوادگی" value={message.name} />
              <InfoField label="موضوع" value={message.subject} />
              <InfoField label="شماره تماس" value={message.phone} />
              <InfoField label="ایمیل" value={message.email} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">توضیحات:</label>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-100 dark:bg-gray-700 p-4 rounded-lg min-h-[120px]">
                {message.message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMessageModal;