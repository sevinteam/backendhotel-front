'use client';

import React, { useState, useMemo } from 'react';
import { BankIcon, DocumentTextIcon, SearchIcon, PlusIcon } from './icons';
import Pagination from './Pagination';

interface HotelItem {
  id: number;
  name: string;
  city: string;
  status: 'منتشر شده' | 'پیش‌نویس';
  stars: number;
  rating: number;
  type: string;
  tags: string;
  logo: string;
}

const initialHotelsData: HotelItem[] = [
  { id: 66, name: 'مهرگان', city: 'تهران', status: 'منتشر شده', stars: 2, rating: 2.1, type: 'هتل آپارتمان', tags: 'هتل اقتصادی نزدیک به کلیسای مقدس', logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=60&h=60&fit=crop' },
  { id: 65, name: 'لولاگر (گودو)', city: 'تهران', status: 'منتشر شده', stars: 1, rating: 1.2, type: 'اقامتگاه سنتی', tags: 'هتل اقتصادی مهمانپذیر درجه ۱', logo: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=60&h=60&fit=crop' },
  { id: 64, name: 'زیبا', city: 'تهران', status: 'منتشر شده', stars: 2, rating: 2.6, type: 'هتل', tags: 'هتل اقتصادی نزدیک به سفارت آلمان', logo: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=60&h=60&fit=crop' },
  { id: 63, name: 'مینا', city: 'تهران', status: 'منتشر شده', stars: 2, rating: 2.1, type: 'هتل', tags: 'هتل اقتصادی نزدیک به دروازه دولت', logo: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=60&h=60&fit=crop' },
  { id: 62, name: 'خانواده', city: 'تهران', status: 'منتشر شده', stars: 1, rating: 1.5, type: 'مهمانپذیر', tags: 'هتل اقتصادی مهمانپذیر درجه ۱ نزدیک به موزه عبرت', logo: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=60&h=60&fit=crop' },
  { id: 61, name: 'بابا طاهر', city: 'تهران', status: 'منتشر شده', stars: 3, rating: 4.5, type: 'هتل', tags: 'هتل اقتصادی نزدیک به میدان فردوسی', logo: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=60&h=60&fit=crop' },
  { id: 60, name: 'آسیا', city: 'تهران', status: 'منتشر شده', stars: 1, rating: 1.1, type: 'هتل', tags: 'هتل اقتصادی نزدیک به ایستگاه مترو ملت', logo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=60&h=60&fit=crop' },
  { id: 59, name: 'کوروش', city: 'شیراز', status: 'منتشر شده', stars: 4, rating: 4.2, type: 'هتل', tags: 'هتل لوکس نزدیک ارگ کریمخان', logo: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=60&h=60&fit=crop' },
  { id: 58, name: 'پارسیان', city: 'اصفهان', status: 'منتشر شده', stars: 5, rating: 4.8, type: 'هتل', tags: 'هتل پنج ستاره سنتی و مدرن در نصف جهان', logo: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=60&h=60&fit=crop' },
  { id: 57, name: 'داریوش', city: 'کیش', status: 'منتشر شده', stars: 5, rating: 4.9, type: 'هتل', tags: 'هتل ۵ ستاره با معماری هخامنشی', logo: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=60&h=60&fit=crop' },
  { id: 56, name: 'اسپیناس پالاس', city: 'تهران', status: 'منتشر شده', stars: 5, rating: 4.9, type: 'هتل', tags: 'هتل فوق لوکس در سعادت آباد تهران', logo: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=60&h=60&fit=crop' },
  { id: 55, name: 'هما', city: 'شیراز', status: 'منتشر شده', stars: 4, rating: 4.1, type: 'هتل', tags: 'هتل با باغ زیبا در نزدیکی حافظیه', logo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=60&h=60&fit=crop' },
  { id: 54, name: 'قصر طلایی', city: 'مشهد', status: 'منتشر شده', stars: 5, rating: 4.7, type: 'هتل', tags: 'هتل مجلل در نزدیکی حرم مطهر', logo: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=60&h=60&fit=crop' },
  { id: 53, name: 'لاله', city: 'تهران', status: 'پیش‌نویس', stars: 4, rating: 3.9, type: 'هتل', tags: 'هتل بین‌المللی در مرکز تهران', logo: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=60&h=60&fit=crop' },
  { id: 52, name: 'پارسیان آزادی', city: 'تهران', status: 'منتشر شده', stars: 5, rating: 4.6, type: 'هتل', tags: 'هتل مدرن و بین‌المللی شمال تهران', logo: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=60&h=60&fit=crop' },
];

interface HotelManagementProps {
  onShowToast: (message: string, type: 'success' | 'error') => void;
  theme: string;
}

const HotelManagement: React.FC<HotelManagementProps> = ({ onShowToast, theme }) => {
  const tabs = [
    'لیست هتل‌ها',
    'مدیریت اتاق‌ها',
    'امکانات رفاهی',
    'گالری تصاویر',
    'برند و لوگو',
    'برچسب‌های هتل',
  ];

  const [activeTab, setActiveTab] = useState('لیست هتل‌ها');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHotels, setSelectedHotels] = useState<number[]>([]);
  const itemsPerPage = 10;

  const filteredHotels = useMemo(() => {
    if (!searchQuery.trim()) return initialHotelsData;
    const query = searchQuery.toLowerCase().trim();
    return initialHotelsData.filter(h => h.name.toLowerCase().includes(query) || h.city.toLowerCase().includes(query));
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  
  const currentHotels = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHotels.slice(start, start + itemsPerPage);
  }, [filteredHotels, currentPage]);

  const toggleSelectAll = () => {
    if (selectedHotels.length === currentHotels.length) {
      setSelectedHotels([]);
    } else {
      setSelectedHotels(currentHotels.map(h => h.id));
    }
  };

  const toggleSelectHotel = (id: number) => {
    setSelectedHotels(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col flex-1 overflow-hidden p-6">
      {/* هدر بخش */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-[#6644F0]">
            <BankIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">مدیریت هتل و اتاق‌ها</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">مدیریت جامع هتل‌ها، اتاق‌ها، امکانات و گالری تصاویر</p>
          </div>
        </div>
        <button
          onClick={() => onShowToast('فرم افزودن هتل جدید باز شد', 'success')}
          className="bg-[#6644F0] hover:bg-[#5533E0] text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          <span>افزودن هتل</span>
        </button>
      </div>

      {/* تب‌های ناوبری */}
      <div className="flex overflow-x-auto gap-2 py-4 border-b border-gray-100 dark:border-gray-700 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#6644F0] text-white shadow-sm'
                  : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* محتوای تب */}
      {activeTab === 'لیست هتل‌ها' ? (
        <div className="flex-1 flex flex-col pt-4">
          {/* نوار جستجو و ابزار */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <SearchIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="جستجو نام هتل یا شهر..."
                className="w-full pr-9 pl-4 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              مجموع هتل‌ها: <span className="font-bold text-gray-800 dark:text-gray-200">{filteredHasDataCount(filteredHotels.length)}</span> مورد
            </div>
          </div>

          {/* جدول هتل‌ها */}
          <div className="overflow-x-auto flex-1 border border-gray-200 dark:border-gray-700 rounded-xl">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-[11px] font-bold border-b border-gray-200 dark:border-gray-700">
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedHotels.length === currentHotels.length && currentHotels.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-[#6644F0] focus:ring-[#6644F0]"
                    />
                  </th>
                  <th className="p-3">ID</th>
                  <th className="p-3">نام هتل</th>
                  <th className="p-3">شهر</th>
                  <th className="p-3">وضعیت انتشار</th>
                  <th className="p-3 text-center">تعداد ستاره</th>
                  <th className="p-3 text-center">امتیاز</th>
                  <th className="p-3">نوع اقامتگاه</th>
                  <th className="p-3">لوگو</th>
                  <th className="p-3">تگ‌های عمومی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-xs text-gray-700 dark:text-gray-200">
                {currentHotels.length > 0 ? (
                  currentHotels.map((hotel) => (
                    <tr key={hotel.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedHotels.includes(hotel.id)}
                          onChange={() => toggleSelectHotel(hotel.id)}
                          className="rounded border-gray-300 text-[#6644F0] focus:ring-[#6644F0]"
                        />
                      </td>
                      <td className="p-3 font-semibold text-gray-500 dark:text-gray-400">{hotel.id}</td>
                      <td className="p-3 font-bold text-gray-900 dark:text-gray-100">{hotel.name}</td>
                      <td className="p-3">{hotel.city}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold ${
                            hotel.status === 'منتشر شده'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}
                        >
                          {hotel.status}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold">{hotel.stars} ستاره</td>
                      <td className="p-3 text-center font-semibold text-violet-600 dark:text-violet-400">{hotel.rating}</td>
                      <td className="p-3">{hotel.type}</td>
                      <td className="p-3">
                        <img src={hotel.logo} alt={hotel.name} className="w-8 h-8 rounded-lg object-cover border border-gray-200 dark:border-gray-600" />
                      </td>
                      <td className="p-3 text-gray-500 dark:text-gray-400 max-w-xs truncate">{hotel.tags}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-gray-400">
                      هتلی یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* صفحه‌بندی (۱۰ تا ۱۰ تا) */}
          {totalPages > 1 && (
            <div className="pt-4 mt-auto">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center flex-col text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-300 dark:text-gray-500 mb-4">
            <DocumentTextIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-700 dark:text-gray-200">بخش {activeTab}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-sm">
            اطلاعات این تب به‌زودی از طریق APIهای جنگو بارگذاری خواهد شد.
          </p>
        </div>
      )}
    </div>
  );

  function filteredHasDataCount(count: number) {
    return count;
  }
};

export default HotelManagement;
