import React, { useState, useMemo, useEffect } from 'react';
import type { ManagedUser, User } from '../types';
import { PlusIcon, SearchIcon } from './icons';
import Pagination from './Pagination';

// داده‌های نمونه برای کاربران
const managedUsersData: ManagedUser[] = [
  { id: 1, name: 'علیرضا آذرخش آلوچه', phone: '+98 9912356290', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', email: 'hadi.kazemi1376@gmail.com', userLevel: 'نقره ای', adminLevel: 'دارد', walletBalance: '۲,۵۰۸,۸۰۰' },
  { id: 2, name: 'علیرضا علوی', phone: '+98 9912356290', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', email: 'hadi.kazemi1376@gmail.com', userLevel: 'برنزی', adminLevel: 'دارد', walletBalance: '۲,۵۰۸,۸۰۰' },
  { id: 3, name: 'پرهام رحیمی', phone: '+98 9912356290', avatar: 'https://randomuser.me/api/portraits/men/62.jpg', email: 'hadi.kazemi1376@gmail.com', userLevel: 'برنزی', adminLevel: 'ندارد', walletBalance: '۲,۵۰۸,۸۰۰' },
  { id: 4, name: 'محمد علی خاکیان', phone: '+98 9912356290', avatar: 'https://randomuser.me/api/portraits/men/63.jpg', email: 'hadi.kazemi1376@gmail.com', userLevel: 'طلایی', adminLevel: 'دارد', walletBalance: '۲,۵۰۸,۸۰۰' },
  { id: 5, name: 'حسن خلیلی پور', phone: '+98 9912356290', avatar: 'https://randomuser.me/api/portraits/men/81.jpg', email: 'hadi.kazemi1376@gmail.com', userLevel: 'طلایی', adminLevel: 'دارد', walletBalance: '۲,۵۰۸,۸۰۰' },
  { id: 6, name: 'امیر حسین کریمیان', phone: '+98 9912356290', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', email: 'hadi.kazemi1376@gmail.com', userLevel: 'برنزی', adminLevel: 'ندارد', walletBalance: '۲,۵۰۸,۸۰۰' },
  { id: 7, name: 'علیرضا کمکیان', phone: '+98 9912356290', avatar: 'https://randomuser.me/api/portraits/men/85.jpg', email: 'hadi.kazemi1376@gmail.com', userLevel: 'نقره ای', adminLevel: 'ندارد', walletBalance: '۲,۵۰۸,۸۰۰' },
  { id: 8, name: 'امیر پاشا اسکندری', phone: '+98 9912356290', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', email: 'hadi.kazemi1376@gmail.com', userLevel: 'نقره ای', adminLevel: 'ندارد', walletBalance: '۲,۵۰۸,۸۰۰' },
  { id: 9, name: 'سارا محمدی', phone: '+98 9120759427', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', email: 'sara.m@example.com', userLevel: 'طلایی', adminLevel: 'ندارد', walletBalance: '۱,۲۰۰,۰۰۰' },
  { id: 10, name: 'نیما رضایی', phone: '+98 9120759428', avatar: 'https://randomuser.me/api/portraits/men/36.jpg', email: 'nima.r@example.com', userLevel: 'برنزی', adminLevel: 'دارد', walletBalance: '۵,۳۰۰,۰۰۰' },
  { id: 11, name: 'مریم حسینی', phone: '+98 9120759429', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', email: 'maryam.h@example.com', userLevel: 'نقره ای', adminLevel: 'ندارد', walletBalance: '۷۵۰,۰۰۰' },
  { id: 12, name: 'رضا احمدی', phone: '+98 9120759430', avatar: 'https://randomuser.me/api/portraits/men/50.jpg', email: 'reza.a@example.com', userLevel: 'برنزی', adminLevel: 'ندارد', walletBalance: '۰' },
];

interface UserManagementProps {
    onNavigate: (view: string, user: User) => void;
}

// کامپوننت کارت کاربر برای نمایش در موبایل
const UserCard: React.FC<{ user: ManagedUser; rowNumber: number; onNavigate: () => void }> = ({ user, rowNumber, onNavigate }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 min-w-0">
                    <img src={user.avatar || 'https://i.pravatar.cc/150?u=a042581f4e29026704d'} alt={user.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="min-w-0">
                        <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</p>
                    </div>
                </div>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg">{String(rowNumber).padStart(2, '0')}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="truncate col-span-2"><strong className="text-gray-500 dark:text-gray-400">ایمیل: </strong> <span className="text-gray-700 dark:text-gray-300">{user.email}</span></div>
                <div><strong className="text-gray-500 dark:text-gray-400">سطح کاربری: </strong> <span className="text-gray-700 dark:text-gray-300">{user.userLevel}</span></div>
                <div><strong className="text-gray-500 dark:text-gray-400">سطح ادمین: </strong> <span className="text-gray-700 dark:text-gray-300">{user.adminLevel}</span></div>
                <div className="col-span-2"><strong className="text-gray-500 dark:text-gray-400">موجودی کیف پول: </strong> <span className="font-semibold text-gray-800 dark:text-gray-200">{user.walletBalance} تومان</span></div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-200 dark:border-gray-600">
                <button 
                    onClick={onNavigate}
                    className="font-semibold py-2 px-4 rounded-lg text-xs whitespace-nowrap h-10 transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-[#353535] dark:hover:bg-gray-600 hover:text-white"
                >
                    مشاهده پروفایل کاربر
                </button>
            </div>
        </div>
    );
};

const UserManagement: React.FC<UserManagementProps> = ({ onNavigate }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 8;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return managedUsersData;
        const lowercasedQuery = searchQuery.toLowerCase().trim();
        return managedUsersData.filter(user =>
            user.name.toLowerCase().includes(lowercasedQuery) ||
            user.email.toLowerCase().includes(lowercasedQuery) ||
            user.phone.includes(lowercasedQuery)
        );
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleNavigateToProfile = (user: ManagedUser) => {
        const userToNavigate: User = {
            id: user.id,
            name: user.name,
            phone: user.phone,
            avatar: user.avatar,
            email: user.email,
        };
        onNavigate(user.name, userToNavigate);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex-1 flex flex-col">
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="جستجو..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 pr-10 pl-4 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                 <button className="flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-violet-700 transition-colors w-full sm:w-auto">
                    <PlusIcon className="w-5 h-5" />
                    <span>افزودن کاربر جدید</span>
                </button>
            </div>

            <div className="flex-1 overflow-auto">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <table className="w-full text-sm text-right">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                                <th className="p-4 font-semibold text-center rounded-r-lg">ردیف</th>
                                <th className="p-4 font-semibold text-right">نام کاربر</th>
                                <th className="p-4 font-semibold text-right">پست الکترونیکی</th>
                                <th className="p-4 font-semibold text-center">سطح کاربری</th>
                                <th className="p-4 font-semibold text-center">سطح ادمین</th>
                                <th className="p-4 font-semibold text-center">موجودی کیف پول</th>
                                <th className="p-4 font-semibold text-left rounded-l-lg"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {paginatedUsers.map((user, index) => (
                                <tr key={user.id}>
                                    <td className="p-4 text-center">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mx-auto">
                                            {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar || 'https://i.pravatar.cc/150?u=a042581f4e29026704d'} alt={user.name} className="w-10 h-10 rounded-lg object-cover" />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300 truncate">{user.email}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-300">{user.userLevel}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-300">{user.adminLevel}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{user.walletBalance}</span>
                                            <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-0.5 rounded-md">تومان</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-left">
                                        <button 
                                            onClick={() => handleNavigateToProfile(user)}
                                            className="font-semibold py-2 px-4 rounded-lg text-xs whitespace-nowrap h-10 transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-[#353535] dark:hover:bg-gray-600 hover:text-white"
                                        >
                                            مشاهده پروفایل کاربر
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {paginatedUsers.map((user, index) => (
                        <UserCard 
                            key={user.id} 
                            user={user} 
                            rowNumber={(currentPage - 1) * itemsPerPage + index + 1}
                            onNavigate={() => handleNavigateToProfile(user)}
                        />
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

export default UserManagement;