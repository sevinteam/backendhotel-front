import React from 'react';

const UserRowSkeleton: React.FC = () => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 gap-4 animate-pulse">
        <div className="flex items-center gap-4 flex-grow">
            <div className="bg-gray-200 dark:bg-gray-700 h-10 w-10 rounded-lg flex-shrink-0"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-10 w-10 rounded-lg flex-shrink-0"></div>
            <div className="flex-grow space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 flex-shrink-0"></div>
    </div>
);

const UserListSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex-1 flex flex-col">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                </div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full sm:w-56 animate-pulse"></div>
            </div>

            {/* List Skeleton */}
            <div className="pt-6 flex-1">
                {Array.from({ length: 8 }).map((_, index) => (
                    <UserRowSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};

export default UserListSkeleton;
