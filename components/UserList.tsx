
import React from 'react';
import type { User, Reservation, ReservationStatus, LegalProfileRequest, LegalRequestStatus } from '../types';
import { SearchIcon, TrashIcon } from './icons';
import Pagination from './Pagination';

// تعریف پراپرتی‌های کامپوننت لیست
interface UserListProps {
    users: User[];
    reservations: Reservation[];
    legalRequests: LegalProfileRequest[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onOpenDeleteModal?: (reservation: Reservation) => void;
    onNavigate: (view: string, user?: User) => void;
}

// تابع کمکی برای فرمت صحیح شماره با پیش‌شماره ۹۸+ بدون چرخش کاراکترها در محیط راست‌چین
const formatPhoneWithPrefix = (phone: string) => {
    if (!phone) return '';
    const cleanPhone = phone.trim().replace(/^(\+98|0098|98|0)/, '');
    return `+98 ${cleanPhone}`;
};

// کامپوننت برای نمایش یک ردیف از لیست کاربران
const UserRow: React.FC<{ user: User; onNavigate: (view: string, user: User) => void; }> = ({ user, onNavigate }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 gap-4">
            <div className="flex items-center gap-4">
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg">{String(user.id).padStart(2, '0')}</span>
                <div className="flex items-center gap-3 text-right">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="text-right">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span dir="ltr" className="inline-block">{formatPhoneWithPrefix(user.phone)}</span>
                        </p>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => onNavigate('User Profile', user)}
                className="font-semibold py-2 px-4 rounded-lg text-xs whitespace-nowrap h-10 transition-colors bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-[#353535] dark:hover:bg-gray-600 hover:text-white">
                مشاهده پروفایل کاربر
            </button>
        </div>
    );
};

// کامپوننت برای نمایش نشان وضعیت (Status Badge)
const StatusBadge: React.FC<{ status: ReservationStatus | LegalRequestStatus }> = ({ status }) => {
    const styles: Record<ReservationStatus | LegalRequestStatus, string> = {
        'در انتظار': 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
        'عدم تایید': 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
        'پرداخت شده': 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
        'لغو شده': 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
        'تایید شده': 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
        'بررسی شده': 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400'
    };
    return (
        <span className={`inline-flex justify-center items-center w-24 px-3 py-1 text-xs font-semibold rounded-md ${styles[status] || ''}`}>
            {status}
        </span>
    );
};

