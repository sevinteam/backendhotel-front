
import React, { useState, useMemo } from 'react';
import { XIcon, SearchIcon, PlusIcon, TrashIcon } from './icons';

export interface IconOption {
    key: string;
    name: string;
    component: React.FC<{ className?: string }>;
}

interface IconSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (iconKey: string) => void;
  selectedIconKey: string;
  iconOptions: IconOption[];
  title?: string;
}

const IconSelectionModal: React.FC<IconSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedIconKey,
  iconOptions,
  title = 'لیست آیکون‌ها'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = useMemo(() => {
    return iconOptions.filter(icon => 
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      icon.key !== selectedIconKey
    );
  }, [searchTerm, selectedIconKey, iconOptions]);

  const currentIcon = iconOptions.find(i => i.key === selectedIconKey);

  const handleSelect = (key: string) => {
      onConfirm(key);
      onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[80] transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 my-8 mx-4 max-w-lg w-full transform transition-all duration-300 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 flex-1 overflow-y-auto pr-2 scrollbar-right text-right space-y-6">
          {/* Search */}
          <div className="relative">
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="جستجوی نام آیکون..."
              className="w-full p-2.5 pr-10 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
            />
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
          </div>

          {/* Selected Icon */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">آیکون انتخاب شده</h4>
            <div className="space-y-2">
              {currentIcon ? (
                <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center border border-gray-200 dark:border-gray-500">
                        <currentIcon.component className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                     </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{currentIcon.name}</span>
                  </div>
                  <button className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full opacity-50 cursor-not-allowed" title="غیرقابل حذف (یک آیکون باید انتخاب شود)">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">هیچ آیکونی انتخاب نشده است.</p>
              )}
            </div>
          </div>
          
          {/* Available Icons List */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">لیست آیکون‌ها</h4>
            <div className="space-y-2">
                {filteredIcons.map(icon => (
                    <div key={icon.key} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => handleSelect(icon.key)}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <icon.component className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </div>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{icon.name}</span>
                        </div>
                         <button className="p-1.5 text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/50 rounded-full hover:bg-violet-200 dark:hover:bg-violet-900 transition-colors">
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                 {filteredIcons.length === 0 && searchTerm && <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">نتیجه‌ای یافت نشد.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconSelectionModal;
