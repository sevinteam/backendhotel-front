
import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, TrashIcon } from './icons';
import Pagination from './Pagination';
import AddBannerModal, { type BannerItem } from './AddBannerModal';
import ConfirmationModal from './ConfirmationModal';

const initialBanners: BannerItem[] = [
    { 
        id: 1, 
        sortOrder: 1, 
        page: 'صفحه اصلی',
        title: 'بنر سمت راست صفحه اصلی', 
        link: '-',
        image: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop' 
    },
    { 
        id: 2, 
        sortOrder: 2, 
        page: 'صفحه اصلی',
        title: 'بنر سمت راست صفحه اصلی', 
        link: '-',
        image: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=2029&auto=format&fit=crop' 
    },
    { 
        id: 3, 
        sortOrder: 3, 
        page: 'صفحه اصلی',
        title: 'بنر سمت راست صفحه اصلی', 
        link: '-',
        image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop' 
    },
    { 
        id: 4, 
        sortOrder: 4, 
        page: 'درباره ما',
        title: 'بنر سمت راست صفحه اصلی', 
        link: '-',
        image: 'https://images.unsplash.com/photo-1557682260-96773eb01377?q=80&w=2029&auto=format&fit=crop' 
    },
    { 
        id: 5, 
        sortOrder: 5, 
        page: 'درباره ما',
        title: 'بنر سمت راست صفحه اصلی', 
        link: '-',
        image: 'https://images.unsplash.com/photo-1557683304-673a23048d34?q=80&w=2029&auto=format&fit=crop' 
    },
];

interface BannersSettingsProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const BannersSettings: React.FC<BannersSettingsProps> = ({ onShowToast }) => {
    const [banners, setBanners] = useState<BannerItem[]>(() => {
        try {
            const saved = localStorage.getItem('siteBanners');
            return saved ? JSON.parse(saved) : initialBanners;
        } catch {
            return initialBanners;
        }
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<BannerItem | null>(null);

    useEffect(() => {
        localStorage.setItem('siteBanners', JSON.stringify(banners));
    }, [banners]);

    const filteredBanners = banners.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.page.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
    const paginatedBanners = filteredBanners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpenAddModal = () => {
        setEditingBanner(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (banner: BannerItem) => {
        setEditingBanner(banner);
        setIsModalOpen(true);
    };

    const handleSaveBanner = (data: Omit<BannerItem, 'id'>) => {
        if (editingBanner) {
            setBanners(prev => prev.map(b => b.id === editingBanner.id ? { ...editingBanner, ...data } : b));
            if (onShowToast) onShowToast(`بنر "${data.title}" با موفقیت ویرایش شد`, 'success');
        } else {
            const newBanner = {
                id: Date.now(),
                ...data
            };
            setBanners(prev => [newBanner, ...prev]);
            if (onShowToast) onShowToast(`بنر "${data.title}" با موفقیت اضافه شد`, 'success');
        }
        setIsModalOpen(false);
        setEditingBanner(null);
    };

    const handleOpenDeleteModal = (banner: BannerItem) => {
        setBannerToDelete(banner);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (bannerToDelete) {
            setBanners(prev => prev.filter(b => b.id !== bannerToDelete.id));
            if (onShowToast) onShowToast(`بنر "${bannerToDelete.title}" با موفقیت حذف شد`, 'success');
        }
        setIsDeleteModalOpen(false);
        setBannerToDelete(null);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-start">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">بنرها</h2>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button onClick={handleOpenAddModal} className="flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-violet-700 transition-colors w-full sm:w-auto order-1 sm:order-2">
                    <PlusIcon className="w-5 h-5" />
                    <span>افزودن بنر</span>
                </button>
                <div className="relative w-full sm:w-auto order-2 sm:order-1">
                    <input 
                        type="text" 
                        placeholder="جستجوی بنر ..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 pr-10 pl-4 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>
            
            <div className="overflow-x-auto">
                 {/* Desktop Table */}
                <div className="hidden lg:block">
                    <table className="w-full text-sm text-right">
                         <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                                <th className="p-4 font-semibold text-center rounded-r-lg">ردیف</th>
                                <th className="p-4 font-semibold text-center">ترتیب</th>
                                <th className="p-4 font-semibold text-right">صفحه</th>
                                <th className="p-4 font-semibold text-center">تصویر</th>
                                <th className="p-4 font-semibold text-right">عنوان</th>
                                <th className="p-4 font-semibold text-center">لینک</th>
                                <th className="p-4 font-semibold text-left rounded-l-lg"></th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                             {paginatedBanners.map((banner, index) => (
                                <tr key={banner.id} className="bg-white dark:bg-gray-800">
                                    <td className="p-4 text-center">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mx-auto">
                                            {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-gray-800 dark:text-gray-200 font-semibold">{banner.sortOrder}</td>
                                    <td className="p-4 text-gray-800 dark:text-gray-200 font-semibold">{banner.page}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            {banner.image ? (
                                                <img src={banner.image} alt={banner.title} className="w-16 h-10 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                                            ) : (
                                                <div className="w-16 h-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{banner.title}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-300 font-mono text-xs">{banner.link}</td>
                                    <td className="p-4">
                                         <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenDeleteModal(banner)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 whitespace-nowrap">
                                                حذف
                                            </button>
                                            <button onClick={() => handleOpenEditModal(banner)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500 whitespace-nowrap">
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
                    {paginatedBanners.map((banner, index) => (
                         <div key={banner.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                 <div className="flex items-center gap-3">
                                    {banner.image && (
                                        <img src={banner.image} alt={banner.title} className="w-14 h-10 object-cover rounded-lg" />
                                    )}
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{banner.title}</h3>
                                 </div>
                                 <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-8 h-8 flex items-center justify-center rounded-lg text-xs flex-shrink-0">
                                    {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                </span>
                            </div>
                            
                            <div className="text-xs text-gray-600 dark:text-gray-300 mb-4 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400 dark:text-gray-500">صفحه:</span>
                                    <span className="font-bold">{banner.page}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 dark:text-gray-500">ترتیب:</span>
                                    <span className="font-bold">{banner.sortOrder}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 dark:text-gray-500">لینک:</span>
                                    <span className="font-mono">{banner.link}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => handleOpenDeleteModal(banner)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                    حذف
                                </button>
                                <button onClick={() => handleOpenEditModal(banner)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500">
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

            <AddBannerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveBanner}
                bannerToEdit={editingBanner}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="حذف بنر"
                message={<>آیا از حذف بنر "<strong>{bannerToDelete?.title}</strong>" مطمئن هستید؟</>}
                confirmText="حذف"
                cancelText="انصراف"
                icon={<TrashIcon className="h-10 w-10 text-red-500" />}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                iconContainerClass="bg-red-100 dark:bg-red-900/50"
            />
        </div>
    );
};

export default BannersSettings;
