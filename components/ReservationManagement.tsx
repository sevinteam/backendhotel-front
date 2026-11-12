
import React, { useState, useMemo } from 'react';
import type { ManagedReservation, PaymentStatus } from '../types';
import { PlusIcon, SearchIcon, DotsVerticalIcon } from './icons';
import Pagination from './Pagination';

// داده‌های نمونه برای رزروها
const reservationsData: ManagedReservation[] = [
  { id: 1, trackingCode: 'sfa3218870581', user: { name: 'علیرضا آذرخش آلوچه', phone: '+98 9912356290' }, mainTravelerName: 'علیرضا آذرخش آلوچه', dateRange: '۱۴۰۳/۰۶/۲۴ - ۱۴۰۳/۰۶/۲۴', hotelName: 'هتل اسپیناس پالاس', roomCount: 2, status: 'در انتظار پرداخت' },
  { id: 2, trackingCode: 'sfa3218870582', user: { name: 'علیرضا علوی', phone: '+98 9912356290' }, mainTravelerName: 'علیرضا علوی', dateRange: '۱۴۰۳/۰۶/۲۴ - ۱۴۰۳/۰۶/۲۴', hotelName: 'هتل استقلال تهران', roomCount: 20, status: 'عدم تایید' },
  { id: 3, trackingCode: 'sfa3218870583', user: { name: 'پرهام رحیمی', phone: '+98 9912356290' }, mainTravelerName: 'پرهام رحیمی', dateRange: '۱۴۰۳/۰۶/۲۴ - ۱۴۰۳/۰۶/۲۴', hotelName: 'هتل درویشی مشهد', roomCount: 20, status: 'پرداخت شده' },
  { id: 4, trackingCode: 'sfa3218870584', user: { name: 'محمد علی خاکیان', phone: '+98 9912356290' }, mainTravelerName: 'علیرضا آذرخش آلوچه', dateRange: '۱۴۰۳/۰۶/۲۴ - ۱۴۰۳/۰۶/۲۴', hotelName: 'هتل اسپیناس پالاس', roomCount: 12, status: 'لغو شده' },
  { id: 5, trackingCode: 'sfa3218870585', user: { name: 'حسن خلیلی پور', phone: '+98 9912356290' }, mainTravelerName: 'محمد علی خاکیان', dateRange: '۱۴۰۳/۰۶/۲۴ - ۱۴۰۳/۰۶/۲۴', hotelName: 'هتل اسپیناس پالاس', roomCount: 1, status: 'لغو شده' },
  { id: 6, trackingCode: 'sfa3218870586', user: { name: 'امیر حسین کریمیان', phone: '+98 9912356290' }, mainTravelerName: 'امیر حسین کریمیان', dateRange: '۱۴۰۳/۰۶/۲۴ - ۱۴۰۳/۰۶/۲۴', hotelName: 'هتل اسپیناس پالاس', roomCount: 4, status: 'لغو شده' },
  { id: 7, trackingCode: 'sfa3218870587', user: { name: 'علیرضا کمکیان', phone: '+98 9912356290' }, mainTravelerName: 'علیرضا آذرخش آلوچه', dateRange: '۱۴۰۳/۰۶/۲۴ - ۱۴۰۳/۰۶/۲۴', hotelName: 'هتل اسپیناس پالاس', roomCount: 2, status: 'لغو شده' },
  { id: 8, trackingCode: 'sfa3218870588', user: { name: 'امیر پاشا اسکندری', phone: '+98 9912356290' }, mainTravelerName: 'امیر پاشا اسکندری', dateRange: '۱۴۰۳/۰۶/۲۴ - ۱۴۰۳/۰۶/۲۴', hotelName: 'هتل اسپیناس پالاس', roomCount: 2, status: 'لغو شده' },
  { id: 9, trackingCode: 'sfa3218870589', user: { name: 'سارا محمدی', phone: '+98 9120759427' }, mainTravelerName: 'سارا محمدی', dateRange: '۱۴۰۳/۰۷/۱۰ - ۱۴۰۳/۰۷/۱۵', hotelName: 'هتل داریوش کیش', roomCount: 1, status: 'پرداخت شده' },
  { id: 10, trackingCode: 'sfa3218870590', user: { name: 'نیما رضایی', phone: '+98 9120759428' }, mainTravelerName: 'نیما رضایی', dateRange: '۱۴۰۳/۰۸/۰۱ - ۱۴۰۳/۰۸/۰۳', hotelName: 'هتل عباسی اصفهان', roomCount: 3, status: 'در انتظار پرداخت' },
  { id: 11, trackingCode: 'sfa3218870591', user: { name: 'مریم حسینی', phone: '+98 9120759429' }, mainTravelerName: 'مریم حسینی', dateRange: '۱۴۰۳/۰۹/۲۰ - ۱۴۰۳/۰۹/۲۲', hotelName: 'هتل قصر طلایی مشهد', roomCount: 1, status: 'عدم تایید' },
];

