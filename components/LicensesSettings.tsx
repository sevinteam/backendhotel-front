
import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, TrashIcon } from './icons';
import Pagination from './Pagination';
import AddLicenseModal, { type LicenseItem } from './AddLicenseModal';
import ConfirmationModal from './ConfirmationModal';

const initialLicenses: LicenseItem[] = [
    { 
        id: 1, 
        title: 'انجمن صنفی رایانه‌ای', 
        description: 'https://irannsr.org', 
        image: null 
    },
    { 
        id: 2, 
        title: 'کسب و کارهای مجازی', 
        description: 'https://ecunion.ir', 
        image: null 
    },
    { 
        id: 3, 
        title: 'نشان ملی ثبت', 
        description: 'https://samandehi.ir', 
        image: null 
    },
];

interface LicensesSettingsProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const LicensesSettings: React.FC<LicensesSettingsProps> = ({ onShowToast }) => {
    const [licenses, setLicenses] = useState<LicenseItem[]>(() => {
        try {
            const saved = localStorage.getItem('siteLicenses');
            return saved ? JSON.parse(saved) : initialLicenses;
        } catch {
            return initialLicenses;
        }
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLicense, setEditingLicense] = useState<LicenseItem | null>(null);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [licenseToDelete, setLicenseToDelete] = useState<LicenseItem | null>(null);

    useEffect(() => {
        localStorage.setItem('siteLicenses', JSON.stringify(licenses));
    }, [licenses]);

    const filteredLicenses = licenses.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredLicenses.length / itemsPerPage);
    const paginatedLicenses = filteredLicenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpenAddModal = () => {
        setEditingLicense(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (license: LicenseItem) => {
        setEditingLicense(license);
        setIsModalOpen(true);
    };

    const handleSaveLicense = (data: Omit<LicenseItem, 'id'>) => {
        if (editingLicense) {
            setLicenses(prev => prev.map(l => l.id === editingLicense.id ? { ...editingLicense, ...data } : l));
            if (onShowToast) onShowToast(`مجوز "${data.title}" با موفقیت ویرایش شد`, 'success');
        } else {
            const newLicense = {
                id: Date.now(),
                ...data
            };
            setLicenses(prev => [newLicense, ...prev]);
            if (onShowToast) onShowToast(`مجوز "${data.title}" با موفقیت اضافه شد`, 'success');
        }
        setIsModalOpen(false);
        setEditingLicense(null);
    };

    const handleOpenDeleteModal = (license: LicenseItem) => {
        setLicenseToDelete(license);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (licenseToDelete) {
            setLicenses(prev => prev.filter(l => l.id !== licenseToDelete.id));
            if (onShowToast) onShowToast(`مجوز "${licenseToDelete.title}" با موفقیت حذف شد`, 'success');
        }
        setIsDeleteModalOpen(false);
        setLicenseToDelete(null);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-start">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">مجوزها</h2>
            </div>

            {/* Header Controls */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-auto">
                    <input 
                        type="text" 
                        placeholder="جستجوی مجوز ..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 pr-10 pl-4 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {licenses.length < 4 && (
                    <button onClick={handleOpenAddModal} className="flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-violet-700 transition-colors w-full sm:w-auto">
                        <PlusIcon className="w-5 h-5" />
                        <span>افزودن مجوز</span>
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
                                <th className="p-4 font-semibold text-center">تصویر</th>
                                <th className="p-4 font-semibold text-right">عنوان</th>
                                <th className="p-4 font-semibold text-center">لینک</th>
                                <th className="p-4 font-semibold text-left rounded-l-lg"></th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                             {paginatedLicenses.map((license, index) => (
                                <tr key={license.id} className="bg-white dark:bg-gray-800">
                                    <td className="p-4 text-center">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mx-auto">
                                            {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            {license.image ? (
                                                <img src={license.image} alt={license.title} className="w-12 h-12 object-contain rounded-xl bg-white p-1 border border-gray-200 dark:border-gray-700" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center shadow-inner">
                                                    <div className="w-8 h-8 rounded-lg border-2 border-white dark:border-gray-500 opacity-50"></div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{license.title}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-300 max-w-xs truncate" dir="ltr">
                                        <a href={license.description} target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">
                                            {license.description}
                                        </a>
                                    </td>
                                    <td className="p-4">
                                         <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenDeleteModal(license)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 whitespace-nowrap">
                                                حذف
                                            </button>
                                            <button onClick={() => handleOpenEditModal(license)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500 whitespace-nowrap">
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
                    {paginatedLicenses.map((license, index) => (
                         <div key={license.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                 <div className="flex items-center gap-3">
                                    {license.image ? (
                                        <img src={license.image} alt={license.title} className="w-12 h-12 object-contain rounded-xl bg-white p-1 border border-gray-200 dark:border-gray-700" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center shadow-inner">
                                            <div className="w-8 h-8 rounded-lg border-2 border-white dark:border-gray-500 opacity-50"></div>
                                        </div>
                                    )}
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200">{license.title}</h3>
                                 </div>
                                 <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-8 h-8 flex items-center justify-center rounded-lg text-xs">
                                    {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                </span>
                            </div>
                            
                            <div className="text-xs text-gray-600 dark:text-gray-300 mb-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <span className="block text-gray-400 dark:text-gray-500 mb-1">لینک:</span>
                                <a href={license.description} target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline break-all" dir="ltr">
                                    {license.description}
                                </a>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => handleOpenDeleteModal(license)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                    حذف
                                </button>
                                <button onClick={() => handleOpenEditModal(license)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500">
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

            <AddLicenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveLicense}
                licenseToEdit={editingLicense}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="حذف مجوز"
                message={<>آیا از حذف مجوز "<strong>{licenseToDelete?.title}</strong>" مطمئن هستید؟</>}
                confirmText="حذف"
                cancelText="انصراف"
                icon={<TrashIcon className="h-10 w-10 text-red-500" />}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                iconContainerClass="bg-red-100 dark:bg-red-900/50"
            />
        </div>
    );
};

export default LicensesSettings;
