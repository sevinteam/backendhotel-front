

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from './icons';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    
    // تنظیمات برای نمایش تعداد دکمه‌های صفحه
    const pagesToShow = 2; 
    const sidePages = 1;
    
    // محاسبه صفحه شروع و پایان برای نمایش
    let startPage = Math.max(2, currentPage - sidePages);
    let endPage = Math.min(totalPages - 1, currentPage + sidePages);

    // منطق برای زمانی که در صفحات ابتدایی هستیم
    if (currentPage <= pagesToShow) {
        startPage = 2;
        endPage = Math.min(pagesToShow + 1, totalPages - 1);
    }

    // منطق برای زمانی که در صفحات انتهایی هستیم
    if (currentPage > totalPages - pagesToShow) {
        startPage = Math.max(2, totalPages - pagesToShow);
        endPage = totalPages - 1;
    }

    // ایجاد آرایه از شماره صفحات برای نمایش
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
    // کلاس‌های پایه برای دکمه‌ها
    const baseButtonClasses = "px-4 py-2 flex items-center justify-center text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    // کلاس‌های دکمه‌های ناوبری (قبلی، بعدی و ...)
    const navButtonClasses = "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600";
    // کلاس‌های سه نقطه (...)
    const ellipsisClasses = "flex items-center justify-center px-4 h-10 text-sm text-gray-500 dark:text-gray-400";

    // تابع برای رندر کردن یک دکمه صفحه
    const renderPageButton = (pageNumber: number) => {
        const isActive = currentPage === pageNumber;
        let classes = `${baseButtonClasses} `;
        if (isActive) {
            classes += 'bg-[#353535] dark:bg-gray-200 text-white dark:text-gray-900 border border-[#353535] dark:border-gray-200';
        } else {
            classes += 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700';
        }

        return (
            <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={classes}
                aria-current={isActive ? 'page' : undefined}
            >
                {pageNumber}
            </button>
        );
    };

    const Ellipsis = () => (
        <span className={ellipsisClasses}>...</span>
    );

    return (
        <div className="flex items-center justify-center flex-wrap gap-2 mt-6">
            {/* دکمه رفتن به صفحه اول */}
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className={`${baseButtonClasses} ${navButtonClasses} hidden sm:flex`}
                aria-label="Go to first page"
            >
                <ChevronDoubleRightIcon className="w-5 h-5"/>
            </button>
            {/* دکمه رفتن به صفحه قبل */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${baseButtonClasses} ${navButtonClasses}`}
                aria-label="Go to previous page"
            >
                <ChevronRightIcon className="w-5 h-5" />
            </button>

            {/* رندر دکمه صفحه اول */}
            {totalPages > 0 && renderPageButton(1)}
            {/* نمایش سه نقطه اگر لازم باشد */}
            {startPage > 2 && <Ellipsis />}
            {/* رندر دکمه‌های میانی */}
            {pageNumbers.map(number => renderPageButton(number))}
            {/* نمایش سه نقطه اگر لازم باشد */}
            {endPage < totalPages - 1 && <Ellipsis />}
            {/* رندر دکمه صفحه آخر */}
            {totalPages > 1 && renderPageButton(totalPages)}

            {/* دکمه رفتن به صفحه بعد */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${baseButtonClasses} ${navButtonClasses}`}
                aria-label="Go to next page"
            >
                <ChevronLeftIcon className="w-5 h-5" />
            </button>
            {/* دکمه رفتن به صفحه آخر */}
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`${baseButtonClasses} ${navButtonClasses} hidden sm:flex`}
                aria-label="Go to last page"
            >
                <ChevronDoubleLeftIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;