import React, { useState, useEffect, useRef } from 'react';
import type { Notification, NotificationStatus, UserReference } from '../types';
import { XIcon, PlusIcon, CheckIcon, ChevronDownIcon } from './icons';
import UserSelectionModal from './UserSelectionModal';

interface AddNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Notification, 'id' | 'date' | 'time' | 'readBy'>) => void;
  notificationToEdit: Notification | null;
  allUsers: UserReference[];
}

const AddNotificationModal: React.FC<AddNotificationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  notificationToEdit,
  allUsers,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<NotificationStatus>('جدید');
  const [users, setUsers] = useState<UserReference[]>([]);
  const [sentToAll, setSentToAll] = useState(true);
  
  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  
  const isEditing = !!notificationToEdit;

  useEffect(() => {
    if (isOpen) {
      if (notificationToEdit) {
        setTitle(notificationToEdit.title);
        setDescription(notificationToEdit.description || '');
        setStatus(notificationToEdit.status);
        setUsers(notificationToEdit.users || []);
        setSentToAll(notificationToEdit.sentToAll);
      } else {
        // Reset form for new notification
        setTitle('');
        setDescription('');
        setStatus('جدید');
        setUsers([]);
        setSentToAll(true);
      }
    }
  }, [isOpen, notificationToEdit]);
  
   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    if (!title.trim()) {
      // Basic validation
      return;
    }
    onSave({
      title,
      description,
      status,
      users: sentToAll ? [] : users,
      sentToAll,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-start z-[60] transition-opacity duration-300 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 my-8 mx-4 max-w-2xl w-full transform transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{isEditing ? 'مشاهده و ویرایش اعلان' : 'اضافه کردن اعلان'}</h3>
            <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="py-6 space-y-6 text-right max-h-[70vh] overflow-y-auto px-6 scrollbar-right">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان اعلان را بنویسید"
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                  />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">وضعیت</label>
                    <div className="relative" ref={statusDropdownRef}>
                        <button onClick={() => setStatusDropdownOpen(prev => !prev)} className="w-full flex justify-between items-center text-right p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <span>{status}</span>
                            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isStatusDropdownOpen && (
                            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 z-10 overflow-hidden">
                                <button onClick={() => { setStatus('جدید'); setStatusDropdownOpen(false); }} className="w-full text-right p-3 hover:bg-gray-100 dark:hover:bg-gray-600">جدید</button>
                                <button onClick={() => { setStatus('مهم'); setStatusDropdownOpen(false); }} className="w-full text-right p-3 hover:bg-gray-100 dark:hover:bg-gray-600">مهم</button>
                            </div>
                        )}
                    </div>
                 </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">کاربران</label>
              <div className={`flex items-center gap-2 flex-wrap p-2 border border-gray-200 dark:border-gray-600 rounded-lg min-h-[52px] ${sentToAll ? 'bg-gray-100 dark:bg-gray-700/50' : ''}`}>
                {!sentToAll && users.map(user => (
                  <img key={user.id} src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" title={user.name} />
                ))}
                {!sentToAll && (
                  <button onClick={() => setUserModalOpen(true)} className="w-9 h-9 flex items-center justify-center bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                  </button>
                )}
                {sentToAll && <span className="text-sm text-gray-500 dark:text-gray-400 px-2">برای همه کاربران ارسال می‌شود</span>}
              </div>
            </div>
            
            {isEditing && notificationToEdit.readBy && notificationToEdit.readBy.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">خوانده شده توسط</label>
                    <div className="flex items-center gap-2 flex-wrap p-2 border border-gray-200 dark:border-gray-600 rounded-lg min-h-[52px] bg-gray-50 dark:bg-gray-700/50">
                    {notificationToEdit.readBy.map(user => (
                        <img key={user.id} src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" title={user.name} />
                    ))}
                    </div>
                </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">توضیحات</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات اعلان را وارد نمایید..."
                rows={5}
                className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200 resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
                <button onClick={() => setSentToAll(!sentToAll)} className={`w-6 h-6 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${sentToAll ? 'bg-violet-600 border-violet-600' : 'border-gray-300 dark:border-gray-500'}`}>
                    {sentToAll && <CheckIcon className="w-4 h-4 text-white"/>}
                </button>
                <label onClick={() => setSentToAll(!sentToAll)} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">ارسال برای همه کاربران</label>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t dark:border-gray-700 flex justify-end gap-4">
            <button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-12 rounded-lg transition-colors">
              ذخیره
            </button>
          </div>
        </div>
      </div>

      {isUserModalOpen && (
         <UserSelectionModal
            isOpen={isUserModalOpen}
            onClose={() => setUserModalOpen(false)}
            title="انتخاب کاربران"
            listTitle="لیست کاربران"
            allUsers={allUsers}
            selectedUsers={users}
            onConfirm={(selected) => {
                setUsers(selected);
                setUserModalOpen(false);
            }}
         />
      )}
    </>
  );
};

export default AddNotificationModal;