// کامپوننت برای نمایش یک ردیف از لیست رزروها
const ReservationRow: React.FC<{ reservation: Reservation; onDelete: () => void; onNavigate?: (view: string, user: User) => void; }> = ({ reservation, onDelete, onNavigate }) => {
    return (
        <>
            {/* نمای کارت برای موبایل */}
            <div className="block lg:hidden p-4 border border-gray-200 dark:border-gray-700 rounded-lg my-4">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{reservation.user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span dir="ltr" className="inline-block">{formatPhoneWithPrefix(reservation.user.phone)}</span>
                        </p>
                    </div>
                    <StatusBadge status={reservation.status}/>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
                    <p><strong className="font-semibold text-gray-700 dark:text-gray-300">هتل: </strong> {reservation.hotelName}</p>
                    <p><strong className="font-semibold text-gray-700 dark:text-gray-300">تاریخ: </strong> <span>{reservation.dateRange}</span></p>
                    <p><strong className="font-semibold text-gray-700 dark:text-gray-300">کد پیگیری: </strong> {reservation.trackingCode}</p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 mt-4">
                    {onNavigate && (
                        <button 
                            type="button"
                            onClick={() => onNavigate('User Profile', reservation.user)}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-3 rounded-lg text-xs whitespace-nowrap hover:bg-[#353535] dark:hover:bg-gray-600 hover:text-white transition-colors"
                        >
                            مشاهده پروفایل کاربر
                        </button>
                    )}
                    <button className="bg-[#353535] dark:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-xs whitespace-nowrap hover:bg-opacity-90 dark:hover:bg-opacity-80">
                        مشاهده جزئیات
                    </button>
                    <button onClick={onDelete} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-md">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            {/* نمای ردیف جدول برای دسکتاپ */}
            <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_2.5fr] items-center py-3 border-gray-200 dark:border-gray-700 border-b last:border-b-0 text-sm text-gray-700 dark:text-gray-300">
                <div className="text-center px-2">
                     <p className="font-semibold whitespace-nowrap text-gray-800 dark:text-gray-200">{reservation.user.name}</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span dir="ltr" className="inline-block">{formatPhoneWithPrefix(reservation.user.phone)}</span>
                     </p>
                </div>
                <div className="text-center px-2 font-semibold">{reservation.hotelName}</div>
                <div className="text-center px-2">{reservation.dateRange}</div>
                <div className="text-center px-2">{reservation.trackingCode}</div>
                <div className="text-center px-2">
                    <StatusBadge status={reservation.status}/>
                </div>
                <div className="flex items-center justify-end gap-2 px-2">
                    {onNavigate && (
                        <button 
                            type="button"
                            onClick={() => onNavigate('User Profile', reservation.user)}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-3 rounded-lg text-xs whitespace-nowrap hover:bg-[#353535] dark:hover:bg-gray-600 hover:text-white transition-colors"
                        >
                            مشاهده پروفایل کاربر
                        </button>
                    )}
                    <button className="bg-[#353535] dark:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-xs whitespace-nowrap hover:bg-opacity-90 dark:hover:bg-opacity-80">
                        مشاهده جزئیات
                    </button>
                    <button onClick={onDelete} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-md">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
    )
}

// کامپوننت برای نمایش جدول رزروها
const ReservationTable: React.FC<{ reservations: Reservation[]; onOpenDeleteModal: (reservation: Reservation) => void; onNavigate?: (view: string, user: User) => void; }> = ({ reservations, onOpenDeleteModal, onNavigate }) => {
    const headers = ['کاربر', 'نام هتل', 'تاریخ ورود / خروج', 'کد پیگیری', 'وضعیت'];
    return (
        <div>
            {/* هدر جدول (فقط دسکتاپ) */}
            <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_2.5fr] items-center px-2 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm font-semibold text-gray-500 dark:text-gray-400">
                {headers.map((header) => <div key={header} className="text-center px-2">{header}</div>)}
                <div className="text-left px-2"></div>
            </div>
            <div>
                {reservations.map(res => <ReservationRow key={res.id} reservation={res} onDelete={() => onOpenDeleteModal(res)} onNavigate={onNavigate} />)}
            </div>
        </div>
    )
}

// کامپوننت برای نمایش یک ردیف از لیست درخواست‌های حقوقی
const LegalRequestRow: React.FC<{ request: LegalProfileRequest; onNavigate?: (view: string, user: User) => void; }> = ({ request, onNavigate }) => {
    return (
        <>
            {/* نمای کارت برای موبایل */}
            <div className="block lg:hidden p-4 border border-gray-200 dark:border-gray-700 rounded-lg my-4">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4 text-right">
                         <img src={request.user.avatar} alt={request.user.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="text-right">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{request.user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <span dir="ltr" className="inline-block">{formatPhoneWithPrefix(request.user.phone)}</span>
                            </p>
                        </div>
                    </div>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg">{String(request.id).padStart(2, '0')}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                    <StatusBadge status={request.status} />
                    <div className="flex items-center gap-2">
                        {onNavigate && (
                            <button 
                                type="button"
                                onClick={() => onNavigate('User Profile', request.user)}
                                className="font-semibold py-2 px-3 rounded-lg text-xs whitespace-nowrap h-9 transition-colors bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-[#353535] dark:hover:bg-gray-600 hover:text-white"
                            >
                                مشاهده پروفایل کاربر
                            </button>
                        )}
                        <button className="bg-[#353535] dark:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-xs whitespace-nowrap hover:bg-opacity-80">
                            مشاهده درخواست
                        </button>
                    </div>
                </div>
            </div>

            {/* نمای ردیف جدول برای دسکتاپ */}
            <div className="hidden lg:grid grid-cols-[auto_1fr_auto] items-center py-3 border-gray-200 dark:border-gray-700 border-b last:border-b-0 gap-x-5">
                 <div className="flex justify-center pr-2">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex items-center justify-center rounded-lg">{String(request.id).padStart(2, '0')}</span>
                </div>
                <div className="flex items-center gap-4 text-right">
                     <img src={request.user.avatar} alt={request.user.name} className="w-10 h-10 rounded-lg object-cover" />
                     <div className="text-right">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{request.user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span dir="ltr" className="inline-block">{formatPhoneWithPrefix(request.user.phone)}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                     <div className="flex items-center gap-2">
                        <StatusBadge status={request.status} />
                        {onNavigate && (
                            <button 
                                type="button"
                                onClick={() => onNavigate('User Profile', request.user)}
                                className="font-semibold py-2 px-3 rounded-lg text-xs whitespace-nowrap h-9 transition-colors bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-[#353535] dark:hover:bg-gray-600 hover:text-white"
                            >
                                مشاهده پروفایل کاربر
                            </button>
                        )}
                        <button className="bg-[#353535] dark:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-xs whitespace-nowrap hover:bg-opacity-80">
                            مشاهده درخواست
                        </button>
                     </div>
                </div>
            </div>
        </>
    );
};

// کامپوننت برای نمایش جدول درخواست‌های حقوقی
const LegalRequestTable: React.FC<{ requests: LegalProfileRequest[]; onNavigate?: (view: string, user: User) => void; }> = ({ requests, onNavigate }) => {
    return (
        <div>
            {/* هدر جدول (فقط دسکتاپ) */}
            <div className="hidden lg:grid grid-cols-[auto_1fr_auto] items-center px-0 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm font-semibold text-gray-500 dark:text-gray-400 gap-x-5">
                <div className="text-center pr-2">ردیف</div>
                <div className="text-right">اطلاعات کاربر</div>
                <div className="text-center"></div>
            </div>
            <div>
                {requests.map(req => <LegalRequestRow key={req.id} request={req} onNavigate={onNavigate} />)}
            </div>
        </div>
    );
};

// کامپوننت اصلی UserList
const UserList: React.FC<UserListProps> = ({ users, reservations, legalRequests, activeTab, onTabChange, currentPage, totalPages, onPageChange, searchQuery, onSearchChange, onOpenDeleteModal, onNavigate }) => {
    const tabs = ['لیست کاربران آنلاین', 'لیست کاربران جدید', 'لیست رزروهای جدید', 'لیست درخواست پروفایل حقوقی'];
    
    // تابع برای رندر کردن محتوای مناسب بر اساس تب فعال
    const renderContent = () => {
        // اگر جستجو نتیجه‌ای نداشت
        if (searchQuery && users.length === 0 && reservations.length === 0 && legalRequests.length === 0) {
            return <div className="text-center text-gray-500 dark:text-gray-400 py-10">نتیجه‌ای یافت نشد.</div>;
        }
        switch (activeTab) {
            case 'لیست درخواست پروفایل حقوقی':
                return <LegalRequestTable requests={legalRequests} onNavigate={onNavigate} />;
            case 'لیست رزروهای جدید':
                return <ReservationTable reservations={reservations} onOpenDeleteModal={onOpenDeleteModal!} onNavigate={onNavigate} />;
            default:
                return users.map((user) => <UserRow key={user.id} user={user} onNavigate={onNavigate} />);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex-1 flex flex-col overflow-y-auto scrollbar-right">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-700">
                {/* تب‌ها */}
                <div className="flex-1 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                    <div className="flex items-center gap-4 whitespace-nowrap">
                        {tabs.map((tab) => (
                            <button 
                                key={tab} 
                                onClick={() => onTabChange(tab)}
                                className="relative pb-4 pt-2 text-sm font-semibold transition-colors group"
                            >
                                <span className={activeTab === tab 
                                    ? 'text-gray-800 dark:text-gray-100 font-bold' 
                                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                }>
                                    {tab}
                                </span>
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#353535] dark:bg-gray-300"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                {/* فیلد جستجو */}
                <div className="relative w-full sm:w-auto my-4 sm:my-0">
                    <input 
                        type="text" 
                        placeholder="جستجوی نام یا شماره..." 
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 pr-10 pl-4 w-full sm:w-auto text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-right"/>
                    <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"/>
                </div>
            </div>
            
            {/* محتوای لیست */}
            <div className="pt-6 flex-1">
                {renderContent()}
            </div>

            {/* صفحه‌بندی */}
            {totalPages > 1 && <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />}
        </div>
    );
};

export default UserList;