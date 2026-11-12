
import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, CheckCircleIcon, XCircleIcon, TrashIcon, WhatsAppIcon, TelegramIcon, InstagramIcon, LinkedInIcon, SoroushIcon } from './icons';
import Pagination from './Pagination';
import AddSocialNetworkModal, { type SocialNetwork } from './AddSocialNetworkModal';
import ConfirmationModal from './ConfirmationModal';

const initialNetworks: SocialNetwork[] = [
    { id: 1, title: 'whatapp', persianTitle: 'واتس آپ', link: '-', inFooter: true, icon: 'whatsapp' },
    { id: 2, title: 'telegram', persianTitle: 'تلگرام', link: '-', inFooter: true, icon: 'telegram' },
    { id: 3, title: 'instagram', persianTitle: 'اینستاگرام', link: '-', inFooter: false, icon: 'instagram' },
    { id: 4, title: 'linkedin', persianTitle: 'لینکدین', link: '-', inFooter: true, icon: 'linkedin' },
    { id: 5, title: 'sourosh', persianTitle: 'سروش', link: '-', inFooter: true, icon: 'soroush' },
];

interface SocialNetworksSettingsProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const SocialNetworksSettings: React.FC<SocialNetworksSettingsProps> = ({ onShowToast }) => {
    const [networks, setNetworks] = useState<SocialNetwork[]>(() => {
        try {
            const saved = localStorage.getItem('socialNetworks');
            return saved ? JSON.parse(saved) : initialNetworks;
        } catch {
            return initialNetworks;
        }
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNetwork, setEditingNetwork] = useState<SocialNetwork | null>(null);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [networkToDelete, setNetworkToDelete] = useState<SocialNetwork | null>(null);

    useEffect(() => {
        localStorage.setItem('socialNetworks', JSON.stringify(networks));
    }, [networks]);

    const filteredNetworks = networks.filter(network => 
        network.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        network.persianTitle.includes(searchQuery)
    );

    const totalPages = Math.ceil(filteredNetworks.length / itemsPerPage);
    const paginatedNetworks = filteredNetworks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpenAddModal = () => {
        setEditingNetwork(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (network: SocialNetwork) => {
        setEditingNetwork(network);
        setIsModalOpen(true);
    };

    const handleSaveNetwork = (data: Omit<SocialNetwork, 'id'>) => {
        if (editingNetwork) {
            setNetworks(prev => prev.map(n => n.id === editingNetwork.id ? { ...editingNetwork, ...data } : n));
            if (onShowToast) onShowToast(`شبکه "${data.persianTitle}" با موفقیت ویرایش شد`, 'success');
        } else {
            const newNetwork = {
                id: Date.now(),
                ...data
            };
            setNetworks(prev => [newNetwork, ...prev]);
            if (onShowToast) onShowToast(`شبکه "${data.persianTitle}" با موفقیت اضافه شد`, 'success');
        }
        setIsModalOpen(false);
        setEditingNetwork(null);
    };

    const handleOpenDeleteModal = (network: SocialNetwork) => {
        setNetworkToDelete(network);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (networkToDelete) {
            setNetworks(prev => prev.filter(n => n.id !== networkToDelete.id));
            if (onShowToast) onShowToast(`شبکه "${networkToDelete.persianTitle}" با موفقیت حذف شد`, 'success');
        }
        setIsDeleteModalOpen(false);
        setNetworkToDelete(null);
    };
    
    const getIconComponent = (type: string) => {
        switch(type) {
            case 'whatsapp': return <WhatsAppIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
            case 'telegram': return <TelegramIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
            case 'instagram': return <InstagramIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
            case 'linkedin': return <LinkedInIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
            case 'soroush': return <SoroushIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
            default: return <WhatsAppIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-start">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">شبکه های اجتماعی</h2>
            </div>

            {/* Header Controls */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-auto">
                    <input 
                        type="text" 
                        placeholder="جستجوی شبکه اجتماعی ..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 pr-10 pl-4 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button onClick={handleOpenAddModal} className="flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-violet-700 transition-colors w-full sm:w-auto">
                    <PlusIcon className="w-5 h-5" />
                    <span>افزودن شبکه های اجتماعی</span>
                </button>
            </div>
            
            <div className="overflow-x-auto">
                 {/* Desktop Table */}
                <div className="hidden lg:block">
                    <table className="w-full text-sm text-right">
                         <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                                <th className="p-4 font-semibold text-center rounded-r-lg">ردیف</th>
                                <th className="p-4 font-semibold text-right">عنوان</th>
                                <th className="p-4 font-semibold text-right">عنوان به فارسی</th>
                                <th className="p-4 font-semibold text-center">لینک</th>
                                <th className="p-4 font-semibold text-center">نمایش در فوتر</th>
                                <th className="p-4 font-semibold text-center">آیکون</th>
                                <th className="p-4 font-semibold text-left rounded-l-lg"></th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                             {paginatedNetworks.map((network, index) => (
                                <tr key={network.id} className="bg-white dark:bg-gray-800">
                                    <td className="p-4 text-center">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mx-auto">
                                            {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200" dir="ltr" style={{textAlign: 'right'}}>{network.title}</td>
                                    <td className="p-4 text-gray-800 dark:text-gray-200 font-semibold">{network.persianTitle}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-300">{network.link}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            {network.inFooter ? (
                                                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                            ) : (
                                                <XCircleIcon className="w-6 h-6 text-red-500" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            {getIconComponent(network.icon)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                         <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenDeleteModal(network)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 whitespace-nowrap">
                                                حذف
                                            </button>
                                            <button onClick={() => handleOpenEditModal(network)} className="font-semibold py-2 px-6 rounded-lg text-xs h-10 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500 whitespace-nowrap">
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
                    {paginatedNetworks.map((network, index) => (
                         <div key={network.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                 <div className='flex items-center gap-3'>
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                        {getIconComponent(network.icon)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-gray-200">{network.persianTitle}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" dir="ltr">{network.title}</p>
                                    </div>
                                 </div>
                                 <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-8 h-8 flex items-center justify-center rounded-lg text-xs">
                                    {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300 mb-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex flex-col gap-1 col-span-2">
                                    <span className="text-gray-400 dark:text-gray-500">لینک:</span>
                                    <span className="font-medium truncate">{network.link}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 dark:text-gray-500">نمایش در فوتر:</span>
                                      {network.inFooter ? <CheckCircleIcon className="w-4 h-4 text-green-600" /> : <XCircleIcon className="w-4 h-4 text-red-500" />}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => handleOpenDeleteModal(network)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                    حذف
                                </button>
                                <button onClick={() => handleOpenEditModal(network)} className="font-semibold py-2 px-6 rounded-lg text-xs h-9 bg-[#353535] dark:bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-gray-500">
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

            <AddSocialNetworkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveNetwork}
                networkToEdit={editingNetwork}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="حذف شبکه اجتماعی"
                message={<>آیا از حذف شبکه اجتماعی "<strong>{networkToDelete?.persianTitle}</strong>" مطمئن هستید؟</>}
                confirmText="حذف"
                cancelText="انصراف"
                icon={<TrashIcon className="h-10 w-10 text-red-500" />}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                iconContainerClass="bg-red-100 dark:bg-red-900/50"
            />
        </div>
    );
};

export default SocialNetworksSettings;
