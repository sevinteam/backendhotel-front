
import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, TrashIcon } from './icons';
import Pagination from './Pagination';
import AddHeaderMenuModal, { type HeaderMenuItem } from './AddHeaderMenuModal';
import ConfirmationModal from './ConfirmationModal';

const initialMenuItems: HeaderMenuItem[] = [
    { id: 1, sortOrder: 1, title: 'صفحه اصلی', page: 'صفحه اصلی' },
    { id: 2, sortOrder: 2, title: 'تماس با ما', page: 'تماس با ما' },
    { id: 3, sortOrder: 3, title: 'درباره ما', page: 'درباره ما' },
    { id: 4, sortOrder: 4, title: 'قوانین و مقررات', page: 'قوانین و مقررات' },
    { id: 5, sortOrder: 5, title: 'بهترین هتل‌ها', page: 'بهترین هتل‌ها' },
];

interface HeaderMenuSettingsProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const HeaderMenuSettings: React.FC<HeaderMenuSettingsProps> = ({ onShowToast }) => {
    const [menuItems, setMenuItems] = useState<HeaderMenuItem[]>(() => {
        try {
            const saved = localStorage.getItem('headerMenuItems');
            return saved ? JSON.parse(saved) : initialMenuItems;
        } catch {
            return initialMenuItems;
        }
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<HeaderMenuItem | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<HeaderMenuItem | null>(null);

    useEffect(() => {
        localStorage.setItem('headerMenuItems', JSON.stringify(menuItems));
    }, [menuItems]);

    const filteredItems = menuItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.page.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpenAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: HeaderMenuItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSaveItem = (data: Omit<HeaderMenuItem, 'id'>) => {
        if (editingItem) {
            setMenuItems(prev => prev.map(p => p.id === editingItem.id ? { ...editingItem, ...data } : p));
            if (onShowToast) onShowToast(`آیتم "${data.title}" با موفقیت ویرایش شد`, 'success');
        } else {
            const newItem = {
                id: Date.now(),
                ...data
            };
            setMenuItems(prev => [newItem, ...prev]);
            if (onShowToast) onShowToast(`آیتم "${data.title}" با موفقیت اضافه شد`, 'success');
        }
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleOpenDeleteModal = (item: HeaderMenuItem) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            setMenuItems(prev => prev.filter(p => p.id !== itemToDelete.id));
            if (onShowToast) onShowToast(`آیتم "${itemToDelete.title}" با موفقیت حذف شد`, 'success');
        }
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-start">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">منوی هدر</h2>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="جستجوی منوی هدر ..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 pr-10 pl-4 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button onClick={handleOpenAddModal} className="flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-violet-700 transition-colors w-full sm:w-auto">
                    <PlusIcon className="w-5 h-5" />
                    <span>افزودن منوی هدر</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <div className="hidden lg:block">
                    <table className="w-full text-sm text-right">
                         <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                                <th className="p-4 font-semibold text-center rounded-r-lg">ردیف</th>
                                <th className="p-4 font-semibold text-center">ترتیب</th>
                                <th className="p-4 font-semibold text-right">عنوان</th>
                                <th className="p-4 font-semibold text-right">صفحه</th>
                                <th className="p-4 font-semibold text-left rounded-l-lg"></th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                             {paginatedItems.map((item, index) => (
                                <tr key={item.id} className="bg-white dark:bg-gray-800">
                                    <td className="p-4 text-center">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mx-auto">
                                            {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-gray-800 dark:text-gray-200 font-semibold">{item.sortOrder}</td>
                                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{item.title}</td>
                                    <td className="p-4 text-gray-800 dark:text-gray-200 font-semibold">{item.page}</td>
                                    <td className="p-4">
                                         <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenDeleteModal(item)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 whitespace-nowrap">
                                                حذف
                                            </button>
                                            <button onClick={() => handleOpenEditModal(item)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500 whitespace-nowrap">
                                                ویرایش
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                             ))}
                         </tbody>
                    </table>
                </div>

                <div className="lg:hidden space-y-4">
                    {paginatedItems.map((item, index) => (
                         <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                 <h3 className="font-bold text-gray-800 dark:text-gray-200">{item.title}</h3>
                                 <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-8 h-8 flex items-center justify-center rounded-lg text-xs">
                                    {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                </span>
                            </div>

                            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300 mb-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-400 dark:text-gray-500">صفحه:</span>
                                    <span className="font-medium">{item.page}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-400 dark:text-gray-500">ترتیب:</span>
                                    <span className="font-medium">{item.sortOrder}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => handleOpenDeleteModal(item)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                    حذف
                                </button>
                                <button onClick={() => handleOpenEditModal(item)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500">
                                    ویرایش
                                </button>
                            </div>
                         </div>
                    ))}
                </div>
            </div>

             {totalPages > 1 && (
                <div className="mt-auto pt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            <AddHeaderMenuModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveItem}
                itemToEdit={editingItem}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="حذف منو"
                message={<>آیا از حذف منو "<strong>{itemToDelete?.title}</strong>" مطمئن هستید؟</>}
                confirmText="حذف"
                cancelText="انصراف"
                icon={<TrashIcon className="h-10 w-10 text-red-500" />}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                iconContainerClass="bg-red-100 dark:bg-red-900/50"
            />
        </div>
    );
};

export default HeaderMenuSettings;
