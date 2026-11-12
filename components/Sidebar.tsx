
import React, { useRef } from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  BellIcon,
  TagIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CogIcon,
  ClipboardListIcon,
  BrandLogoIcon,
  XIcon,
  SunIcon,
  MoonIcon,
  LogoutIcon,
  ChatAltIcon,
  Home2Icon,
  BankIcon,
  ClipboardTextIcon,
  Profile2UserIcon,
  Setting2Icon
} from './icons';
import type { NavItemType } from '../types';

interface SidebarProps {
    activeView: string; // نمای (صفحه) فعال فعلی
    onNavigate: (view: string) => void; // تابع برای ناوبری
    onClose?: () => void; // تابع برای بستن سایدبار در موبایل
    theme: string; // تم فعلی
    toggleTheme: () => void; // تابع برای تغییر تم
    adminAvatar: string; // آدرس تصویر پروفایل ادمین
    onLogout: () => void;
    unreadContactMessages: number;
}

// آیتم‌های اصلی منوی ناوبری
const mainNavItems: NavItemType[] = [
  { name: 'مدیریت هتل و اتاق ها', icon: HomeIcon },
  { name: 'مدیریت رزروهای کاربران', icon: UserGroupIcon },
  { name: 'مدیریت پروفایل کاربران', icon: UserGroupIcon },
  { name: 'مدیریت چت های کاربران', icon: ChatAltIcon },
  { name: 'مدیریت نوتیفیکیشن ها', icon: BellIcon },
  { name: 'مدیریت کد تخفیف ها', icon: TagIcon },
  { name: 'مدیریت بخش مالی', icon: CreditCardIcon },
  { name: 'مدیریت مقالات وبسایت', icon: DocumentTextIcon },
];

