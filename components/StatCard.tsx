import React from 'react';
import type { StatCardProps } from '../types';
import { TrendingUpIcon } from './icons';

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, change, changeType }) => {
    // جدا کردن مقدار اصلی از واحد (مثلا "۱۳۶۲" از "نفر")
    const valueParts = value.split(' ');
    const mainValue = valueParts[0];
    const unit = valueParts.length > 1 ? valueParts.slice(1).join(' ') : '';

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex flex-col justify-between h-28">
            <div className="flex justify-between items-start">
                <p className="text-gray-800 dark:text-gray-200 font-semibold text-sm">{title}</p>
                {/* نمایش نشانگر تغییر (افزایش/کاهش) اگر وجود داشته باشد */}
                {change && (
                     <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
                         changeType === 'increase' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                     }`}>
                        <TrendingUpIcon className="w-4 h-4" />
                        {change}
                    </span>
                )}
            </div>

            <div className="flex justify-between items-center">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                   <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>

                <div className="flex items-baseline gap-1.5">
                     <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{mainValue}</p>
                     {/* نمایش واحد اگر وجود داشته باشد */}
                     {unit && <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{unit}</p>}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