// کامپوننت برای نشان وضعیت پرداخت
const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
    const styles: Record<PaymentStatus, string> = {
        'در انتظار پرداخت': 'bg-[#FFEDD5] text-[#9A3412] dark:bg-orange-900/50 dark:text-orange-300',
        'عدم تایید': 'bg-[#DC2626] text-white',
        'پرداخت شده': 'bg-[#16A34A] text-white',
        'لغو شده': 'bg-[#DC2626] text-white',
    };
    return (
        <span className={`inline-flex justify-center items-center min-w-[120px] px-3 py-1.5 text-xs font-semibold rounded-md ${styles[status] || ''}`}>
            {status}
        </span>
    );
};

// کامپوننت برای نمایش یک ردیف در جدول (دسکتاپ) یا کارت (موبایل)
const ReservationRow: React.FC<{ reservation: ManagedReservation }> = ({ reservation }) => {
    return (
        <div className="md:grid md:grid-cols-[1fr_1.7fr_1.8fr_1.5fr_1fr_1.3fr_1.2fr] md:items-center md:gap-4 text-sm md:py-4 md:px-2">
            
            {/* نمای کارت برای موبایل */}
            <div className="md:hidden p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{reservation.user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{reservation.trackingCode}</p>
                    </div>
                    <PaymentStatusBadge status={reservation.status} />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
                    <div><strong className="text-gray-500 dark:text-gray-400">هتل: </strong> <span className="text-gray-700 dark:text-gray-300">{reservation.hotelName}</span></div>
                    <div><strong className="text-gray-500 dark:text-gray-400">اتاق: </strong> <span className="text-gray-700 dark:text-gray-300">{reservation.roomCount} اتاق</span></div>
                    <div className="col-span-2"><strong className="text-gray-500 dark:text-gray-400">تاریخ: </strong> <span className="text-gray-700 dark:text-gray-300">{reservation.dateRange}</span></div>
                </div>
                <div className="flex justify-end pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <button className="bg-[#353535] dark:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-xs">مشاهده</button>
                        <button className="p-2 text-gray-500 dark:text-gray-400"><DotsVerticalIcon className="w-5 h-5"/></button>
                    </div>
                </div>
            </div>

            {/* نمای گرید برای دسکتاپ */}
            <div className="hidden md:block text-center text-gray-800 dark:text-gray-200 font-semibold">{reservation.trackingCode}</div>
            <div className="hidden md:block">
                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{reservation.user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{reservation.user.phone}</p>
            </div>
            <div className="hidden md:block text-center text-gray-600 dark:text-gray-300">{reservation.dateRange}</div>
            <div className="hidden md:block text-gray-600 dark:text-gray-300">{reservation.hotelName}</div>
            <div className="hidden md:block text-center text-gray-600 dark:text-gray-300">{reservation.roomCount} اتاق</div>
            <div className="hidden md:flex justify-center">
                <PaymentStatusBadge status={reservation.status} />
            </div>
            <div className="hidden md:flex items-center justify-end gap-3">
                <button className="bg-[#353535] dark:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-xs">مشاهده</button>
                <button className="p-2 text-gray-500 dark:text-gray-400"><DotsVerticalIcon className="w-5 h-5"/></button>
            </div>
        </div>
    );
};


const ReservationManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 8;
    
    const headerGridCols = "grid-cols-[1fr_1.7fr_1.8fr_1.5fr_1fr_1.3fr_1.2fr]";


    const filteredReservations = useMemo(() => {
        if (!searchQuery.trim()) return reservationsData;
        const lowercasedQuery = searchQuery.toLowerCase().trim();
        return reservationsData.filter(res =>
            res.trackingCode.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
    const paginatedReservations = filteredReservations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex-1 flex flex-col">
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mb-6">
                 <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="جستجوی کد پیگیری..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 pr-10 pl-4 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                 <button className="flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-violet-700 transition-colors w-full sm:w-auto">
                    <PlusIcon className="w-5 h-5" />
                    <span>افزودن رزرو جدید</span>
                </button>
            </div>
            
            <div className="flex-1 overflow-auto">
                 {/* هدر دسکتاپ */}
                 <div className={`hidden md:grid ${headerGridCols} gap-4 px-2 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4`}>
                     <div className="text-center">کد پیگیری</div>
                     <div className="text-right">نام کاربر</div>
                     <div className="text-center">تاریخ ورود / خروج</div>
                     <div className="text-right">نام هتل</div>
                     <div className="text-center">تعداد اتاق</div>
                     <div className="text-center">وضعیت پرداخت</div>
                     <div></div>
                 </div>

                 {/* لیست رزروها */}
                 <div className="divide-y divide-gray-100 dark:divide-gray-700 md:space-y-0">
                     {paginatedReservations.map((res) => (
                         <ReservationRow key={res.id} reservation={res} />
                     ))}
                 </div>
                 
                 {paginatedReservations.length === 0 && (
                     <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                         نتیجه ای یافت نشد.
                     </div>
                 )}
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
export default ReservationManagement;