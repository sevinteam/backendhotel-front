'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { LogoutIcon } from '@/components/icons';
import Toast from '@/components/Toast';
import ConfirmationModal from '@/components/ConfirmationModal';
import type { ToastType, User, ContactMessage } from '@/types';
import ApiService from '@/src/apiService';
import { AdminProvider } from '@/context/AdminContext';
import { getPathForView, getViewFromPathname } from '@/lib/routes';

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

const getStoredTabState = () => {
  const defaultState = {
    openTabs: ['پیشخوان ادمین'],
    openUserProfiles: [] as User[],
  };

  if (typeof window === 'undefined') return defaultState;

  try {
    const savedStateJSON = localStorage.getItem('adminDashboardState');
    if (!savedStateJSON) return defaultState;

    const savedState = JSON.parse(savedStateJSON);
    const openTabs =
      Array.isArray(savedState.openTabs) && savedState.openTabs.length > 0
        ? savedState.openTabs
        : defaultState.openTabs;
    const openUserProfiles: User[] = Array.isArray(savedState.openUserProfiles)
      ? savedState.openUserProfiles
      : defaultState.openUserProfiles;
    const validUserProfiles = openUserProfiles.filter((profile: User) =>
      openTabs.includes(profile.name)
    );

    return { openTabs, openUserProfiles: validUserProfiles };
  } catch {
    try {
      localStorage.removeItem('adminDashboardState');
    } catch {}
    return defaultState;
  }
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [activeTab, setActiveTab] = useState('لیست کاربران آنلاین');
  const [openTabs, setOpenTabs] = useState<string[]>(['پیشخوان ادمین']);
  const [openUserProfiles, setOpenUserProfiles] = useState<User[]>([]);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [hasNotification, setHasNotification] = useState(true);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [adminAvatar, setAdminAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(initialMessagesData);

  useEffect(() => {
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

    const init = getStoredTabState();
    setOpenTabs(init.openTabs);
    setOpenUserProfiles(init.openUserProfiles);
    setMounted(true);

    if (!auth) {
      router.replace('/login');
    }
  }, [router]);

  const activeView = useMemo(
    () => getViewFromPathname(pathname, openUserProfiles),
    [pathname, openUserProfiles]
  );

  // همگام‌سازی خودکار تب‌های باز با مسیر فعلی
  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    if (pathname === '/tasks') {
      setHasNotification(false);
    }
    setOpenTabs((prev) => (prev.includes(activeView) ? prev : [...prev, activeView]));
  }, [activeView, pathname, mounted, isAuthenticated]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
    } catch {}
  }, [contactMessages, mounted]);

  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    try {
      localStorage.setItem(
        'adminDashboardState',
        JSON.stringify({
          openTabs,
          activeView,
          openUserProfiles,
        })
      );
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

  const unreadContactMessages = useMemo(
    () => contactMessages.filter((msg) => msg.status === 'خوانده نشده').length,
    [contactMessages]
  );

  const addToast = useCallback(
    (message: string, type: 'success' | 'error', onToastClose?: () => void) => {
      const id = Date.now();
      setToasts((prevToasts) => [
        ...prevToasts,
        { id, message, type, onCloseCallback: onToastClose },
      ]);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const performLogout = useCallback(() => {
    localStorage.removeItem('isAuthenticated');
    ApiService.auth.logout();
    setIsAuthenticated(false);
    router.replace('/login');
  }, [router]);

  const handleLogout = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    setIsLogoutModalOpen(false);
    addToast('شما در حال خروج از اکانت خود هستید', 'error', performLogout);
  }, [addToast, performLogout]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const handleAdminAvatarChange = useCallback((newAvatarUrl: string) => {
    setAdminAvatar(newAvatarUrl);
  }, []);

  const handleNavigate = useCallback(
    (view: string, user?: User) => {
      if (view === 'مدیریت تسک ادمین ها') {
        setHasNotification(false);
      }

      if (user) {
        const tabName = user.name;
        setOpenTabs((prev) => (prev.includes(tabName) ? prev : [...prev, tabName]));
        setOpenUserProfiles((prev) =>
          prev.some((p) => p.id === user.id) ? prev : [...prev, user]
        );
        setSidebarOpen(false);
        router.push(`/users/${user.id}`);
        return;
      }

      setOpenTabs((prev) => (prev.includes(view) ? prev : [...prev, view]));
      setSidebarOpen(false);
      router.push(getPathForView(view, openUserProfiles));
    },
    [openUserProfiles, router]
  );

  const handleCloseTab = useCallback(
    (tabToClose: string) => {
      if (tabToClose === 'پیشخوان ادمین') return;

      const tabIndex = openTabs.indexOf(tabToClose);
      const newTabs = openTabs.filter((tab) => tab !== tabToClose);
      const newOpenUserProfiles = openUserProfiles.filter((u) => u.name !== tabToClose);

      setOpenTabs(newTabs);
      setOpenUserProfiles(newOpenUserProfiles);

      if (activeView === tabToClose) {
        const nextView = newTabs[tabIndex - 1] || newTabs[0] || 'پیشخوان ادمین';
        router.push(getPathForView(nextView, newOpenUserProfiles));
      }
    },
    [activeView, openTabs, openUserProfiles, router]
  );

  const handleTaskStatusChange = useCallback(() => {
    setHasNotification(true);
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      activeTab,
      setActiveTab,
      openUserProfiles,
      contactMessages,
      setContactMessages,
      addToast,
      handleNavigate,
      handleAdminAvatarChange,
      handleTaskStatusChange,
    }),
    [
      theme,
      activeTab,
      openUserProfiles,
      contactMessages,
      addToast,
      handleNavigate,
      handleAdminAvatarChange,
      handleTaskStatusChange,
    ]
  );

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6644F0]"></div>
      </div>
    );
  }

  return (
    <AdminProvider value={contextValue}>
      <div className="bg-[#F9F9F9] dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex min-h-screen lg:p-6 lg:gap-6">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-transparent z-30 lg:hidden backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 bottom-0 right-0 w-72 p-6 pr-0 z-40 transition-transform duration-300 lg:static lg:block lg:p-0 lg:transform-none lg:w-72 lg:flex-shrink-0 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
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
            onTabClick={(view) => handleNavigate(view)}
            onCloseTab={handleCloseTab}
            onMenuClick={() => setSidebarOpen(true)}
            onNavigate={handleNavigate}
            hasNotification={hasNotification}
            openUserProfiles={openUserProfiles}
          />

          {children}
        </div>

        <div className="fixed bottom-0 md:bottom-8 left-0 md:left-8 right-0 md:right-auto z-[1000] flex flex-col items-center md:items-start gap-4 w-full md:w-auto pointer-events-none">
          {toasts.map((toast) => (
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
    </AdminProvider>
  );
}
