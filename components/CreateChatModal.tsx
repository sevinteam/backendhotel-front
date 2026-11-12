
import React, { useState, useMemo } from 'react';
import { XIcon, SearchIcon, UserIcon } from './icons';
import type { UserReference } from '../types';
import CustomSelect from './CustomSelect';

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (user: UserReference, department: string) => void;
  users: UserReference[];
}

const departmentOptions = [
    { value: 'پشتیبانی', label: 'پشتیبانی' },
    { value: 'فروش', label: 'فروش' },
    { value: 'مالی', label: 'مالی' },
    { value: 'مدیریت', label: 'مدیریت' },
    { value: 'فنی', label: 'فنی' },
];

const CreateChatModal: React.FC<CreateChatModalProps> = ({ isOpen, onClose, onConfirm, users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserReference | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('پشتیبانی');

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleConfirm = () => {
    if (selectedUser && selectedDepartment) {
        onConfirm(selectedUser, selectedDepartment);
        onClose();
        // Reset state
        setSelectedUser(null);
        setSelectedDepartment('پشتیبانی');
        setSearchTerm('');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[80] transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 m-4 max-w-md w-full transform transition-all duration-300 flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">ایجاد چت جدید</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 flex-1 overflow-y-auto pr-2 scrollbar-right text-right space-y-6">
          
          {/* User Selection Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">انتخاب کاربر</label>
            <div className="relative mb-3">
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="جستجوی نام کاربر..."
                    className="w-full p-2.5 pr-10 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-sm text-gray-800 dark:text-gray-200"
                />
                <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-48 overflow-y-auto scrollbar-right bg-gray-50 dark:bg-gray-700/30">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <div 
                            key={user.id} 
                            onClick={() => setSelectedUser(user)}
                            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'bg-violet-100 dark:bg-violet-900/40' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                    <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                                </div>
                            )}
                            <span className={`text-sm ${selectedUser?.id === user.id ? 'font-bold text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                {user.name}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 py-4">کاربری یافت نشد</p>
                )}
            </div>
          </div>

          {/* Department Selection */}
          <div>
             <CustomSelect
                label="انتخاب دپارتمان"
                options={departmentOptions}
                value={selectedDepartment}
                onChange={setSelectedDepartment}
             />
          </div>

        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t dark:border-gray-700 flex justify-end flex-shrink-0">
          <button 
            onClick={handleConfirm}
            disabled={!selectedUser}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            ایجاد چت
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChatModal;