// کامپوننت برای هر آیتم منو
const NavItem: React.FC<{ item: NavItemType; isActive: boolean; onClick: () => void; }> = ({ item, isActive, onClick }) => {
    const baseClasses = "flex items-center p-2.5 text-sm rounded-lg transition-colors w-full text-right group";
    
    const activeClasses = "bg-[#353535] dark:bg-gray-600 text-white font-bold";
    const inactiveClasses = "text-gray-400 dark:text-gray-400 hover:bg-[#353535] dark:hover:bg-gray-600 hover:text-white dark:hover:text-white font-medium";

    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {item.name === 'مدیریت هتل و اتاق ها' ? (
                <BankIcon className="w-5 h-5 transition-colors" isActive={isActive} />
            ) : item.name === 'مدیریت رزروهای کاربران' ? (
                <ClipboardTextIcon className="w-5 h-5 transition-colors" isActive={isActive} />
            ) : item.name === 'مدیریت پروفایل کاربران' ? (
                <Profile2UserIcon className="w-5 h-5 transition-colors" isActive={isActive} />
            ) : item.name === 'مدیریت چت های کاربران' ? (
                <ChatAltIcon className="w-5 h-5 transition-colors" isActive={isActive} />
            ) : item.name === 'مدیریت نوتیفیکیشن ها' ? (
                <BellIcon className="w-5 h-5 transition-colors" isActive={isActive} />
            ) : item.name === 'مدیریت کد تخفیف ها' ? (
                <TagIcon className="w-5 h-5 transition-colors" isActive={isActive} />
            ) : item.name === 'مدیریت بخش مالی' ? (
                <CreditCardIcon className="w-5 h-5 transition-colors" isActive={isActive} />
            ) : item.name === 'مدیریت مقالات وبسایت' ? (
                <DocumentTextIcon className="w-5 h-5 transition-colors" isActive={isActive} />
            ) : item.name === 'تنظیمات محتوای وب سایت' || item.name === 'تنظیمات ادمین' ? (
                <Setting2Icon className="w-5 h-5 transition-colors" isActive={isActive} />
            ) : (
                <item.icon className="w-5 h-5" />
            )}
            <span className="ms-3 flex-1">{item.name}</span>
            {item.badgeCount != null && item.badgeCount > 0 && (
                 <span className="bg-orange-400 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                    {item.badgeCount > 99 ? '99+' : item.badgeCount}
                </span>
            )}
        </button>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, onClose, theme, toggleTheme, adminAvatar, onLogout, unreadContactMessages }) => {
  const navRef = useRef<HTMLElement>(null);
  
  // آیتم‌های منوی تنظیمات
  const settingsNavItems: NavItemType[] = [
    { name: 'پیام‌های تماس با ما', icon: ChatAltIcon, badgeCount: unreadContactMessages },
    { name: 'تنظیمات محتوای وب سایت', icon: Setting2Icon },
    { name: 'مدیریت تسک ادمین ها', icon: ClipboardListIcon },
    { name: 'تنظیمات ادمین', icon: Setting2Icon },
  ];

  const handleNavigateClick = (view: string) => {
    if (navRef.current) {
      navRef.current.scrollTop = 0;
    }
    onNavigate(view);
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-full flex flex-col h-full rounded-2xl shadow-sm overflow-hidden">
        {/* هدر سایدبار */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
            <div className='flex items-center gap-3'>
                <BrandLogoIcon className="w-14 h-14"/>
                <h1 className="text-md font-semibold text-gray-700 dark:text-gray-300">پنل ادمین سفرنامه 24</h1>
            </div>
             {/* دکمه بستن برای نمای موبایل */}
             <button
                onClick={onClose}
                className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white p-1 -me-2"
                aria-label="Close menu"
            >
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        {/* دکمه پیشخوان ادمین */}
        <div className="p-4 pb-2">
             <button
                onClick={() => handleNavigateClick('پیشخوان ادمین')}
                className={`w-full p-3 rounded-lg flex items-center justify-start gap-3 text-sm font-medium transition-colors group ${
                    activeView === 'پیشخوان ادمین' 
                    ? 'bg-[#353535] dark:bg-gray-700 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-[#353535] dark:hover:bg-gray-700 hover:text-white dark:hover:text-white'
                }`}
            >
                <Home2Icon className="w-5 h-5 transition-colors" isActive={activeView === 'پیشخوان ادمین'} />
                <span>پیشخوان ادمین</span>
            </button>
        </div>
        
        {/* لیست آیتم‌های منو */}
        <nav ref={navRef} className="flex-1 px-4 pb-4 space-y-2 overflow-y-auto scrollbar-right">
            <div className="space-y-1">
                {mainNavItems.map(item => <NavItem key={item.name} item={item} isActive={activeView === item.name} onClick={() => handleNavigateClick(item.name)} />)}
            </div>
            <hr className="border-gray-200 dark:border-gray-700 !my-4" />
             <div className="space-y-1">
                {settingsNavItems.map(item => <NavItem key={item.name} item={item} isActive={activeView === item.name} onClick={() => handleNavigateClick(item.name)} />)}
            </div>


            <button onClick={onLogout} className="flex items-center p-2.5 text-sm rounded-lg transition-colors relative w-full text-right text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium">
                <LogoutIcon className="w-5 h-5" />
                <span className="ms-3">خروج از حساب</span>
            </button>
        </nav>

        {/* فوتر سایدبار (اطلاعات کاربر و دکمه تم) */}
        <div className="p-4 mt-auto">
            <div className="bg-[#F2F2F2] dark:bg-gray-700 p-3 rounded-lg flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                    <img className="w-10 h-10 rounded-full object-cover flex-shrink-0" src={adminAvatar} alt="User" />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-right truncate">ابوالفضل آبیاری ( مدیر )</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-right truncate">Abolfazlabyari@gmail.com</p>
                    </div>
                </div>
                {/* دکمه تغییر تم */}
                <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white p-1 flex-shrink-0">
                    {theme === 'light' ? <MoonIcon className="w-5 h-5"/> : <SunIcon className="w-5 h-5"/>}
                </button>
            </div>
        </div>
    </div>
  );
};

export default Sidebar;
