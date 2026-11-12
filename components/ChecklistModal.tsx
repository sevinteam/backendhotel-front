
import React, { useState, useEffect, useMemo } from 'react';
import { XIcon, SearchIcon, CheckIcon } from './icons';
import type { ChecklistItem } from '../types';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklist: ChecklistItem[];
  onSave: (updatedChecklist: ChecklistItem[]) => void;
}

const ChecklistModal: React.FC<ChecklistModalProps> = ({ isOpen, onClose, checklist, onSave }) => {
  // state محلی برای مدیریت تغییرات چک‌لیست قبل از ذخیره نهایی
  const [localChecklist, setLocalChecklist] = useState<ChecklistItem[]>([]);
  // state برای متن جستجو
  const [searchTerm, setSearchTerm] = useState('');

  // همگام‌سازی state محلی با پراپرتی ورودی هنگام باز شدن مودال
  useEffect(() => {
    if (isOpen) {
      setLocalChecklist(checklist);
      setSearchTerm(''); // پاک کردن جستجو
    }
  }, [isOpen, checklist]);

  // تابع برای تغییر وضعیت تیک یک آیتم
  const toggleItem = (id: number) => {
    setLocalChecklist(prev => 
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  // تابع برای ذخیره تغییرات و ارسال آن به کامپوننت والد
  const handleSave = () => {
    onSave(localChecklist);
  };

  // فیلتر کردن آیتم‌های چک‌لیست بر اساس جستجو
  const filteredChecklist = useMemo(() => {
    return localChecklist.filter(item => 
      item.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localChecklist, searchTerm]);

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
        {/* هدر مودال */}
        <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">چک لیست</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* بدنه مودال */}
        <div className="py-6 flex-1 overflow-y-auto pr-2 scrollbar-right text-right space-y-6">
            <div className="relative">
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="جستجو در آیتم ها..."
                className="w-full p-2.5 pr-10 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400"
                />
                <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            </div>

            <div className="space-y-3">
                {filteredChecklist.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <button onClick={() => toggleItem(item.id)} className={`w-6 h-6 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${item.completed ? 'bg-violet-600 border-violet-600' : 'border-gray-300 dark:border-gray-500'}`}>
                            {item.completed && <CheckIcon className="w-4 h-4 text-white"/>}
                        </button>
                        <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{item.text}</span>
                    </div>
                ))}
                {filteredChecklist.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-6">موردی یافت نشد.</p>}
            </div>
        </div>

        {/* فوتر مودال */}
        <div className="mt-auto pt-4 border-t dark:border-gray-700 flex justify-end flex-shrink-0">
          <button onClick={handleSave}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistModal;