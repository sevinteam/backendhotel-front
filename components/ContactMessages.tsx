import React, { useState, useMemo } from 'react';
import type { ContactMessage, ContactMessageStatus } from '../types';
import { SearchIcon } from './icons';
import Pagination from './Pagination';
import ConfirmationModal from './ConfirmationModal';
import ViewMessageModal from './ViewMessageModal';
import FilterMessagesModal from './FilterMessagesModal';


const StatusBadge: React.FC<{ status: ContactMessageStatus }> = ({ status }) => {
    const styles: Record<ContactMessageStatus, string> = {
        'خوانده نشده': 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
        'خوانده شده': 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
    };
    return (
        <span className={`inline-flex justify-center items-center w-24 px-3 py-1.5 text-xs font-semibold rounded-md ${styles[status] || ''}`}>
            {status}
        </span>
    );
};

interface ContactMessagesProps {
    messages: ContactMessage[];
    onUpdateMessages: (messages: ContactMessage[]) => void;
    onShowToast: (message: string, type: 'success' | 'error') => void;
}

// Helper functions for date comparison
const parsePersianDate = (dateStr: string): { year: number; month: number; day: number } | null => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const toEn = (s: string) => parseInt(s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()), 10);
    return { year: toEn(parts[0]), month: toEn(parts[1]), day: toEn(parts[2]) };
};

const dateToTimestamp = (date: { year: number; month: number; day: number } | null): number => {
    if (!date) return 0;
    return date.year * 372 + date.month * 31 + date.day;
};


const ContactMessages: React.FC<ContactMessagesProps> = ({ messages, onUpdateMessages, onShowToast }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; message: ContactMessage | null }>({ isOpen: false, message: null });
    const [viewModalState, setViewModalState] = useState<{ isOpen: boolean; message: ContactMessage | null }>({ isOpen: false, message: null });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState<{
        dateRange: { start: string; end: string } | null;
        status: ContactMessageStatus | null;
    }>({ dateRange: null, status: null });

    const itemsPerPage = 8;

    const filteredMessages = useMemo(() => {
        let filtered = [...messages];

        // Apply search query first
        if (searchQuery.trim()) {
            const lowercasedQuery = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(msg =>
                msg.name.toLowerCase().includes(lowercasedQuery) ||
                msg.phone.includes(lowercasedQuery) ||
                msg.subject.toLowerCase().includes(lowercasedQuery)
            );
        }
        
        // Apply status filter
        if (filters.status) {
            filtered = filtered.filter(msg => msg.status === filters.status);
        }
        
        // Apply date range filter
        if (filters.dateRange) {
            const startTimestamp = dateToTimestamp(parsePersianDate(filters.dateRange.start));
            const endTimestamp = dateToTimestamp(parsePersianDate(filters.dateRange.end));

            if (startTimestamp && endTimestamp) {
                filtered = filtered.filter(msg => {
                    const msgTimestamp = dateToTimestamp(parsePersianDate(msg.date));
                    return msgTimestamp >= startTimestamp && msgTimestamp <= endTimestamp;
                });
            }
        }

        return filtered;
    }, [searchQuery, messages, filters]);

    const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
    const paginatedMessages = filteredMessages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleViewMessage = (message: ContactMessage) => {
        setViewModalState({ isOpen: true, message });
        // Mark as read and notify parent
        const updatedMessages = messages.map(msg => msg.id === message.id ? { ...msg, status: 'خوانده شده' as ContactMessageStatus } : msg);
        onUpdateMessages(updatedMessages);
    };

    const handleDelete = (message: ContactMessage) => {
        setDeleteModalState({ isOpen: true, message });
    };
    
    const handleConfirmDelete = () => {
        if (deleteModalState.message) {
            const updatedMessages = messages.filter(msg => msg.id !== deleteModalState.message!.id);
            onUpdateMessages(updatedMessages);
            onShowToast(`پیام از طرف "${deleteModalState.message.name}" حذف شد.`, 'success');
        }
        setDeleteModalState({ isOpen: false, message: null });
    };

    const handleApplyFilters = (newFilters: { dateRange: { start: string; end: string } | null; status: ContactMessageStatus | null }) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page after filtering
        setIsFilterModalOpen(false);
    };

    const handleClearFilters = () => {
        setFilters({ dateRange: null, status: null });
        setCurrentPage(1);
        setIsFilterModalOpen(false);
    };


    const FilterIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
    );

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-grow sm:flex-grow-0">
                            <input
                                type="text"
                                placeholder="جستجو..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 pr-10 pl-4 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        <button onClick={() => setIsFilterModalOpen(true)} className="flex items-center justify-center p-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                            <FilterIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        <table className="w-full text-sm text-right">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                                    <th className="p-4 font-semibold text-center rounded-r-lg">ردیف</th>
                                    <th className="p-4 font-semibold text-right">نام و نام خانوادگی</th>
                                    <th className="p-4 font-semibold text-center">تاریخ</th>
                                    <th className="p-4 font-semibold text-right">موضوع</th>
                                    <th className="p-4 font-semibold text-center">وضعیت</th>
                                    <th className="p-4 font-semibold text-left rounded-l-lg"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {paginatedMessages.map((msg, index) => (
                                    <tr key={msg.id}>
                                        <td className="p-4 text-center">
                                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mx-auto">
                                                {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">{msg.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{msg.phone}</p>
                                        </td>
                                        <td className="p-4 text-center text-gray-600 dark:text-gray-300">{msg.date}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{msg.subject}</td>
                                        <td className="p-4 text-center">
                                            <StatusBadge status={msg.status} />
                                        </td>
                                        <td className="p-4 text-left">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleDelete(msg)} className="font-semibold py-2 px-4 rounded-lg text-xs h-10 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">حذف</button>
                                                <button onClick={() => handleViewMessage(msg)} className="font-semibold py-2 px-4 rounded-lg text-xs h-10 bg-gray-800 dark:bg-gray-600 text-white hover:bg-gray-700 dark:hover:bg-gray-500">مشاهده</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {paginatedMessages.map((msg, index) => (
                            <div key={msg.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-gray-200">{msg.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{msg.phone}</p>
                                    </div>
                                     <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg">
                                        {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="text-sm border-t border-gray-200 dark:border-gray-600 pt-3">
                                    <p><strong className="text-gray-500 dark:text-gray-400">موضوع: </strong> {msg.subject}</p>
                                    <p><strong className="text-gray-500 dark:text-gray-400">تاریخ: </strong> {msg.date}</p>
                                </div>
                                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-3">
                                    <StatusBadge status={msg.status} />
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleDelete(msg)} className="font-semibold py-2 px-4 rounded-lg text-xs h-10 border border-red-500 text-red-500">حذف</button>
                                        <button onClick={() => handleViewMessage(msg)} className="font-semibold py-2 px-4 rounded-lg text-xs h-10 bg-gray-800 dark:bg-gray-600 text-white">مشاهده</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="mt-auto pt-6">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={deleteModalState.isOpen}
                onClose={() => setDeleteModalState({ isOpen: false, message: null })}
                onConfirm={handleConfirmDelete}
                title="حذف پیام"
                message={<>آیا از حذف پیام "<strong>{deleteModalState.message?.subject}</strong>" مطمئن هستید؟</>}
            />

            {viewModalState.message && (
                <ViewMessageModal
                    isOpen={viewModalState.isOpen}
                    onClose={() => setViewModalState({ isOpen: false, message: null })}
                    message={viewModalState.message}
                />
            )}
            
            <FilterMessagesModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                currentFilters={filters}
            />
        </>
    );
};

export default ContactMessages;