import React, { useState, useMemo, useEffect } from 'react';
import type { Notification, NotificationStatus, UserReference } from '../types';
import { PlusIcon, SearchIcon, CheckCircleIcon, XCircleIcon, TrashIcon } from './icons';
import Pagination from './Pagination';
import ConfirmationModal from './ConfirmationModal';
import AddNotificationModal from './AddNotificationModal';

// Mock users for the modal
const allUsersForModal: UserReference[] = [
    { id: 1, name: 'علیرضا آذرخش آلوچه', avatar: 'https://randomuser.me/api/portraits/men/34.jpg' },
    { id: 2, name: 'علیرضا علوی', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
    { id: 3, name: 'پرهام رحیمی', avatar: 'https://randomuser.me/api/portraits/men/62.jpg' },
    { id: 4, name: 'محمد علی خاکیان', avatar: 'https://randomuser.me/api/portraits/men/63.jpg' },
    { id: 5, name: 'حسن خلیلی پور', avatar: 'https://randomuser.me/api/portraits/men/81.jpg' },
    { id: 6, name: 'امیر حسین کریمیان', avatar: 'https://randomuser.me/api/portraits/men/83.jpg' },
    { id: 7, name: 'علیرضا کمکیان', avatar: 'https://randomuser.me/api/portraits/men/85.jpg' },
    { id: 8, name: 'امیر پاشا اسکندری', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 9, name: 'سارا محمدی', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
];

// داده‌های نمونه برای نوتیفیکیشن‌ها
const initialNotificationsData: Notification[] = [
  { id: 1, title: 'تخفیف ویژه عیدانه', date: '۱۴۰۴/۰۸/۲۴', time: '۲۲:۱۶', status: 'مهم', sentToAll: true, description: 'چرا وقتی نشون میداد درصدو، آقای رحیمی میخند؟ چرا دیر نشون دادن؟', users: [allUsersForModal[0], allUsersForModal[1], allUsersForModal[2]], readBy: [allUsersForModal[0]] },
  { id: 2, title: 'تخفیف ویژه رمضانه', date: '۱۴۰۴/۰۸/۲۴', time: '۲۲:۱۶', status: 'جدید', sentToAll: true, description: 'توضیحات تست', users: [allUsersForModal[3], allUsersForModal[4]] },
  { id: 3, title: 'تخفیف ویژه پاییزه', date: '۱۴۰۴/۰۸/۲۴', time: '۲۲:۱۶', status: 'مهم', sentToAll: true },
  { id: 4, title: 'تخفیف ویژه زمستانه', date: '۱۴۰۴/۰۸/۲۴', time: '۲۲:۱۶', status: 'جدید', sentToAll: false, users: [allUsersForModal[1]] },
  { id: 5, title: 'تخفیف ویژه یلدانه', date: '۱۴۰۴/۰۸/۲۴', time: '۲۲:۱۶', status: 'مهم', sentToAll: false, users: [allUsersForModal[2], allUsersForModal[3]] },
  { id: 6, title: 'تخفیف ویژه دردانه', date: '۱۴۰۴/۰۸/۲۴', time: '۲۲:۱۶', status: 'مهم', sentToAll: false, users: [] },
  { id: 7, title: 'تخفیف ویژه محرمانه', date: '۱۴۰۴/۰۸/۲۴', time: '۲۲:۱۶', status: 'مهم', sentToAll: false },
  { id: 8, title: 'تخفیف ویژه مجسمانه', date: '۱۴۰۴/۰۸/۲۴', time: '۲۲:۱۶', status: 'مهم', sentToAll: false },
  { id: 9, title: 'تخفیف ویژه کریسمس', date: '۱۴۰۴/۰۸/۲۴', time: '۲۲:۱۶', status: 'مهم', sentToAll: false },
  { id: 10, title: 'اطلاعیه تعمیرات سرور', date: '۱۴۰۴/۰۸/۲۰', time: '۱۰:۳۰', status: 'جدید', sentToAll: true },
  { id: 11, title: 'آپدیت جدید اپلیکیشن', date: '۱۴۰۴/۰۸/۱۹', time: '۱۸:۰۰', status: 'جدید', sentToAll: true },
  { id: 12, title: 'نظرسنجی رضایت مشتریان', date: '۱۴۰۴/۰۸/۱۵', time: '۱۲:۰۰', status: 'جدید', sentToAll: false, users: [allUsersForModal[0]] },
];

const StatusBadge: React.FC<{ status: NotificationStatus }> = ({ status }) => {
    const styles: Record<NotificationStatus, string> = {
        'مهم': 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
        'جدید': 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
    };
    return (
        <span className={`inline-flex justify-center items-center w-24 px-3 py-1.5 text-xs font-semibold rounded-md ${styles[status] || ''}`}>
            {status}
        </span>
    );
};

interface NotificationManagementProps {
    onShowToast: (message: string, type: 'success' | 'error') => void;
}

const NotificationManagement: React.FC<NotificationManagementProps> = ({ onShowToast }) => {
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        try {
            const savedNotifications = localStorage.getItem('notifications');
            return savedNotifications ? JSON.parse(savedNotifications) : initialNotificationsData;
        } catch (error) {
            console.error("Failed to load notifications from localStorage", error);
            return initialNotificationsData;
        }
    });
    
    useEffect(() => {
        try {
            localStorage.setItem('notifications', JSON.stringify(notifications));
        } catch (error) {
            console.error("Failed to save notifications to localStorage", error);
        }
    }, [notifications]);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; notification: Notification | null }>({ isOpen: false, notification: null });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
    const itemsPerPage = 9;

    const filteredNotifications = useMemo(() => {
        if (!searchQuery.trim()) return notifications;
        const lowercasedQuery = searchQuery.toLowerCase().trim();
        return notifications.filter(notif => notif.title.toLowerCase().includes(lowercasedQuery));
    }, [searchQuery, notifications]);

    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const paginatedNotifications = filteredNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpenAddModal = () => {
        setEditingNotification(null);
        setIsAddModalOpen(true);
    };

    const handleOpenEditModal = (notification: Notification) => {
        setEditingNotification(notification);
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingNotification(null);
    };
    
    const handleSaveNotification = (data: Omit<Notification, 'id' | 'date' | 'time' | 'readBy'>) => {
        const today = new Date();
        const dateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const timeFormatter = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        const currentDate = dateFormatter.format(today);
        const currentTime = timeFormatter.format(today);

        if (editingNotification) {
            // Update
            const updatedNotification = { ...editingNotification, ...data, date: currentDate, time: currentTime };
            setNotifications(prev => prev.map(n => n.id === editingNotification.id ? updatedNotification : n));
            onShowToast('اعلان با موفقیت ویرایش شد', 'success');
        } else {
            // Add
            const newNotification: Notification = {
                id: Date.now(),
                ...data,
                date: currentDate,
                time: currentTime,
            };
            setNotifications(prev => [newNotification, ...prev]);
            onShowToast('اعلان با موفقیت ایجاد شد', 'success');
        }
        handleCloseModal();
    };

    const handleOpenDeleteModal = (notification: Notification) => {
        setDeleteModalState({ isOpen: true, notification });
    };

    const handleConfirmDelete = () => {
        if (deleteModalState.notification) {
            setNotifications(prev => prev.filter(n => n.id !== deleteModalState.notification!.id));
            onShowToast(`نوتیفیکیشن "${deleteModalState.notification.title}" حذف شد.`, 'success');
        }
        setDeleteModalState({ isOpen: false, notification: null });
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex-1 flex flex-col">
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="جستجو..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 pr-10 pl-4 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                        />
                        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button onClick={handleOpenAddModal} className="flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-violet-700 transition-colors w-full sm:w-auto">
                        <PlusIcon className="w-5 h-5" />
                        <span>ایجاد اعلان جدید</span>
                    </button>
                </div>

                <div className="flex-1 overflow-auto">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        <table className="w-full text-sm text-right">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                                    <th className="p-4 font-semibold text-center rounded-r-lg">ردیف</th>
                                    <th className="p-4 font-semibold text-right">عنوان اعلان</th>
                                    <th className="p-4 font-semibold text-center">تاریخ</th>
                                    <th className="p-4 font-semibold text-center">ساعت</th>
                                    <th className="p-4 font-semibold text-center">وضعیت</th>
                                    <th className="p-4 font-semibold text-center">ارسال برای همه</th>
                                    <th className="p-4 font-semibold text-left rounded-l-lg"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {paginatedNotifications.map((notif, index) => (
                                    <tr key={notif.id}>
                                        <td className="p-4 text-center">
                                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mx-auto">
                                                {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                            </span>
                                        </td>
                                        <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{notif.title}</td>
                                        <td className="p-4 text-center text-gray-600 dark:text-gray-300">{notif.date}</td>
                                        <td className="p-4 text-center text-gray-600 dark:text-gray-300">{notif.time}</td>
                                        <td className="p-4 text-center">
                                            <StatusBadge status={notif.status} />
                                        </td>
                                        <td className="p-4 text-center">
                                            {notif.sentToAll ? <CheckCircleIcon className="w-6 h-6 text-green-500 mx-auto"/> : <XCircleIcon className="w-6 h-6 text-red-500 mx-auto"/>}
                                        </td>
                                        <td className="p-4 text-left">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenEditModal(notif)} className="font-semibold py-2 px-5 rounded-lg text-xs whitespace-nowrap h-10 transition-colors bg-gray-800 dark:bg-gray-600 text-white">
                                                    مشاهده
                                                </button>
                                                <button onClick={() => handleOpenDeleteModal(notif)} className="p-2.5 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-500 dark:hover:text-red-400">
                                                    <TrashIcon className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {paginatedNotifications.map((notif, index) => (
                             <div key={notif.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-gray-800 dark:text-gray-200">{notif.title}</p>
                                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg">
                                        {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-xs border-t border-gray-200 dark:border-gray-600 pt-3">
                                    <div><strong className="text-gray-500 dark:text-gray-400">تاریخ:</strong> {notif.date}</div>
                                    <div><strong className="text-gray-500 dark:text-gray-400">ساعت:</strong> {notif.time}</div>
                                </div>
                                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-3">
                                     <StatusBadge status={notif.status} />
                                     <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">ارسال همگانی:</span>
                                        {notif.sentToAll ? <CheckCircleIcon className="w-5 h-5 text-green-500"/> : <XCircleIcon className="w-5 h-5 text-red-500"/>}
                                     </div>
                                </div>
                                <div className="flex justify-end pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleOpenDeleteModal(notif)} className="p-2.5 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-500 dark:hover:text-red-400">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => handleOpenEditModal(notif)} className="font-semibold py-2 px-5 rounded-lg text-xs h-10 bg-gray-800 dark:bg-gray-600 text-white">
                                            مشاهده
                                        </button>
                                    </div>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>

                 {totalPages > 1 && (
                    <div className="mt-auto pt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
            <ConfirmationModal
                isOpen={deleteModalState.isOpen}
                onClose={() => setDeleteModalState({ isOpen: false, notification: null })}
                onConfirm={handleConfirmDelete}
                title="حذف نوتیفیکیشن"
                message={<>آیا از حذف نوتیفیکیشن "<strong>{deleteModalState.notification?.title}</strong>" مطمئن هستید؟</>}
                icon={<TrashIcon className="h-10 w-10 text-red-500" />}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                iconContainerClass="bg-red-100 dark:bg-red-900/50"
                confirmText="حذف"
                cancelText="انصراف"
            />
             <AddNotificationModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveNotification}
                notificationToEdit={editingNotification}
                allUsers={allUsersForModal}
            />
        </>
    );
};

export default NotificationManagement;