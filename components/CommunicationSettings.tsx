
import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, LocationMarkerIcon, PhoneIcon, MailIcon, CheckCircleIcon, XCircleIcon, TrashIcon } from './icons';
import Pagination from './Pagination';
import AddCommunicationModal, { type CommunicationChannel } from './AddCommunicationModal';
import ConfirmationModal from './ConfirmationModal';

const initialChannels: CommunicationChannel[] = [
    { id: 1, title: 'آدرس آژانس', subtitle: 'روی لینک پایین کلیک کنید!', value: 'View on Google Maps', link: '-', inFooter: true, icon: 'location' },
    { id: 2, title: 'ایمیل', subtitle: 'روی لینک پایین کلیک کنید!', value: 'View on Google Maps', link: '-', inFooter: true, icon: 'location' },
    { id: 3, title: 'شماره آژانس 3', subtitle: 'روی لینک پایین کلیک کنید!', value: 'View on Google Maps', link: '-', inFooter: false, icon: 'location' },
    { id: 4, title: 'شماره آژانس 1', subtitle: 'روی لینک پایین کلیک کنید!', value: 'View on Google Maps', link: '-', inFooter: true, icon: 'location' },
    { id: 5, title: 'شماره آژانس 2', subtitle: 'روی لینک پایین کلیک کنید!', value: 'View on Google Maps', link: '-', inFooter: true, icon: 'location' },
];

interface CommunicationSettingsProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const CommunicationSettings: React.FC<CommunicationSettingsProps> = ({ onShowToast }) => {
    const [channels, setChannels] = useState<CommunicationChannel[]>(() => {
        try {
            const saved = localStorage.getItem('communicationChannels');
            return saved ? JSON.parse(saved) : initialChannels;
        } catch {
            return initialChannels;
        }
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChannel, setEditingChannel] = useState<CommunicationChannel | null>(null);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [channelToDelete, setChannelToDelete] = useState<CommunicationChannel | null>(null);

    // Save channels to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('communicationChannels', JSON.stringify(channels));
    }, [channels]);

    const filteredChannels = channels.filter(channel => 
        channel.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredChannels.length / itemsPerPage);
    const paginatedChannels = filteredChannels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpenAddModal = () => {
        setEditingChannel(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (channel: CommunicationChannel) => {
        setEditingChannel(channel);
        setIsModalOpen(true);
    };

    const handleSaveChannel = (data: Omit<CommunicationChannel, 'id'>) => {
        if (editingChannel) {
            setChannels(prev => prev.map(c => c.id === editingChannel.id ? { ...editingChannel, ...data } : c));
            if (onShowToast) onShowToast(`آیتم "${data.title}" با موفقیت ویرایش شد`, 'success');
        } else {
            const newChannel = {
                id: Date.now(),
                ...data
            };
            setChannels(prev => [newChannel, ...prev]);
            if (onShowToast) onShowToast(`آیتم "${data.title}" با موفقیت اضافه شد`, 'success');
        }
        setIsModalOpen(false);
        setEditingChannel(null);
    };

    const handleOpenDeleteModal = (channel: CommunicationChannel) => {
        setChannelToDelete(channel);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (channelToDelete) {
            setChannels(prev => prev.filter(c => c.id !== channelToDelete.id));
            if (onShowToast) onShowToast(`آیتم "${channelToDelete.title}" با موفقیت حذف شد`, 'success');
        }
        setIsDeleteModalOpen(false);
        setChannelToDelete(null);
    };
    
    const getIconComponent = (type?: string) => {
        switch(type) {
            case 'phone': return <PhoneIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
            case 'mail': return <MailIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
            default: return <LocationMarkerIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-start">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">راه های ارتباطی</h2>
            </div>

            {/* Header Controls */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-auto">
                    <input 
                        type="text" 
                        placeholder="جستجوی راه ارتباطی ..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 pr-10 pl-4 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button onClick={handleOpenAddModal} className="flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-violet-700 transition-colors w-full sm:w-auto">
                    <PlusIcon className="w-5 h-5" />
                    <span>افزودن راه ارتباطی</span>
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
                                <th className="p-4 font-semibold text-right">زیر عنوان</th>
                                <th className="p-4 font-semibold text-center">مقدار</th>
                                <th className="p-4 font-semibold text-center">لینک</th>
                                <th className="p-4 font-semibold text-center">نمایش در فوتر</th>
                                <th className="p-4 font-semibold text-center">آیکون</th>
                                <th className="p-4 font-semibold text-left rounded-l-lg"></th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                             {paginatedChannels.map((channel, index) => (
                                <tr key={channel.id} className="bg-white dark:bg-gray-800">
                                    <td className="p-4 text-center">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mx-auto">
                                            {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{channel.title}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{channel.subtitle}</td>
                                    <td className="p-4 text-center font-semibold text-gray-700 dark:text-gray-300" dir="ltr">{channel.value}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-300">{channel.link}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            {channel.inFooter ? (
                                                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                            ) : (
                                                <XCircleIcon className="w-6 h-6 text-red-500" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                                {getIconComponent(channel.icon)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                         <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenDeleteModal(channel)} className="font-semibold py-2 px-4 rounded-lg text-xs h-10 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 whitespace-nowrap">
                                                حذف
                                            </button>
                                            <button onClick={() => handleOpenEditModal(channel)} className="font-semibold py-2 px-4 rounded-lg text-xs h-10 bg-gray-800 dark:bg-gray-600 text-white hover:bg-gray-700 dark:hover:bg-gray-500 whitespace-nowrap">
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
                    {paginatedChannels.map((channel, index) => (
                         <div key={channel.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                 <div>
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200">{channel.title}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{channel.subtitle}</p>
                                 </div>
                                 <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-8 h-8 flex items-center justify-center rounded-lg text-xs">
                                    {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300 mb-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-400 dark:text-gray-500">مقدار:</span>
                                    <span className="font-medium truncate" dir="ltr">{channel.value}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-400 dark:text-gray-500">لینک:</span>
                                    <span className="font-medium truncate">{channel.link}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 dark:text-gray-500">نمایش در فوتر:</span>
                                      {channel.inFooter ? <CheckCircleIcon className="w-4 h-4 text-green-600" /> : <XCircleIcon className="w-4 h-4 text-red-500" />}
                                </div>
                                 <div className="flex items-center gap-2">
                                    <span className="text-gray-400 dark:text-gray-500">آیکون:</span>
                                    <div className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                                        {React.cloneElement(getIconComponent(channel.icon) as React.ReactElement<{ className?: string }>, { className: "w-3 h-3 text-gray-600 dark:text-gray-300" })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => handleOpenDeleteModal(channel)} className="font-semibold py-2 px-4 rounded-lg text-xs h-9 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                    حذف
                                </button>
                                <button onClick={() => handleOpenEditModal(channel)} className="font-semibold py-2 px-4 rounded-lg text-xs h-9 bg-gray-800 dark:bg-gray-600 text-white hover:bg-gray-700 dark:hover:bg-gray-500">
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

            <AddCommunicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveChannel}
                channelToEdit={editingChannel}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="حذف راه ارتباطی"
                message={<>آیا از حذف راه ارتباطی "<strong>{channelToDelete?.title}</strong>" مطمئن هستید؟</>}
                confirmText="حذف"
                cancelText="انصراف"
                icon={<TrashIcon className="h-10 w-10 text-red-500" />}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                iconContainerClass="bg-red-100 dark:bg-red-900/50"
            />
        </div>
    );
};

export default CommunicationSettings;
