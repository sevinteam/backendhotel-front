
import React, { useState, useEffect, useMemo } from 'react';
import { XIcon, SearchIcon, PlusIcon } from './icons';
import type { UserReference } from '../types';

interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedUsers: UserReference[]) => void;
  title: string;
  allUsers: UserReference[]; // لیست تمام کاربران موجود
  selectedUsers: UserReference[]; // لیست کاربرانی که از قبل انتخاب شده‌اند
  showAvatars?: boolean;
  listTitle: string;
}

const UserSelectionModal: React.FC<UserSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  allUsers,
  selectedUsers,
  showAvatars = true,
  listTitle,
}) => {
  // state برای نگهداری انتخاب‌های فعلی در داخل مودال
  const [currentSelection, setCurrentSelection] = useState<UserReference[]>([]);
  // state برای متن جستجو
  const [searchTerm, setSearchTerm] = useState('');

  // useEffect برای همگام‌سازی انتخاب‌های فعلی با پراپرتی ورودی هنگام باز شدن مودال
  useEffect(() => {
    if (isOpen) {
      setCurrentSelection(selectedUsers);
      setSearchTerm(''); // پاک کردن جستجو هنگام باز شدن
    }
  }, [isOpen, selectedUsers]);

  // فیلتر کردن لیست کاربران برای نمایش (آنهایی که هنوز انتخاب نشده‌اند و با جستجو مطابقت دارند)
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !currentSelection.some(selected => selected.id === user.id)
    );
  }, [allUsers, searchTerm, currentSelection]);

  // تابع برای افزودن یک کاربر به لیست انتخاب شده‌ها
  const addUser = (user: UserReference) => {
    setCurrentSelection(prev => [...prev, user]);
  };

  // تابع برای حذف یک کاربر از لیست انتخاب شده‌ها
  const removeUser = (userId: number) => {
    setCurrentSelection(prev => prev.filter(user => user.id !== userId));
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[60] transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 my-8 mx-4 max-w-lg w-full transform transition-all duration-300 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* هدر مودال */}
        <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* بدنه مودال */}
        <div className="py-6 flex-1 overflow-y-auto pr-2 scrollbar-right text-right space-y-6">
          {/* فیلد جستجو */}
          <div className="relative">
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="جستجوی نام..."
              className="w-full p-2.5 pr-10 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400"
            />
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
          </div>

          {/* لیست کاربران انتخاب شده */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">افزوده شده</h4>
            <div className="space-y-2">
              {currentSelection.map(user => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {showAvatars && user.avatar && <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />}
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                  </div>
                  <button onClick={() => removeUser(user.id)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {currentSelection.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">موردی انتخاب نشده است.</p>}
            </div>
          </div>
          
          {/* لیست کاربران برای انتخاب */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">{listTitle}</h4>
            <div className="space-y-2">
                {filteredUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="flex items-center gap-3">
                            {showAvatars && user.avatar && <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />}
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                        </div>
                         <button onClick={() => addUser(user)} className="p-1.5 text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/50 rounded-full hover:bg-violet-200 dark:hover:bg-violet-900">
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                 {filteredUsers.length === 0 && searchTerm && <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">نتیجه‌ای یافت نشد.</p>}
            </div>
          </div>
        </div>

        {/* فوتر مودال */}
        <div className="mt-auto pt-4 border-t dark:border-gray-700 flex justify-end flex-shrink-0">
          <button onClick={() => onConfirm(currentSelection)}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            تایید
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSelectionModal;