'use client';

import React, { useState, useMemo } from 'react';
import { BankIcon, DocumentTextIcon, SearchIcon, PlusIcon, TrashIcon, RefreshIcon } from './icons';
import Pagination from './Pagination';

interface HotelItem {
  id: number;
  name: string;
  city: string;
  status: 'منتشر شده' | 'پیش‌نویس';
  stars: number;
  rating: number;
  type: string;
  tags: string[];
  isSnapp: boolean;
  snappId?: string | number;
  logo: string;
}

const initialHotelsData: HotelItem[] = [
  { id: 66, name: 'مهرگان', city: 'تهران', status: 'منتشر شده', stars: 2, rating: 2.1, type: 'هتل آپارتمان', tags: ['هتل اقتصادی', 'نزدیک به کلیسای مقدس'], isSnapp: true, snappId: '48', logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=60&h=60&fit=crop' },
  { id: 65, name: 'لولاگر (گودو)', city: 'تهران', status: 'منتشر شده', stars: 1, rating: 1.2, type: 'اقامتگاه سنتی', tags: ['هتل اقتصادی', 'مهمانپذیر درجه ۱'], isSnapp: false, snappId: '-', logo: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=60&h=60&fit=crop' },
  { id: 64, name: 'زیبا', city: 'تهران', status: 'منتشر شده', stars: 2, rating: 2.6, type: 'هتل', tags: ['هتل اقتصادی', 'نزدیک به سفارت آلمان'], isSnapp: true, snappId: '436', logo: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=60&h=60&fit=crop' },
  { id: 63, name: 'مینا', city: 'تهران', status: 'منتشر شده', stars: 2, rating: 2.1, type: 'هتل', tags: ['هتل اقتصادی', 'نزدیک به دروازه دولت'], isSnapp: true, snappId: '2766', logo: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=60&h=60&fit=crop' },
  { id: 62, name: 'خانواده', city: 'تهران', status: 'منتشر شده', stars: 1, rating: 1.5, type: 'مهمانپذیر', tags: ['هتل اقتصادی', 'نزدیک به موزه عبرت'], isSnapp: false, snappId: '-', logo: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=60&h=60&fit=crop' },
  { id: 61, name: 'بابا طاهر', city: 'تهران', status: 'منتشر شده', stars: 3, rating: 4.5, type: 'هتل', tags: ['هتل اقتصادی', 'نزدیک به میدان فردوسی'], isSnapp: true, snappId: '55', logo: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=60&h=60&fit=crop' },
  { id: 60, name: 'آسیا', city: 'تهران', status: 'منتشر شده', stars: 1, rating: 1.1, type: 'هتل', tags: ['هتل اقتصادی', 'نزدیک به ایستگاه مترو ملت'], isSnapp: true, snappId: '434', logo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=60&h=60&fit=crop' },
  { id: 59, name: 'کوروش', city: 'شیراز', status: 'منتشر شده', stars: 4, rating: 4.2, type: 'هتل', tags: ['هتل لوکس', 'نزدیک ارگ کریمخان'], isSnapp: true, snappId: '782', logo: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=60&h=60&fit=crop' },
  { id: 58, name: 'پارسیان', city: 'اصفهان', status: 'منتشر شده', stars: 5, rating: 4.8, type: 'هتل', tags: ['هتل پنج ستاره', 'سنتی و مدرن'], isSnapp: true, snappId: '912', logo: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=60&h=60&fit=crop' },
  { id: 57, name: 'داریوش', city: 'کیش', status: 'منتشر شده', stars: 5, rating: 4.9, type: 'هتل', tags: ['هتل ۵ ستاره', 'معماری هخامنشی'], isSnapp: true, snappId: '105', logo: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=60&h=60&fit=crop' },
  { id: 56, name: 'اسپیناس پالاس', city: 'تهران', status: 'منتشر شده', stars: 5, rating: 4.9, type: 'هتل', tags: ['هتل فوق لوکس', 'سعادت آباد'], isSnapp: true, snappId: '301', logo: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=60&h=60&fit=crop' },
  { id: 55, name: 'هما', city: 'شیراز', status: 'منتشر شده', stars: 4, rating: 4.1, type: 'هتل', tags: ['هتل با باغ زیبا', 'نزدیک حافظیه'], isSnapp: false, snappId: '-', logo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=60&h=60&fit=crop' },
  { id: 54, name: 'قصر طلایی', city: 'مشهد', status: 'منتشر شده', stars: 5, rating: 4.7, type: 'هتل', tags: ['هتل مجلل', 'نزدیک حرم مطهر'], isSnapp: true, snappId: '512', logo: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=60&h=60&fit=crop' },
  { id: 53, name: 'لاله', city: 'تهران', status: 'پیش‌نویس', stars: 4, rating: 3.9, type: 'هتل', tags: ['هتل بین‌المللی', 'مرکز تهران'], isSnapp: false, snappId: '-', logo: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=60&h=60&fit=crop' },
  { id: 52, name: 'پارسیان آزادی', city: 'تهران', status: 'منتشر شده', stars: 5, rating: 4.6, type: 'هتل', tags: ['هتل مدرن', 'شمال تهران'], isSnapp: true, snappId: '890', logo: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=60&h=60&fit=crop' },
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
  const [selectedCity, setSelectedCity] = useState('همه');
  const [selectedStar, setSelectedStar] = useState('همه');
  const [selectedType, setSelectedType] = useState('همه');
  const [hotels, setHotels] = useState<HotelItem[]>(initialHotelsData);
  const [selectedHotels, setSelectedHotels] = useState<number[]>([]);
  const itemsPerPage = 10;

  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      const matchesSearch = !searchQuery.trim() || 
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        hotel.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase().trim()));

      const matchesCity = selectedCity === 'همه' || hotel.city === selectedCity;
      const matchesStar = selectedStar === 'همه' || hotel.stars.toString() === selectedStar;
      const matchesType = selectedType === 'همه' || hotel.type === selectedType;

      return matchesSearch && matchesCity && matchesStar && matchesType;
    });
  }, [hotels, searchQuery, selectedCity, selectedStar, selectedType]);

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  
  const currentHotels = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHotels.slice(start, start + itemsPerPage);
  }, [filteredHotels, currentPage]);

  const handleDeleteHotel = (id: number, name: string) => {
    if (confirm(`آیا از حذف هتل "${name}" اطمینان دارید؟`)) {
      setHotels(prev => prev.filter(h => h.id !== id));
      onShowToast(`هتل "${name}" با موفقیت حذف شد.`, 'success');
    }
  };

  const handleSnappSync = (name: string) => {
    onShowToast(`اتاق‌ها و اطلاعات هتل "${name}" از اسنپ‌تریپ با موفقیت به‌روزرسانی شد.`, 'success');
  };

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
          {/* نوار جستجوی پیشرفته و فیلترها */}
          <div className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* جستجو هوشمند */}
            <div className="relative">
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
                placeholder="جستجو نام هتل، شهر یا تگ..."
                className="w-full pr-9 pl-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
              />
            </div>

            {/* فیلتر شهر */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
              >
                <option value="همه">همه شهرها</option>
                <option value="تهران">تهران</option>
                <option value="شیراز">شیراز</option>
                <option value="اصفهان">اصفهان</option>
                <option value="کیش">کیش</option>
                <option value="مشهد">مشهد</option>
              </select>
            </div>

            {/* فیلتر تعداد ستاره */}
            <div>
              <select
                value={selectedStar}
                onChange={(e) => {
                  setSelectedStar(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
              >
                <option value="همه">همه ستاره‌ها</option>
                <option value="5">۵ ستاره</option>
                <option value="4">۴ ستاره</option>
                <option value="3">۳ ستاره</option>
                <option value="2">۲ ستاره</option>
                <option value="1">۱ ستاره</option>
              </select>
            </div>

            {/* فیلتر نوع اقامتگاه */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
              >
                <option value="همه">همه نوع اقامتگاه‌ها</option>
                <option value="هتل">هتل</option>
                <option value="هتل آپارتمان">هتل آپارتمان</option>
                <option value="اقامتگاه سنتی">اقامتگاه سنتی</option>
                <option value="مهمانپذیر">مهمانپذیر</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3 text-xs text-gray-500 dark:text-gray-400 px-1">
            <span>مجموع هتل‌های یافت شده: <strong className="text-gray-800 dark:text-gray-200">{filteredHotels.length}</strong> مورد</span>
            {(selectedCity !== 'همه' || selectedStar !== 'همه' || selectedType !== 'همه' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCity('همه');
                  setSelectedStar('همه');
                  setSelectedType('همه');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="text-[#6644F0] hover:underline font-medium"
              >
                حذف فیلترها
              </button>
            )}
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
                  <th className="p-3 text-center">هتل اسنپ؟</th>
                  <th className="p-3 text-center">شناسه اسنپ</th>
                  <th className="p-3">عملیات اسنپ</th>
                  <th className="p-3">لوگو</th>
                  <th className="p-3">تگ‌های عمومی</th>
                  <th className="p-3 text-center">عملیات</th>
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
                      <td className="p-3 font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">{hotel.name}</td>
                      <td className="p-3 whitespace-nowrap">{hotel.city}</td>
                      <td className="p-3 whitespace-nowrap">
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
                      <td className="p-3 text-center font-bold whitespace-nowrap">{hotel.stars} ستاره</td>
                      <td className="p-3 text-center font-semibold text-violet-600 dark:text-violet-400">{hotel.rating}</td>
                      <td className="p-3 whitespace-nowrap">{hotel.type}</td>
                      
                      {/* هتل اسنپ است؟ */}
                      <td className="p-3 text-center">
                        {hotel.isSnapp ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 font-bold">✓</span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 font-bold">×</span>
                        )}
                      </td>

                      {/* شناسه اسنپ */}
                      <td className="p-3 text-center font-mono text-gray-500">{hotel.snappId}</td>

                      {/* عملیات اسنپ (بدون چک‌باکس، دکمه بروزرسانی) */}
                      <td className="p-3 whitespace-nowrap">
                        <button
                          onClick={() => handleSnappSync(hotel.name)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <RefreshIcon className="w-3.5 h-3.5" />
                          <span>دریافت اتاق‌ها از اسنپ</span>
                        </button>
                      </td>

                      <td className="p-3">
                        <img src={hotel.logo} alt={hotel.name} className="w-8 h-8 rounded-lg object-cover border border-gray-200 dark:border-gray-600" />
                      </td>

                      {/* تگ‌های جداگانه با استایل مربع حاشیه گرد، استروک و بک‌گراند بنفش */}
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1.5 min-w-[200px]">
                          {hotel.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg border border-[#6644F0] bg-purple-50 dark:bg-purple-950/40 text-[#6644F0] dark:text-purple-300 text-[11px] font-semibold whitespace-nowrap shadow-2xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* دکمه حذف جداگانه برای هر هتل */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteHotel(hotel.id, hotel.name)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                          title="حذف هتل"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={14} className="text-center py-12 text-gray-400">
                      هتلی با این مشخصات یافت نشد.
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
};

export default HotelManagement;
