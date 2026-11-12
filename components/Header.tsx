
import React from 'react';
import {
    XIcon,
    MenuIcon,
    CalendarIcon,
    Home2Icon,
    Profile2UserIcon,
    BankIcon,
    ClipboardTextIcon,
    ChatAltIcon,
    BellIcon,
    TagIcon,
    WalletMoneyIcon,
    ColorSwatchIcon
} from './icons';
import type { User } from '../types';

// تعریف پراپرتی‌های کامپوننت هدر
interface HeaderProps {
    openTabs: string[]; // لیست تب‌های باز
    activeView: string; // نمای فعال فعلی
    onTabClick: (view: string) => void; // تابع برای کلیک روی تب
    onCloseTab: (view: string) => void; // تابع برای بستن تب
    onMenuClick: () => void; // تابع برای باز کردن منوی موبایل
    onNavigate: (view: string) => void; // تابع برای ناوبری
    hasNotification: boolean; // آیا نوتیفیکیشن جدید وجود دارد؟
    openUserProfiles: User[]; // لیست کاربرانی که تب پروفایلشان باز است
}

const Header: React.FC<HeaderProps> = ({ openTabs, activeView, onTabClick, onCloseTab, onMenuClick, onNavigate, hasNotification, openUserProfiles }) => {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const persianDate = formatter.format(today);

    return (
        <header className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm flex items-center justify-between gap-4">

            {/* نمای موبایل */}
            <div className="flex lg:hidden items-center justify-between w-full">
                {/* دکمه پیشخوان ادمین در موبایل */}
                <button
                    onClick={() => onTabClick('پیشخوان ادمین')}
                    className={`flex items-center justify-center p-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors group ${
                        activeView === 'پیشخوان ادمین'
                            ? 'bg-[#353535] dark:bg-gray-700 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-[#353535] dark:hover:bg-gray-700 hover:text-white dark:hover:text-white'
                    }`}
                >
                    <Home2Icon className="w-5 h-5 me-2 transition-colors" isActive={activeView === 'پیشخوان ادمین'} />
                    <span>پیشخوان ادمین</span>
                </button>

                <div className="flex items-center gap-2">
                    {/* دکمه تسک‌ها، فقط زمانی که در صفحه تسک‌ها نیستیم نمایش داده می‌شود */}
                    {activeView !== 'مدیریت تسک ادمین ها' && (
                        <button onClick={() => onNavigate('مدیریت تسک ادمین ها')} className="relative">
                            <div className="flex items-center gap-2 p-2.5 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <CalendarIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                                <span className='font-bold text-gray-800 dark:text-gray-200 text-xs'>۲۳ تسک</span>
                            </div>
                            {/* نشانگر نوتیفیکیشن */}
                            {hasNotification && (
                                <span className="absolute -top-1 -start-1 flex h-3 w-3">
                                    <span className="animate-blink absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                        </button>
                    )}
                    {/* دکمه باز کردن سایدبار در موبایل */}
                    <button
                        onClick={onMenuClick}
                        className="text-gray-500 dark:text-gray-400 p-2"
                        aria-label="Open menu"
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* نمای دسکتاپ */}
            <div className="hidden lg:flex flex-1 items-center justify-between gap-4 min-w-0">
                <div className="flex-1 flex items-center min-w-[200px]">
                    {/* لیست تب‌های باز شده */}
                    <div 
                        className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 flex-1 min-w-0"
                    >
                        {openTabs.map((tab) => {
                            const isUserTab = openUserProfiles.some(u => u.name === tab);
                            return (
                                <button
                                    key={tab}
                                    onClick={() => onTabClick(tab)}
                                    className={`flex items-center justify-center p-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors group shrink-0 ${
                                        activeView === tab
                                            ? 'bg-[#353535] dark:bg-gray-700 text-white shadow-sm'
                                            : 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-[#353535] dark:hover:bg-gray-700 hover:text-white dark:hover:text-white'
                                    }`}
                                >
                                    {(() => {
                                        const isActive = activeView === tab;
                                        if (tab === 'پیشخوان ادمین') {
                                            return <Home2Icon className="w-5 h-5 me-2 transition-colors" isActive={isActive} />;
                                        }
                                        if (isUserTab || tab === 'مدیریت پروفایل کاربران') {
                                            return <Profile2UserIcon className="w-5 h-5 me-2 transition-colors" isActive={isActive} />;
                                        }
                                        if (tab === 'مدیریت هتل و اتاق ها') {
                                            return <BankIcon className="w-5 h-5 me-2 transition-colors" isActive={isActive} />;
                                        }
                                        if (tab === 'مدیریت رزروهای کاربران') {
                                            return <ClipboardTextIcon className="w-5 h-5 me-2 transition-colors" isActive={isActive} />;
                                        }
                                        if (tab === 'مدیریت چت های کاربران') {
                                            return <ChatAltIcon className="w-5 h-5 me-2 transition-colors" isActive={isActive} />;
                                        }
                                        if (tab === 'مدیریت نوتیفیکیشن ها') {
                                            return <BellIcon className="w-5 h-5 me-2 transition-colors" isActive={isActive} />;
                                        }
                                        if (tab === 'مدیریت کد تخفیف ها') {
                                            return <TagIcon className="w-5 h-5 transition-colors" isActive={isActive} />;
                                        }
                                        if (tab === 'مدیریت بخش مالی') {
                                            return <WalletMoneyIcon className="w-5 h-5 me-2 transition-colors" isActive={isActive} />;
                                        }
                                        if (tab === 'مدیریت مقالات وبسایت') {
                                            return <ColorSwatchIcon className="w-5 h-5 me-2 transition-colors" isActive={isActive} />;
                                        }
                                        return <Profile2UserIcon className="w-5 h-5 me-2 transition-colors" isActive={isActive} />;
                                    })()}
                                    <span>{tab}</span>
                                    {tab !== 'پیشخوان ادمین' && (
                                        <span
                                            className="ms-2 -my-1 -me-1 p-1 rounded-full hover:bg-transparent backdrop-blur-xs dark:hover:bg-white/20"
                                            onClick={(e) => {
                                                e.stopPropagation(); // جلوگیری از فعال شدن تب هنگام بستن
                                                onCloseTab(tab);
                                            }}
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                    {/* نمایش تاریخ امروز */}
                    <div className="hidden sm:flex items-center gap-2 p-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <span className='font-bold text-gray-800 dark:text-gray-200 text-sm whitespace-nowrap'>تاریخ امروز : {persianDate}</span>
                    </div>
                     {/* دکمه تسک‌ها، فقط زمانی که در صفحه تسک‌ها نیستیم نمایش داده می‌شود */}
                    {activeView !== 'مدیریت تسک ادمین ها' && (
                        <button onClick={() => onNavigate('مدیریت تسک ادمین ها')} className="relative">
                            <div className="flex items-center gap-4 py-3 px-5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <CalendarIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                                <span className='font-bold text-gray-800 dark:text-gray-200 text-xs'>۲۳ تسک</span>
                            </div>
                             {/* نشانگر نوتیفیکیشن */}
                            {hasNotification && (
                                <span className="absolute -top-1.5 -start-1.5 flex h-3.5 w-3.5">
                                    <span className="animate-blink absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;