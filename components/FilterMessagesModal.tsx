
import React, { useState, useEffect, useRef } from 'react';
import { XIcon, CalendarIcon } from './icons';
import CustomPersianDatePicker from './CustomPersianDatePicker';
import type { ContactMessageStatus } from '../types';

interface FilterMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { dateRange: { start: string; end: string } | null; status: ContactMessageStatus | null }) => void;
  onClear: () => void;
  currentFilters: {
    dateRange: { start: string; end: string } | null;
    status: ContactMessageStatus | null;
  };
}

const FilterMessagesModal: React.FC<FilterMessagesModalProps> = ({ isOpen, onClose, onApply, onClear, currentFilters }) => {
    const [dateRange, setDateRange] = useState(currentFilters.dateRange);
    const [status, setStatus] = useState<ContactMessageStatus | null>(currentFilters.status);
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setDateRange(currentFilters.dateRange);
            setStatus(currentFilters.status);
        }
    }, [isOpen, currentFilters]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isDatePickerOpen && datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setDatePickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDatePickerOpen]);

    const handleApplyClick = () => {
        onApply({ dateRange, status });
    };

    const handleClearClick = () => {
        setDateRange(null);
        setStatus(null);
        onClear();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[70] transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 my-8 mx-4 max-w-md w-full transform transition-all duration-300"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">فیلترها</h3>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="py-6 space-y-6 text-right">
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">فیلتر بر اساس تاریخ</label>
                        <div className="relative">
                            <button onClick={() => setDatePickerOpen(prev => !prev)}
                                className="w-full text-right p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer flex items-center justify-between">
                                <span className="flex items-center gap-3">
                                    <CalendarIcon className="w-5 h-5 text-gray-400"/>
                                    <span>{dateRange ? `${dateRange.start} - ${dateRange.end}` : 'انتخاب بازه زمانی'}</span>
                                </span>
                                {dateRange && <button onClick={(e) => { e.stopPropagation(); setDateRange(null); }} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><XIcon className="w-4 h-4 text-gray-500" /></button>}
                            </button>
                        </div>
                        {isDatePickerOpen && (
                            <div ref={datePickerRef} className="absolute top-full right-0 mt-2 z-20 w-full md:w-auto">
                                <CustomPersianDatePicker
                                    startDate={dateRange?.start || ''}
                                    endDate={dateRange?.end || ''}
                                    onRangeSelect={(range) => {
                                        setDateRange(range);
                                        setDatePickerOpen(false);
                                    }}
                                    allowPastDates={true}
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">وضعیت</label>
                        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                            <button
                                onClick={() => setStatus('خوانده نشده')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${status === 'خوانده نشده' ? 'bg-violet-600 text-white shadow' : 'text-gray-500 dark:text-gray-300'}`}
                            >
                                خوانده نشده
                            </button>
                            <button
                                onClick={() => setStatus('خوانده شده')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${status === 'خوانده شده' ? 'bg-violet-600 text-white shadow' : 'text-gray-500 dark:text-gray-300'}`}
                            >
                                خوانده شده
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 space-y-3">
                    <button onClick={handleApplyClick} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-lg transition-colors">
                        اعمال فیلتر
                    </button>
                    <button onClick={handleClearClick} className="w-full text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        حذف فیلتر
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterMessagesModal;
