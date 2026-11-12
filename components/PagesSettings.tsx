
import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, TrashIcon } from './icons';
import Pagination from './Pagination';
import AddPageModal, { type PageItem, pageOptions } from './AddPageModal';
import ConfirmationModal from './ConfirmationModal';

const initialPages: PageItem[] = [
    { id: 1, title: 'قوانین و مقررات', pageName: 'قوانین سایت', path: '/rules' },
    { id: 2, title: 'تماس با ما', pageName: 'تماس با ما', path: '/contact-us' },
    { id: 3, title: 'درباره ما', pageName: 'درباره ما', path: '/about-us' },
    { id: 4, title: 'بهترین هتل‌ها', pageName: 'بهترین هتل‌ها', path: '/best-hotels' },
    { id: 5, title: 'صفحه اصلی', pageName: 'صفحه اصلی', path: '/#' },
];

interface PagesSettingsProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const PagesSettings: React.FC<PagesSettingsProps> = ({ onShowToast }) => {
    const [pages, setPages] = useState<PageItem[]>(() => {
        try {
            const saved = localStorage.getItem('sitePages');
            return saved ? JSON.parse(saved) : initialPages;
        } catch {
            return initialPages;
        }
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<PageItem | null>(null);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pageToDelete, setPageToDelete] = useState<PageItem | null>(null);

    // Calculate max pages based on available options (excluding default placeholder)
    const MAX_PAGES = pageOptions.filter(opt => opt.value !== '---------').length;

    useEffect(() => {
        localStorage.setItem('sitePages', JSON.stringify(pages));
    }, [pages]);

    const filteredPages = pages.filter(page => 
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.pageName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
    const paginatedPages = filteredPages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpenAddModal = () => {
        setEditingPage(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (page: PageItem) => {
        setEditingPage(page);
        setIsModalOpen(true);
    };

    const handleSavePage = (data: Omit<PageItem, 'id'>) => {
        if (editingPage) {
            setPages(prev => prev.map(p => p.id === editingPage.id ? { ...editingPage, ...data } : p));
            if (onShowToast) onShowToast(`صفحه "${data.title}" با موفقیت ویرایش شد`, 'success');
        } else {
            const newPage = {
                id: Date.now(),
                ...data
            };
            setPages(prev => [newPage, ...prev]);
            if (onShowToast) onShowToast(`صفحه "${data.title}" با موفقیت اضافه شد`, 'success');
        }
        setIsModalOpen(false);
        setEditingPage(null);
    };

    const handleOpenDeleteModal = (page: PageItem) => {
        setPageToDelete(page);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (pageToDelete) {
            setPages(prev => prev.filter(p => p.id !== pageToDelete.id));
            if (onShowToast) onShowToast(`صفحه "${pageToDelete.title}" با موفقیت حذف شد`, 'success');
        }
        setIsDeleteModalOpen(false);
        setPageToDelete(null);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-start">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">صفحات سایت</h2>
            </div>

            {/* Header Controls */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-auto">
                    <input 
                        type="text" 
                        placeholder="جستجوی صفحه ..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 pr-10 pl-4 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {pages.length < MAX_PAGES && (
                    <button onClick={handleOpenAddModal} className="flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-violet-700 transition-colors w-full sm:w-auto">
                        <PlusIcon className="w-5 h-5" />
                        <span>افزودن صفحه به سایت</span>
                    </button>
                )}
            </div>
            
            <div className="overflow-x-auto">
                 {/* Desktop Table */}
                <div className="hidden lg:block">
                    <table className="w-full text-sm text-right">
                         <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                                <th className="p-4 font-semibold text-center rounded-r-lg">ردیف</th>
                                <th className="p-4 font-semibold text-right">عنوان</th>
                                <th className="p-4 font-semibold text-right">نام صفحه</th>
                                <th className="p-4 font-semibold text-right">Path</th>
                                <th className="p-4 font-semibold text-left rounded-l-lg"></th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                             {paginatedPages.map((page, index) => (
                                <tr key={page.id} className="bg-white dark:bg-gray-800">
                                    <td className="p-4 text-center">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mx-auto">
                                            {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{page.title}</td>
                                    <td className="p-4 text-gray-800 dark:text-gray-200 font-semibold">{page.pageName}</td>
                                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200 text-right" dir="ltr">{page.path}</td>
                                    <td className="p-4">
                                         <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenDeleteModal(page)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 whitespace-nowrap">
                                                حذف
                                            </button>
                                            <button onClick={() => handleOpenEditModal(page)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500 whitespace-nowrap">
                                                ویرایش
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                             ))}
                         </tbody>
                    </table>
                </div>

                 {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                    {paginatedPages.map((page, index) => (
                         <div key={page.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                 <h3 className="font-bold text-gray-800 dark:text-gray-200">{page.title}</h3>
                                 <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-8 h-8 flex items-center justify-center rounded-lg text-xs">
                                    {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                </span>
                            </div>
                            
                            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300 mb-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-400 dark:text-gray-500">نام صفحه:</span>
                                    <span className="font-medium">{page.pageName}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-400 dark:text-gray-500">Path:</span>
                                    <span className="font-medium text-left truncate" dir="ltr">{page.path}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => handleOpenDeleteModal(page)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                    حذف
                                </button>
                                <button onClick={() => handleOpenEditModal(page)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500">
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

            <AddPageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePage}
                pageToEdit={editingPage}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="حذف صفحه"
                message={<>آیا از حذف صفحه "<strong>{pageToDelete?.title}</strong>" مطمئن هستید؟</>}
                confirmText="حذف"
                cancelText="انصراف"
                icon={<TrashIcon className="h-10 w-10 text-red-500" />}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                iconContainerClass="bg-red-100 dark:bg-red-900/50"
            />
        </div>
    );
};

export default PagesSettings;
