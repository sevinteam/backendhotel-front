
import React, { useState, useEffect, useRef } from 'react';
import { UploadIcon, TrashIcon, PlusIcon, SpinnerIcon } from './icons';
import AddStatisticModal, { type StatisticItem } from './AddStatisticModal';
import ConfirmationModal from './ConfirmationModal';

const initialStats: StatisticItem[] = [
    { id: 1, title: 'مشتریان عزیز ما که رزرو داشتن', value: '+1362' },
    { id: 2, title: 'رزرواسیون داخلی و خارجی هتل', value: '+389' },
    { id: 3, title: 'هتل های سفرنامه', value: '+54' },
    { id: 4, title: 'سابقه آژانس هتلداری سفرنامه', value: '3.5 سال' },
];

interface AboutUsConfigProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const AboutUsConfig: React.FC<AboutUsConfigProps> = ({ onShowToast }) => {
    // Main Config State
    const [title, setTitle] = useState('سفرنامه 24');
    const [description, setDescription] = useState('لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.');
    const [image, setImage] = useState<string | null>('https://images.unsplash.com/photo-1519055548599-6d4d129508c4?q=80&w=2070&auto=format&fit=crop');
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Stats State
    const [stats, setStats] = useState<StatisticItem[]>(() => {
        try {
            const saved = localStorage.getItem('aboutUsStats');
            return saved ? JSON.parse(saved) : initialStats;
        } catch {
            return initialStats;
        }
    });
    
    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<StatisticItem | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<StatisticItem | null>(null);

    const MAX_ITEMS = 4;

    useEffect(() => {
        localStorage.setItem('aboutUsStats', JSON.stringify(stats));
    }, [stats]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMainSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            if (onShowToast) onShowToast('تنظیمات درباره ما با موفقیت ذخیره شد', 'success');
            setIsSaving(false);
        }, 1000);
    };

    // Stats Handlers
    const handleOpenAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: StatisticItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSaveStat = (data: Omit<StatisticItem, 'id'>) => {
        if (editingItem) {
            setStats(prev => prev.map(s => s.id === editingItem.id ? { ...editingItem, ...data } : s));
            if (onShowToast) onShowToast(`آیتم "${data.title}" ویرایش شد`, 'success');
        } else {
            const newItem = {
                id: Date.now(),
                ...data
            };
            setStats(prev => [newItem, ...prev]);
            if (onShowToast) onShowToast(`آیتم "${data.title}" اضافه شد`, 'success');
        }
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleOpenDeleteModal = (item: StatisticItem) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            setStats(prev => prev.filter(s => s.id !== itemToDelete.id));
            if (onShowToast) onShowToast(`آیتم "${itemToDelete.title}" حذف شد`, 'success');
        }
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    return (
        <div className="flex flex-col gap-12 pb-8">
            {/* Top Configuration Section */}
            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">کانفیگ درباره ما</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200 font-semibold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">توضیحات</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={22}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200 leading-relaxed resize-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تصویر</label>
                        <div className="flex flex-col gap-4">
                            {image ? (
                                <div className="relative w-full aspect-square sm:aspect-video lg:aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                                    <img src={image} alt="About Us" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-transparent backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors"
                                        >
                                            تغییر تصویر
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full aspect-square rounded-xl bg-gray-100 dark:bg-gray-700/50 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                                    <span className="text-gray-400 dark:text-gray-500 text-sm">تصویری انتخاب نشده</span>
                                </div>
                            )}
                            
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-[#6D28D9] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                            >
                                <UploadIcon className="w-5 h-5" />
                                <span>آپلود عکس</span>
                            </button>
                            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">* حداکثر حجم 10 مگابایت می‌باشد.</p>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                className="hidden" 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        onClick={handleMainSave}
                        disabled={isSaving}
                        className="bg-[#6D28D9] text-white font-bold py-3 px-12 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center min-w-[120px]"
                    >
                        {isSaving ? <SpinnerIcon className="w-6 h-6 text-white" /> : 'ذخیره'}
                    </button>
                </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Statistical Items Section */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">آیتم های آماری</h2>
                    {stats.length < MAX_ITEMS && (
                        <button 
                            onClick={handleOpenAddModal}
                            className="bg-[#6D28D9] text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-opacity-90 transition-colors flex items-center gap-2"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span>افزودن</span>
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                                <th className="p-4 font-semibold text-center rounded-r-lg">ردیف</th>
                                <th className="p-4 font-semibold text-right">عنوان</th>
                                <th className="p-4 font-semibold text-right">زیرعنوان</th>
                                <th className="p-4 font-semibold text-left rounded-l-lg"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {stats.map((item, index) => (
                                <tr key={item.id} className="bg-white dark:bg-gray-800">
                                    <td className="p-4 text-center">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mx-auto">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{item.title}</td>
                                    <td className="p-4 text-gray-800 dark:text-gray-200 font-semibold" dir="ltr" style={{textAlign: 'right'}}>{item.value}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleOpenDeleteModal(item)}
                                                className="font-semibold py-2 px-6 rounded-lg text-xs h-10 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 whitespace-nowrap"
                                            >
                                                حذف
                                            </button>
                                            <button 
                                                onClick={() => handleOpenEditModal(item)}
                                                className="font-semibold py-2 px-6 rounded-lg text-xs h-10 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500 whitespace-nowrap"
                                            >
                                                ویرایش
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {stats.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        آیتمی یافت نشد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddStatisticModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveStat}
                itemToEdit={editingItem}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="حذف آیتم آماری"
                message={<>آیا از حذف آیتم "<strong>{itemToDelete?.title}</strong>" مطمئن هستید؟</>}
                confirmText="حذف"
                cancelText="انصراف"
                icon={<TrashIcon className="h-10 w-10 text-red-500" />}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                iconContainerClass="bg-red-100 dark:bg-red-900/50"
            />
        </div>
    );
};

export default AboutUsConfig;
