import React from 'react';

const TaskRowSkeleton: React.FC = () => (
    <div className="hidden lg:grid grid-cols-[auto_1fr_2fr_1.5fr_1.5fr] items-center py-4 border-gray-200 dark:border-gray-700 border-b last:border-b-0 gap-4 animate-pulse">
        <div className="flex justify-center pr-4">
            <div className="bg-gray-200 dark:bg-gray-700 h-10 w-10 rounded-lg"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded pr-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded pr-4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-28 mx-auto pr-4"></div>
        <div className="flex items-center justify-end gap-2 px-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-9"></div>
        </div>
    </div>
);

const TaskCardSkeleton: React.FC = () => (
    <div className="block lg:hidden p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 animate-pulse">
        <div className="flex justify-between items-start mb-3">
            <div className="w-2/3 space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-28"></div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-9"></div>
        </div>
    </div>
);

const AdminTaskListSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 animate-pulse">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full sm:w-80"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full sm:w-44"></div>
            </div>
            <div className="flex-1">
                {/* Desktop Skeleton Header */}
                <div className="hidden lg:grid grid-cols-[auto_1fr_2fr_1.5fr_1.5fr] items-center px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg gap-4 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-10 mx-auto"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 mx-auto"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mx-auto"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 mx-auto"></div>
                    <div className="h-4"></div>
                </div>
                {/* Rows Skeleton */}
                <div>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <React.Fragment key={index}>
                           <TaskRowSkeleton />
                           <TaskCardSkeleton />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminTaskListSkeleton;
