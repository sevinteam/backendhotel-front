
import React, { useState } from 'react';
import type { Traveler } from '../types';
import Pagination from './Pagination';

interface TravelerListProps {
    travelers: Traveler[];
    onEdit: (traveler: Traveler) => void;
    onDelete: (traveler: Traveler) => void;
}

const TravelerList: React.FC<TravelerListProps> = ({ travelers, onEdit, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const totalPages = Math.ceil(travelers.length / itemsPerPage);
    const paginatedTravelers = travelers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto">
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <table className="w-full text-sm">
                        <thead className="text-gray-500 dark:text-gray-400">
                            <tr className="bg-gray-50 dark:bg-gray-700/50">
                                <th className="p-4 font-semibold text-center rounded-r-lg">نام</th>
                                <th className="p-4 font-semibold text-center">نام خانوادگی</th>
                                <th className="p-4 font-semibold text-center">شماره همراه</th>
                                <th className="p-4 font-semibold text-center">شماره ملی/ شماره پاسپورت</th>
                                <th className="p-4 font-semibold text-center rounded-l-lg"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {paginatedTravelers.map((traveler) => (
                                <tr key={traveler.id} className="text-gray-800 dark:text-gray-200">
                                    <td className="p-4 font-semibold text-center">{traveler.name}</td>
                                    <td className="p-4 text-center">{traveler.familyName}</td>
                                    <td className="p-4 text-center">{traveler.phone}</td>
                                    <td className="p-4 text-center">{traveler.nationalId}</td>
                                    <td className="p-4 text-left">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => onDelete(traveler)} className="bg-white dark:bg-transparent border border-red-500 text-red-500 font-semibold py-2 px-6 rounded-lg text-xs whitespace-nowrap hover:bg-red-50 dark:hover:bg-red-500/10">
                                                حذف
                                            </button>
                                            <button onClick={() => onEdit(traveler)} className="bg-[#353535] dark:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg text-xs whitespace-nowrap hover:bg-opacity-90">
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
                    {paginatedTravelers.map((traveler) => (
                        <div key={traveler.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                                <p className="font-bold text-gray-800 dark:text-gray-200">{traveler.name} {traveler.familyName}</p>
                            </div>
                            <div className="space-y-2 text-xs border-t border-gray-200 dark:border-gray-600 pt-3">
                                <div><strong className="text-gray-500 dark:text-gray-400">شماره همراه: </strong> <span className="text-gray-700 dark:text-gray-300">{traveler.phone}</span></div>
                                <div><strong className="text-gray-500 dark:text-gray-400">شماره ملی/پاسپورت: </strong> <span className="text-gray-700 dark:text-gray-300">{traveler.nationalId}</span></div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4">
                                <button onClick={() => onDelete(traveler)} className="bg-white dark:bg-transparent border border-red-500 text-red-500 font-semibold py-2 px-6 rounded-lg text-xs">
                                    حذف
                                </button>
                                <button onClick={() => onEdit(traveler)} className="bg-[#353535] dark:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg text-xs">
                                    ویرایش
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {totalPages > 1 && (
                <div className="mt-auto pt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default TravelerList;