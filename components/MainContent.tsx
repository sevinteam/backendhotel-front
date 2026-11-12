

import React, { useState, useMemo, useEffect } from 'react';
import StatCard from './StatCard';
import UserList from './UserList';
import type { User, Reservation, LegalProfileRequest } from '../types';
import { Profile2UserIcon, ClipboardTextIcon, ChatAltIcon, WalletMoneyIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';
import StatCardsSkeleton from './StatCardSkeleton';
import UserListSkeleton from './UserListSkeleton';


// داده‌های نمونه برای کاربران
const usersData: User[] = [
  { id: 1, name: 'علیرضا آذرخش آلوچه', phone: '09120759419', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', email: 'sanatarabadi@yahoo.com' },
  { id: 2, name: 'علیرضا علوی', phone: '09120759420', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { id: 3, name: 'پرهام رحیمی', phone: '09120759421', avatar: 'https://randomuser.me/api/portraits/men/62.jpg' },
  { id: 4, name: 'محمد علی خاکیان', phone: '09120759422', avatar: 'https://randomuser.me/api/portraits/men/63.jpg' },
  { id: 5, name: 'حسن خلیلی پور', phone: '09120759423', avatar: 'https://randomuser.me/api/portraits/men/81.jpg' },
  { id: 6, name: 'امیر حسین کریمیان', phone: '09120759424', avatar: 'https://randomuser.me/api/portraits/men/83.jpg' },
  { id: 7, name: 'علیرضا کمکیان', phone: '09120759425', avatar: 'https://randomuser.me/api/portraits/men/85.jpg' },
  { id: 8, name: 'امیر پاشا اسکندری', phone: '09120759426', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 9, name: 'سارا محمدی', phone: '09120759427', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 10, name: 'نیما رضایی', phone: '09120759428', avatar: 'https://randomuser.me/api/portraits/men/36.jpg' },
];

// داده‌های نمونه برای نام هتل‌ها
const hotelNames = ['هتل اسپیناس پالاس', 'هتل داریوش کیش', 'هتل عباسی اصفهان', 'هتل پارسیان آزادی', 'هتل لاله تهران', 'هتل هما شیراز', 'هتل قصر طلایی مشهد', 'هتل بزرگ شیراز'];

// داده‌های نمونه برای رزروها
const initialReservationsData: Reservation[] = [
    { id: 1, user: usersData[0], dateRange: '1404-08-01-1404-07-28', hotelName: hotelNames[0], trackingCode: '۲۵۶۳۶۲۲۶۱', status: 'در انتظار' },
    { id: 2, user: usersData[1], dateRange: '1404-08-02-1404-07-29', hotelName: hotelNames[1], trackingCode: '۲۵۶۳۶۲۲۶۱', status: 'عدم تایید' },
    { id: 3, user: usersData[2], dateRange: '1404-08-05-1404-08-01', hotelName: hotelNames[2], trackingCode: '۲۵۶۳۶۲۲۶۱', status: 'پرداخت شده' },
    { id: 4, user: usersData[3], dateRange: '1404-08-07-1404-08-03', hotelName: hotelNames[3], trackingCode: '۲۵۶۳۶۲۲۶۱', status: 'لغو شده' },
    { id: 5, user: usersData[4], dateRange: '1404-08-10-1404-08-05', hotelName: hotelNames[4], trackingCode: '۲۵۶۳۶۲۲۶۱', status: 'در انتظار' },
    { id: 6, user: usersData[5], dateRange: '1404-08-08-1404-08-06', hotelName: hotelNames[5], trackingCode: '۲۵۶۳۶۲۲۶۱', status: 'تایید شده' },
    { id: 7, user: usersData[6], dateRange: '1404-08-15-1404-08-10', hotelName: hotelNames[6], trackingCode: '۲۵۶۳۶۲۲۶۱', status: 'لغو شده' },
    { id: 8, user: usersData[7], dateRange: '1404-08-14-1404-08-12', hotelName: hotelNames[7], trackingCode: '۲۵۶۳۶۲۲۶۱', status: 'پرداخت شده' },
    { id: 9, user: usersData[8], dateRange: '1404-09-01-1404-08-28', hotelName: hotelNames[0], trackingCode: '۲۵۶۳۶۲۲۶۲', status: 'در انتظار' },
    { id: 10, user: usersData[9], dateRange: '1404-09-02-1404-08-29', hotelName: hotelNames[1], trackingCode: '۲۵۶۳۶۲۲۶۳', status: 'عدم تایید' },
    { id: 11, user: usersData[0], dateRange: '1404-09-05-1404-09-01', hotelName: hotelNames[2], trackingCode: '۲۵۶۳۶۲۲۶۴', status: 'پرداخت شده' },
    { id: 12, user: usersData[1], dateRange: '1404-09-07-1404-09-03', hotelName: hotelNames[3], trackingCode: '۲۵۶۳۶۲۲۶۵', status: 'لغو شده' },
    { id: 13, user: usersData[2], dateRange: '1404-09-10-1404-09-05', hotelName: hotelNames[4], trackingCode: '۲۵۶۳۶۲۲۶۶', status: 'در انتظار' },
    { id: 14, user: usersData[3], dateRange: '1404-09-08-1404-09-06', hotelName: hotelNames[5], trackingCode: '۲۵۶۳۶۲۲۶۷', status: 'تایید شده' },
    { id: 15, user: usersData[4], dateRange: '1404-09-15-1404-09-10', hotelName: hotelNames[6], trackingCode: '۲۵۶۳۶۲۲۶۸', status: 'لغو شده' },
    { id: 16, user: usersData[5], dateRange: '1404-09-14-1404-09-12', hotelName: hotelNames[7], trackingCode: '۲۵۶۳۶۲۲۶۹', status: 'پرداخت شده' },
];

// داده‌های نمونه برای درخواست‌های پروفایل حقوقی
const legalRequestsData: LegalProfileRequest[] = [
    { id: 1, user: usersData[0], status: 'بررسی شده' },
    { id: 2, user: usersData[1], status: 'تایید شده' },
    { id: 3, user: usersData[2], status: 'تایید شده' },
    { id: 4, user: usersData[3], status: 'عدم تایید' },
    { id: 5, user: usersData[4], status: 'عدم تایید' },
    { id: 6, user: usersData[5], status: 'تایید شده' },
    { id: 7, user: usersData[6], status: 'تایید شده' },
    { id: 8, user: usersData[7], status: 'تایید شده' },
    { id: 9, user: usersData[8], status: 'بررسی شده' },
    { id: 10, user: usersData[9], status: 'تایید شده' },
    { id: 11, user: usersData[0], status: 'تایید شده' },
    { id: 12, user: usersData[1], status: 'عدم تایید' },
    { id: 13, user: usersData[2], status: 'عدم تایید' },
    { id: 14, user: usersData[3], status: 'تایید شده' },
    { id: 15, user: usersData[4], status: 'تایید شده' },
    { id: 16, user: usersData[5], status: 'تایید شده' },
];

// تعریف پراپرتی‌های کامپوننت محتوای اصلی
interface MainContentProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onNavigate: (view: string, user?: User) => void;
    onShowToast: (message: string, type: 'success' | 'error') => void;
}

const MainContent: React.FC<MainContentProps> = ({ activeTab, onTabChange, onNavigate, onShowToast }) => {
    // state برای صفحه فعلی در صفحه‌بندی
    const [currentPage, setCurrentPage] = useState(1);
    // state برای متن جستجو
    const [searchQuery, setSearchQuery] = useState('');
    // state برای لیست رزروها (برای امکان حذف)
    const [reservations, setReservations] = useState<Reservation[]>(initialReservationsData);
    // state برای کنترل مودال تایید حذف
    const [modalState, setModalState] = useState<{ isOpen: boolean; reservation: Reservation | null }>({ isOpen: false, reservation: null });
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 8;

    // Simulate loading
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [activeTab]); // Also reload when tab changes

    // تابع برای حذف یک رزرو از لیست
    const handleDeleteReservation = (idToDelete: number) => {
        setReservations(prev => prev.filter(res => res.id !== idToDelete));
    };

    // تابع برای باز کردن مودال تایید حذف
    const handleOpenDeleteModal = (reservation: Reservation) => {
        setModalState({ isOpen: true, reservation });
    };

    // تابع برای بستن مودال تایید حذف
    const handleCloseDeleteModal = () => {
        setModalState({ isOpen: false, reservation: null });
    };

    // تابع برای تایید نهایی حذف
    const handleConfirmDelete = () => {
        if (modalState.reservation) {
            handleDeleteReservation(modalState.reservation.id);
            onShowToast('رزرو مورد نظر با موفقیت حذف شد', 'success');
        }
        handleCloseDeleteModal();
    };

    // استفاده از useMemo برای بهینه‌سازی فیلتر کردن داده‌ها
    // این محاسبات فقط زمانی که وابستگی‌ها (activeTab, searchQuery, reservations) تغییر کنند، دوباره انجام می‌شود
    const filteredData = useMemo(() => {
        let sourceData: User[] | Reservation[] | LegalProfileRequest[];
        // انتخاب منبع داده بر اساس تب فعال
        switch (activeTab) {
            case 'لیست رزروهای جدید':
                sourceData = reservations;
                break;
            case 'لیست درخواست پروفایل حقوقی':
                sourceData = legalRequestsData;
                break;
            default:
                sourceData = usersData;
        }

        // اگر جستجو خالی است، تمام داده‌ها را برگردان
        if (!searchQuery.trim()) {
            return sourceData;
        }

        const lowercasedQuery = searchQuery.toLowerCase().trim();
        
        // فیلتر بر اساس نام یا شماره تلفن کاربر
        if (activeTab.includes('کاربران')) {
             return (sourceData as User[]).filter(user => 
                user.name.toLowerCase().includes(lowercasedQuery) ||
                user.phone.includes(lowercasedQuery)
            );
        } else {
            return (sourceData as (Reservation[] | LegalProfileRequest[])).filter(item => 
                item.user.name.toLowerCase().includes(lowercasedQuery) ||
                item.user.phone.includes(lowercasedQuery)
            );
        }
    }, [activeTab, searchQuery, reservations]);
    
    // محاسبه تعداد کل صفحات
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // تابع برای تغییر صفحه
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // تابع برای تغییر تب
    const handleTabChange = (tab: string) => {
        onTabChange(tab);
        setCurrentPage(1); // بازگشت به صفحه اول
        setSearchQuery(''); // پاک کردن جستجو
    }
    
    // برش دادن داده‌های فیلتر شده برای نمایش در صفحه فعلی
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <div className="flex flex-col space-y-6">
                {/* کارت‌های آمار */}
                {isLoading ? (
                    <StatCardsSkeleton />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        <StatCard icon={Profile2UserIcon} title="تعداد کاربران وبسایت تا به امروز" value="۱۳۶۲ نفر" />
                        <StatCard icon={ClipboardTextIcon} title="تعداد رزروهای جدید" value="۳۶۲۱ رزرو" />
                        <StatCard icon={ChatAltIcon} title="چت های امروز" value="۴۹ چت" />
                        <StatCard icon={WalletMoneyIcon} title="فروش کلی ماهانه" value="۳۲۰,۰۰۰,۰۰۰ تومان" change="25%" changeType="increase" />
                    </div>
                )}

                {/* لیست کاربران/رزروها */}
                {isLoading ? (
                    <UserListSkeleton />
                ) : (
                    <UserList 
                        users={activeTab.includes('کاربران') ? paginatedData as User[] : []}
                        reservations={activeTab === 'لیست رزروهای جدید' ? paginatedData as Reservation[] : []}
                        legalRequests={activeTab === 'لیست درخواست پروفایل حقوقی' ? paginatedData as LegalProfileRequest[] : []}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onOpenDeleteModal={handleOpenDeleteModal}
                        onNavigate={onNavigate}
                    />
                )}
            </div>
            {/* مودال تایید حذف */}
            <ConfirmationModal
                isOpen={modalState.isOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="آیا از حذف این اطلاعات مطمئن هستید؟"
                message={
                    <>
                    آیا از حذف این رزرو به شماره پیگیری{' '}
                    <strong className="font-bold text-gray-700 dark:text-gray-300">{modalState.reservation?.trackingCode}</strong>{' '}
                    مطمئن هستید؟
                    </>
                }
            />
        </>
    );
};

export default MainContent;