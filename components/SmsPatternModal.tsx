import React from 'react';
import { XIcon, PlusIcon } from './icons';

interface SmsPatternModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Static data for the modal content
const addedPatterns = [
  { id: 1, text: 'پترن شماره ۱' },
];

const availablePatterns = [
  { id: 2, text: 'پترن شماره ۲', adminName: 'ادمین ۱' },
  { id: 3, text: 'پترن شماره ۳', adminName: 'ادمین ۲' },
  { id: 4, text: 'پترن شماره ۴', adminName: 'ادمین ۳' },
];

const SmsPatternModal: React.FC<SmsPatternModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[70] transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 my-8 mx-4 max-w-lg w-full transform transition-all duration-300 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">لیست پترن پیامکی</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 flex-1 overflow-y-auto pr-2 scrollbar-right text-right space-y-6">
          <div className="relative">
            <input type="text"
              placeholder="پترن شما !"
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400"
            />
          </div>

          {/* Added Patterns */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">افزوده شده</h4>
            <div className="space-y-2">
              {addedPatterns.map(pattern => (
                <div key={pattern.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{pattern.text}</span>
                  <button className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Available Patterns */}
          <div>
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">لیست پترن های پیامکی</h4>
            </div>
            <div className="grid grid-cols-[1fr_auto_auto] items-center text-xs font-semibold text-gray-400 dark:text-gray-500 px-2 pb-2">
                <span></span>
                <span>نام ادمین</span>
                <span className="text-left">عملیات</span>
            </div>
            <div className="space-y-2">
              {availablePatterns.map(pattern => (
                <div key={pattern.id} className="grid grid-cols-[1fr_auto_auto] items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{pattern.text}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{pattern.adminName}</span>
                  <div className="text-left">
                    <button className="flex items-center gap-1.5 bg-violet-600 text-white font-semibold py-1.5 px-3 rounded-md text-xs hover:bg-violet-700">
                      <PlusIcon className="w-4 h-4" />
                      <span>افزودن</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsPatternModal;
