
import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, TrashIcon } from './icons';
import Pagination from './Pagination';
import AddSlideModal, { type SlideItem } from './AddSlideModal';
import ConfirmationModal from './ConfirmationModal';

const initialSlides: SlideItem[] = [
    { 
        id: 1, 
        title: 'تخفیف ویژه بلک فرایدی', 
        sortOrder: 1, 
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop' 
    },
    { 
        id: 2, 
        title: 'هتل استقلال تهران', 
        sortOrder: 2, 
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop' 
    },
    { 
        id: 3, 
        title: 'هتل پارسیان آزادی', 
        sortOrder: 3, 
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop' 
    },
];

interface MainPageSlidesSettingsProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const MainPageSlidesSettings: React.FC<MainPageSlidesSettingsProps> = ({ onShowToast }) => {
    const [slides, setSlides] = useState<SlideItem[]>(() => {
        try {
            const saved = localStorage.getItem('mainPageSlides');
            return saved ? JSON.parse(saved) : initialSlides;
        } catch {
            return initialSlides;
        }
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<SlideItem | null>(null);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [slideToDelete, setSlideToDelete] = useState<SlideItem | null>(null);

    useEffect(() => {
        localStorage.setItem('mainPageSlides', JSON.stringify(slides));
    }, [slides]);

    const filteredSlides = slides.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredSlides.length / itemsPerPage);
    const paginatedSlides = filteredSlides.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpenAddModal = () => {
        setEditingSlide(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (slide: SlideItem) => {
        setEditingSlide(slide);
        setIsModalOpen(true);
    };

    const handleSaveSlide = (data: Omit<SlideItem, 'id'>) => {
        if (editingSlide) {
            setSlides(prev => prev.map(s => s.id === editingSlide.id ? { ...editingSlide, ...data } : s));
            if (onShowToast) onShowToast(`اسلاید "${data.title}" با موفقیت ویرایش شد`, 'success');
        } else {
            const newSlide = {
                id: Date.now(),
                ...data
            };
            setSlides(prev => [newSlide, ...prev]);
            if (onShowToast) onShowToast(`اسلاید "${data.title}" با موفقیت اضافه شد`, 'success');
        }
        setIsModalOpen(false);
        setEditingSlide(null);
    };

    const handleOpenDeleteModal = (slide: SlideItem) => {
        setSlideToDelete(slide);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (slideToDelete) {
            setSlides(prev => prev.filter(s => s.id !== slideToDelete.id));
            if (onShowToast) onShowToast(`اسلاید "${slideToDelete.title}" با موفقیت حذف شد`, 'success');
        }
        setIsDeleteModalOpen(false);
        setSlideToDelete(null);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-start">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">اسلایدهای صفحه اصلی</h2>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button onClick={handleOpenAddModal} className="flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-violet-700 transition-colors w-full sm:w-auto order-1 sm:order-2">
                    <PlusIcon className="w-5 h-5" />
                    <span>افزودن اسلاید</span>
                </button>
                <div className="relative w-full sm:w-auto order-2 sm:order-1">
                    <input 
                        type="text" 
                        placeholder="جستجوی اسلاید ..." 
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
                                <th className="p-4 font-semibold text-center">تصویر</th>
                                <th className="p-4 font-semibold text-right">عنوان</th>
                                <th className="p-4 font-semibold text-left rounded-l-lg"></th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                             {paginatedSlides.map((slide, index) => (
                                <tr key={slide.id} className="bg-white dark:bg-gray-800">
                                    <td className="p-4 text-center">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mx-auto">
                                            {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-gray-800 dark:text-gray-200 font-semibold">{slide.sortOrder}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            {slide.image ? (
                                                <img src={slide.image} alt={slide.title} className="w-20 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                                            ) : (
                                                <div className="w-20 h-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{slide.title}</td>
                                    <td className="p-4">
                                         <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenDeleteModal(slide)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 whitespace-nowrap">
                                                حذف
                                            </button>
                                            <button onClick={() => handleOpenEditModal(slide)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500 whitespace-nowrap">
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
                    {paginatedSlides.map((slide, index) => (
                         <div key={slide.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                 <div className="flex items-center gap-3">
                                    {slide.image && (
                                        <img src={slide.image} alt={slide.title} className="w-16 h-10 object-cover rounded-lg" />
                                    )}
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200">{slide.title}</h3>
                                 </div>
                                 <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-8 h-8 flex items-center justify-center rounded-lg text-xs">
                                    {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                </span>
                            </div>
                            
                            <div className="text-xs text-gray-600 dark:text-gray-300 mb-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 dark:text-gray-500">ترتیب:</span>
                                    <span className="font-bold">{slide.sortOrder}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => handleOpenDeleteModal(slide)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                    حذف
                                </button>
                                <button onClick={() => handleOpenEditModal(slide)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500">
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

            <AddSlideModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveSlide}
                slideToEdit={editingSlide}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="حذف اسلاید"
                message={<>آیا از حذف اسلاید "<strong>{slideToDelete?.title}</strong>" مطمئن هستید؟</>}
                confirmText="حذف"
                cancelText="انصراف"
                icon={<TrashIcon className="h-10 w-10 text-red-500" />}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                iconContainerClass="bg-red-100 dark:bg-red-900/50"
            />
        </div>
    );
};

export default MainPageSlidesSettings;
