'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import Header from '@/components/Header';
import { QuestionMarkCircleIcon, DocumentTextIcon, LogoutIcon } from '@/components/icons';
import AdminTaskList from '@/components/AdminTaskList';
import UserProfile from '@/components/UserProfile';
import Toast from '@/components/Toast';
import type { ToastType, User, ContactMessage } from '@/types';
import UserManagement from '@/components/UserManagement';
import ReservationManagement from '@/components/ReservationManagement';
import LoginPage from '@/components/LoginPage';
import ConfirmationModal from '@/components/ConfirmationModal';
import NotificationManagement from '@/components/NotificationManagement';
import ContactMessages from '@/components/ContactMessages';
import WebsiteSettings from '@/components/WebsiteSettings';
import UserChatManagement from '@/components/UserChatManagement';
import HotelManagement from '@/components/HotelManagement';
import ApiService from '@/src/apiService';

// داده‌های اولیه برای پیام‌های تماس با ما
const initialMessagesData: ContactMessage[] = [
  { id: 1, name: 'علیرضا آذرخش آلوچه', phone: '+98 9912356290', email: 'alireza.azarakhsh@example.com', subject: 'تماس با آقای آذرخش آلوچه', date: '۱۴۰۴/۸/۲۴', status: 'خوانده نشده', message: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است...' },
  { id: 2, name: 'علیرضا علوی', phone: '+98 9912356290', email: 'alireza.alavi@example.com', subject: 'تماس با آقای آذرخش آلوچه', date: '۱۴۰۴/۸/۲۴', status: 'خوانده نشده', message: 'متن پیام تستی برای بررسی بخش پیام‌ها.' },
  { id: 3, name: 'پرهام رحیمی', phone: '+98 9912356290', email: 'parham.rahimi@example.com', subject: 'درخواست تغییر تاریخ رزرو', date: '۱۴۰۴/۸/۲۴', status: 'خوانده نشده', message: 'سلام و احترام، آیا امکان جابجایی تاریخ اقامت وجود دارد؟' },
  { id: 4, name: 'محمد علی خاکیان', phone: '+98 9912356290', email: 'mohammad.khakian@example.com', subject: 'استعلام هتل اسپیناس', date: '۱۴۰۴/۸/۲۴', status: 'خوانده نشده', message: 'سلام، ظرفیت اتاق‌های سوئیت رویال تکمیل شده است؟' },
  { id: 5, name: 'حسن خلیلی پور', phone: '+98 9912356290', email: 'hasan.khalili@example.com', subject: 'مشکل در فاکتور نهایی', date: '۱۴۰۴/۸/۲۴', status: 'خوانده نشده', message: 'فاکتور پرداخت آنلاین برای من ایمیل نشده است.' },
  { id: 6, name: 'امیر حسین کریمیان', phone: '+98 9912356290', email: 'amir.karimian@example.com', subject: 'تایید رزرو مسافران', date: '۱۴۰۴/۸/۲۴', status: 'خوانده شده', message: 'رزرو با موفقیت دریافت و مسافران ثبت شدند.' },
  { id: 7, name: 'علیرضا کمکیان', phone: '+98 9912356290', email: 'alireza.komakian@example.com', subject: 'درخواست همکاری هتل', date: '۱۴۰۴/۸/۲۴', status: 'خوانده نشده', message: 'پیشنهاد قرارداد همکاری رزرواسیون سالانه هتل.' },
  { id: 8, name: 'امیر پاشا اسکندری', phone: '+98 9912356290', email: 'amir.eskandari@example.com', subject: 'پشتیبانی رزرو آنلاین', date: '۱۴۰۴/۸/۲۴', status: 'خوانده نشده', message: 'درخواست بازگشت وجه به علت لغو پرواز.' },
  { id: 9, name: 'سارا محمدی', phone: '+98 9120759427', email: 'sara.mohammadi@example.com', subject: 'رزرو گروهی هتل داریوش', date: '۱۴۰۴/۸/۲۵', status: 'خوانده نشده', message: 'سلام. برای رزرو گروهی ۱۵ نفره تخفیف در نظر گرفته می‌شود؟' },
];

const getInitialState = () => {
  const defaultState = {
    openTabs: ['پیشخوان ادمین'],
    activeView: 'پیشخوان ادمین',
    openUserProfiles: [] as User[],
  };

  if (typeof window === 'undefined') return defaultState;

  try {
    const savedStateJSON = localStorage.getItem('adminDashboardState');
    if (!savedStateJSON) {
      return defaultState;
    }

    const savedState = JSON.parse(savedStateJSON);

    const openTabs = (Array.isArray(savedState.openTabs) && savedState.openTabs.length > 0)
      ? savedState.openTabs
      : defaultState.openTabs;

    const openUserProfiles: User[] = Array.isArray(savedState.openUserProfiles)
      ? savedState.openUserProfiles
      : defaultState.openUserProfiles;

    const activeView = (typeof savedState.activeView === 'string' && openTabs.includes(savedState.activeView))
      ? savedState.activeView
      : openTabs[0];

    const validUserProfiles = openUserProfiles.filter((profile: User) => openTabs.includes(profile.name));

    return { openTabs, activeView, openUserProfiles: validUserProfiles };
  } catch (error) {
    console.error("خطا در خواندن یا اعتبارسنجی وضعیت از localStorage", error);
    try {
      localStorage.removeItem('adminDashboardState');
    } catch {}
    return defaultState;
  }
};

export default function AdminApp() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [activeTab, setActiveTab] = useState('لیست کاربران آنلاین');
  const [openTabs, setOpenTabs] = useState<string[]>(['پیشخوان ادمین']);
  const [activeView, setActiveView] = useState<string>('پیشخوان ادمین');
  const [openUserProfiles, setOpenUserProfiles] = useState<User[]>([]);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [hasNotification, setHasNotification] = useState(true);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [adminAvatar, setAdminAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(initialMessagesData);

  // Mount initialization
  useEffect(() => {
    setMounted(true);
    const auth = !!localStorage.getItem('isAuthenticated');
    setIsAuthenticated(auth);

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    try {
      const savedMessages = localStorage.getItem('contactMessages');
      if (savedMessages) {
        setContactMessages(JSON.parse(savedMessages));
      }
    } catch {}

    const init = getInitialState();
    setOpenTabs(init.openTabs);
    setActiveView(init.activeView);
    setOpenUserProfiles(init.openUserProfiles);
    const userForActiveView = init.openUserProfiles.find((u: User) => u.name === init.activeView);
    if (userForActiveView) {
      setViewingUser(userForActiveView);
    }
  }, []);

  // Save contact messages
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
    } catch {}
  }, [contactMessages, mounted]);

  const unreadContactMessages = useMemo(() => {
    return contactMessages.filter(msg => msg.status === 'خوانده نشده').length;
  }, [contactMessages]);

  const addToast = (message: string, type: 'success' | 'error', onToastClose?: () => void) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type, onCloseCallback: onToastClose }]);
  };

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const performLogout = () => {
    localStorage.removeItem('isAuthenticated');
    ApiService.auth.logout();
    setIsAuthenticated(false);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    addToast('شما در حال خروج از اکانت خود هستید', 'error', performLogout);
  };

  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    try {
      const stateToSave = {
        openTabs,
        activeView,
        openUserProfiles,
      };
      localStorage.setItem('adminDashboardState', JSON.stringify(stateToSave));
    } catch {}
  }, [openTabs, activeView, openUserProfiles, isAuthenticated, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleAdminAvatarChange = (newAvatarUrl: string) => {
    setAdminAvatar(newAvatarUrl);
  };

  const handleNavigate = (view: string, user?: User) => {
    if (view === 'مدیریت تسک ادمین ها') {
      setHasNotification(false);
    }

    if (user) {
      const tabName = user.name;
      if (!openTabs.includes(tabName)) {
        setOpenTabs(prev => [...prev, tabName]);
        if (!openUserProfiles.some(p => p.id === user.id)) {
          setOpenUserProfiles(prev => [...prev, user]);
        }
      }
      setActiveView(tabName);
      setViewingUser(user);
    } else {
      if (!openTabs.includes(view)) {
        setOpenTabs(prev => [...prev, view]);
      }
      setActiveView(view);
      setViewingUser(null);
    }

    setSidebarOpen(false);
  };

  const handleCloseTab = (tabToClose: string) => {
    if (tabToClose === 'پیشخوان ادمین') return;

    const tabIndex = openTabs.indexOf(tabToClose);
    const newTabs = openTabs.filter(tab => tab !== tabToClose);
    const newOpenUserProfiles = openUserProfiles.filter((u: User) => u.name !== tabToClose);

    setOpenTabs(newTabs);
    setOpenUserProfiles(newOpenUserProfiles);

    if (activeView === tabToClose) {
      const newActiveView = newTabs[tabIndex - 1] || newTabs[0];
      setActiveView(newActiveView);
      const userForNewView = newOpenUserProfiles.find((u: User) => u.name === newActiveView);
      setViewingUser(userForNewView || null);
    }
  };

  const handleTaskStatusChange = () => {
    setHasNotification(true);
  };

  const renderContent = () => {
    if (viewingUser && activeView === viewingUser.name) {
      return <UserProfile user={viewingUser} onAdminAvatarChange={handleAdminAvatarChange} onShowToast={addToast} theme={theme} />;
    }
    switch (activeView) {
      case 'پیشخوان ادمین':
        return <MainContent activeTab={activeTab} onTabChange={setActiveTab} onNavigate={handleNavigate} onShowToast={addToast} />;
      case 'مدیریت تسک ادمین ها':
        return <AdminTaskList onTaskStatusChange={handleTaskStatusChange} onShowToast={addToast} />;
      case 'مدیریت نوتیفیکیشن ها':
        return <NotificationManagement onShowToast={addToast} />;
      case 'پیام‌های تماس با ما':
        return <ContactMessages messages={contactMessages} onUpdateMessages={setContactMessages} onShowToast={addToast} />;
      case 'مدیریت رزروهای کاربران':
        return <ReservationManagement />;
      case 'مدیریت پروفایل کاربران':
        return <UserManagement onNavigate={handleNavigate} />;
      case 'تنظیمات محتوای وب سایت':
        return <WebsiteSettings onShowToast={addToast} />;
      case 'مدیریت چت های کاربران':
        return <UserChatManagement theme={theme} onShowToast={addToast} />;
      case 'مدیریت هتل و اتاق ها':
        return <HotelManagement onShowToast={addToast} theme={theme} />;
      default:
        const userToShow = openUserProfiles.find((u: User) => u.name === activeView);
        if (userToShow) {
          return <UserProfile user={userToShow} onAdminAvatarChange={handleAdminAvatarChange} onShowToast={addToast} theme={theme} />;
        }
        return (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm flex-1 flex items-center justify-center flex-col text-center border border-gray-100 dark:border-gray-700">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">صفحه {activeView}</h2>
            <p className="text-gray-400 dark:text-gray-500 mt-2 max-w-md text-sm">
              محتوای این صفحه در حال آماده سازی و یکپارچه‌سازی با سرویس‌های هتلداری است.
            </p>
          </div>
        );
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6644F0]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          onShowToast={addToast}
          theme={theme}
          setTheme={(t) => setTheme(t)}
        />
        <div className="fixed bottom-0 md:bottom-8 left-0 md:left-8 right-0 md:right-auto z-[1000] flex flex-col items-center md:items-start gap-4 w-full md:w-auto pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="w-full md:w-auto pointer-events-auto">
              <Toast toast={toast} onClose={removeToast} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="bg-[#F9F9F9] dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex min-h-screen lg:p-6 lg:gap-6">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-transparent z-30 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed top-0 bottom-0 right-0 w-72 p-6 pr-0 z-40 transition-transform duration-300 lg:static lg:block lg:p-0 lg:transform-none lg:w-72 lg:flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <Sidebar 
          activeView={activeView} 
          onNavigate={handleNavigate} 
          onClose={() => setSidebarOpen(false)}
          theme={theme}
          toggleTheme={toggleTheme}
          adminAvatar={adminAvatar}
          onLogout={handleLogout}
          unreadContactMessages={unreadContactMessages}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-6 p-4 lg:p-0">
        <Header 
          openTabs={openTabs}
          activeView={activeView}
          onTabClick={(view) => {
            setActiveView(view);
            const userForView = openUserProfiles.find((u: User) => u.name === view);
            setViewingUser(userForView || null);
          }}
          onCloseTab={handleCloseTab}
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
          hasNotification={hasNotification}
          openUserProfiles={openUserProfiles}
        />
        
        {renderContent()}
      </div>

      <div className="fixed bottom-6 left-6 z-30">
        <button 
          title="راهنما و پشتیبانی"
          className="bg-[#353535] dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#353535] dark:focus:ring-gray-500 cursor-pointer text-white"
        >
          <QuestionMarkCircleIcon className="w-7 h-7 text-white"/>
        </button>
      </div>

      <div className="fixed bottom-0 md:bottom-8 left-0 md:left-8 right-0 md:right-auto z-[1000] flex flex-col items-center md:items-start gap-4 w-full md:w-auto pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="w-full md:w-auto pointer-events-auto">
            <Toast toast={toast} onClose={removeToast} />
          </div>
        ))}
      </div>
      
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="خروج از حساب مدیریت"
        message="آیا مطمئن هستید که می‌خواهید خارج شوید؟"
        confirmText="خروج"
        cancelText="انصراف"
        icon={<LogoutIcon className="h-10 w-10 text-red-500" />}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        iconContainerClass="bg-red-100 dark:bg-red-900/50"
      />
    </div>
  );
}
