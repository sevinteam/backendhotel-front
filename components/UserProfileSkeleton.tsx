import React from 'react';

const UserProfileSkeleton: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col gap-6 animate-pulse">
            {/* Header Card Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800"></div>
                    <div className="bg-gray-300 dark:bg-gray-700 h-14 w-40 rounded-2xl -mr-10"></div>
                </div>
                <div className="bg-gray-200 dark:bg-gray-700 h-10 w-48 rounded-xl"></div>
            </div>

            {/* Content Card Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex-1 flex flex-col">
                <div className="p-6 flex flex-col flex-1">
                    {/* Tabs Skeleton */}
                    <div className="flex items-center overflow-x-auto hide-scrollbar gap-6 whitespace-nowrap w-full border-b border-gray-200 dark:border-gray-700 pb-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>

                    {/* Form Fields Skeleton */}
                    <div className="pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6 w-full">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                </div>
                            ))}
                             <div className="md:col-span-4 space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            </div>
                        </div>
                    </div>

                     {/* Footer Skeleton */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-left">
                        <div className="bg-gray-300 dark:bg-gray-600 h-12 w-32 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileSkeleton;
