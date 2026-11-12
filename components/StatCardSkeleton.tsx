import React from 'react';

const StatCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex flex-col justify-between h-28 animate-pulse">
            <div className="flex justify-between items-start">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
            <div className="flex justify-between items-center">
                <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg h-11 w-11"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
        </div>
    );
};

const StatCardsSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
    </div>
);


export default StatCardsSkeleton;
