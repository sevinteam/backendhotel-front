
import React, { useState, useEffect } from 'react';
import { XIcon, SpinnerIcon } from './icons';
import CustomSelect from './CustomSelect';
import { pageOptions } from './AddPageModal';

export interface HeaderMenuItem {
    id: number;
    sortOrder: number;
    title: string;
    page: string;
}

interface AddHeaderMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<HeaderMenuItem, 'id'>) => void;
  itemToEdit: HeaderMenuItem | null;
}

const AddHeaderMenuModal: React.FC<AddHeaderMenuModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [page, setPage] = useState('---------');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!itemToEdit;

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setTitle(itemToEdit.title);
        setPage(itemToEdit.page || '---------');
        setSortOrder(String(itemToEdit.sortOrder));
      } else {
        setTitle('');
        setPage('---------');
        setSortOrder('');
      }
      setIsLoading(false);
    }
  }, [isOpen, itemToEdit]);

  const handleSave = () => {
    if (!title.trim() || page === '---------' || !sortOrder || isLoading) return;

    setIsLoading(true);

    setTimeout(() => {
        onSave({
          title,
          page,
          sortOrder: parseInt(sortOrder) || 0
        });
        setIsLoading(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[60] transition-opacity duration-300" onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 mx-4 max-w-lg w-full transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {isEditing ? 'ویرایش منوی هدر' : 'افزودن منوی هدر'}
                </h3>
                <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="py-6 space-y-6 text-right">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <CustomSelect
                        label="صفحه:"
                        options={pageOptions}
                        value={page}
                        onChange={setPage}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ترتیب:</label>
                        <input
                            type="number"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200 text-center"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t dark:border-gray-700 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isLoading || !title.trim() || page === '---------' || !sortOrder}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-12 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? <SpinnerIcon className="w-6 h-6 text-white" /> : 'ذخیره'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default AddHeaderMenuModal;
