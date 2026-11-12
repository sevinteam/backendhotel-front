
import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, TrashIcon } from './icons';
import Pagination from './Pagination';
import AddReviewModal, { type ReviewItem } from './AddReviewModal';
import ConfirmationModal from './ConfirmationModal';

const initialReviews: ReviewItem[] = [
    { 
        id: 1, 
        name: 'علی محمدی', 
        review: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ', 
        rating: 1.5,
        assessment: 'ضعیف',
        image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    { 
        id: 2, 
        name: 'سارا احمدی', 
        review: 'خدمات عالی بود، بسیار راضی هستم.', 
        rating: 5.0,
        assessment: 'عالی',
        image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    { 
        id: 3, 
        name: 'رضا کاظمی', 
        review: 'برخورد پرسنل مناسب نبود ولی کیفیت هتل خوب بود.', 
        rating: 3.5,
        assessment: 'متوسط',
        image: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    { 
        id: 4, 
        name: 'مریم حسینی', 
        review: 'قیمت‌ها نسبت به کیفیت کمی بالا بود.', 
        rating: 2.5,
        assessment: 'متوسط',
        image: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    { 
        id: 5, 
        name: 'محمد نوری', 
        review: 'تجربه بسیار خوبی بود، حتما پیشنهاد می‌کنم.', 
        rating: 4.5,
        assessment: 'خوب',
        image: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
];

interface CustomerReviewsSettingsProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const CustomerReviewsSettings: React.FC<CustomerReviewsSettingsProps> = ({ onShowToast }) => {
    const [reviews, setReviews] = useState<ReviewItem[]>(() => {
        try {
            const saved = localStorage.getItem('customerReviews');
            return saved ? JSON.parse(saved) : initialReviews;
        } catch {
            return initialReviews;
        }
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<ReviewItem | null>(null);

    useEffect(() => {
        localStorage.setItem('customerReviews', JSON.stringify(reviews));
    }, [reviews]);

    const filteredReviews = reviews.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.review.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
    const paginatedReviews = filteredReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpenAddModal = () => {
        setEditingReview(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (review: ReviewItem) => {
        setEditingReview(review);
        setIsModalOpen(true);
    };

    const handleSaveReview = (data: Omit<ReviewItem, 'id'>) => {
        if (editingReview) {
            setReviews(prev => prev.map(r => r.id === editingReview.id ? { ...editingReview, ...data } : r));
            if (onShowToast) onShowToast(`نظر "${data.name}" با موفقیت ویرایش شد`, 'success');
        } else {
            const newReview = {
                id: Date.now(),
                ...data
            };
            setReviews(prev => [newReview, ...prev]);
            if (onShowToast) onShowToast(`نظر "${data.name}" با موفقیت اضافه شد`, 'success');
        }
        setIsModalOpen(false);
        setEditingReview(null);
    };

    const handleOpenDeleteModal = (review: ReviewItem) => {
        setReviewToDelete(review);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (reviewToDelete) {
            setReviews(prev => prev.filter(r => r.id !== reviewToDelete.id));
            if (onShowToast) onShowToast(`نظر "${reviewToDelete.name}" با موفقیت حذف شد`, 'success');
        }
        setIsDeleteModalOpen(false);
        setReviewToDelete(null);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-start">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">نظرات مشتریان</h2>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-auto">
                    <input 
                        type="text" 
                        placeholder="جستجوی تیکت کاربر ..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 pr-10 pl-4 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button onClick={handleOpenAddModal} className="flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-violet-700 transition-colors w-full sm:w-auto">
                    <PlusIcon className="w-5 h-5" />
                    <span>افزودن نظر</span>
                </button>
            </div>
            
            <div className="overflow-x-auto">
                 {/* Desktop Table */}
                <div className="hidden lg:block">
                    <table className="w-full text-sm text-right">
                         <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                                <th className="p-4 font-semibold text-center rounded-r-lg">ردیف</th>
                                <th className="p-4 font-semibold text-center">تصویر</th>
                                <th className="p-4 font-semibold text-right">نام و نام خانوادگی</th>
                                <th className="p-4 font-semibold text-center">ارزیابی</th>
                                <th className="p-4 font-semibold text-right">نظر</th>
                                <th className="p-4 font-semibold text-center">امتیاز</th>
                                <th className="p-4 font-semibold text-left rounded-l-lg"></th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                             {paginatedReviews.map((review, index) => (
                                <tr key={review.id} className="bg-white dark:bg-gray-800">
                                    <td className="p-4 text-center">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mx-auto">
                                            {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            {review.image ? (
                                                <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-bold">
                                                    {review.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{review.name}</td>
                                    <td className="p-4 text-center text-gray-800 dark:text-gray-200 font-bold">{review.assessment}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300 max-w-md truncate">{review.review}</td>
                                    <td className="p-4 text-center text-gray-800 dark:text-gray-200 font-semibold" dir="ltr">{review.rating.toFixed(1)}</td>
                                    <td className="p-4">
                                         <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenDeleteModal(review)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 whitespace-nowrap">
                                                حذف
                                            </button>
                                            <button onClick={() => handleOpenEditModal(review)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500 whitespace-nowrap">
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
                    {paginatedReviews.map((review, index) => (
                         <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    {review.image ? (
                                        <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 font-bold">
                                            {review.name.charAt(0)}
                                        </div>
                                    )}
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200">{review.name}</h3>
                                </div>
                                 <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-8 h-8 flex items-center justify-center rounded-lg text-xs flex-shrink-0">
                                    {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                </span>
                            </div>
                            
                            <div className="text-xs text-gray-600 dark:text-gray-300 mb-4 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400 dark:text-gray-500">ارزیابی:</span>
                                    <span className="font-bold">{review.assessment}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 dark:text-gray-500">امتیاز:</span>
                                    <span className="font-bold" dir="ltr">{review.rating}</span>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">{review.review}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => handleOpenDeleteModal(review)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                    حذف
                                </button>
                                <button onClick={() => handleOpenEditModal(review)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500">
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

            <AddReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveReview}
                reviewToEdit={editingReview}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="حذف نظر"
                message={<>آیا از حذف نظر "<strong>{reviewToDelete?.name}</strong>" مطمئن هستید؟</>}
                confirmText="حذف"
                cancelText="انصراف"
                icon={<TrashIcon className="h-10 w-10 text-red-500" />}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                iconContainerClass="bg-red-100 dark:bg-red-900/50"
            />
        </div>
    );
};

export default CustomerReviewsSettings;
