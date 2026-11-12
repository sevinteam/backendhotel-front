import React, { useState, useEffect } from 'react';
import { XIcon, PlusIcon, PencilIcon } from './icons';
import type { Wishlist } from '../types';

interface AddWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (listName: string) => void;
  wishlistToEdit?: Wishlist | null;
}

const AddWishlistModal: React.FC<AddWishlistModalProps> = ({ isOpen, onClose, onConfirm, wishlistToEdit }) => {
  const [listName, setListName] = useState('');
  const isEditing = !!wishlistToEdit;

  useEffect(() => {
    if (isOpen) {
      setListName(isEditing ? wishlistToEdit.title : '');
    }
  }, [isOpen, isEditing, wishlistToEdit]);

  const handleConfirmClick = () => {
    if (listName.trim()) {
      onConfirm(listName.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex items-center justify-center z-[70]"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 m-4 max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center -mt-8">
          {isEditing ? 'ویرایش لیست علاقه مندی' : 'افزودن لیست علاقه مندی'}
        </h3>
        <hr className="border-gray-200 dark:border-gray-700 my-6" />
        <div className="space-y-6 text-right">
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="نام لیست خود را وارد نمایید"
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
          />
          <button
            onClick={handleConfirmClick}
            disabled={!listName.trim()}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
          >
            {isEditing ? <PencilIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
            <span>{isEditing ? 'ویرایش لیست' : 'افزودن لیست جدید'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWishlistModal;