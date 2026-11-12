'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BankIcon, DocumentTextIcon, SearchIcon, PlusIcon, TrashIcon, RefreshIcon, ShieldTickIcon, ShieldCrossIcon } from './icons';
import Pagination from './Pagination';

interface HotelItem {
  id: number;
  name: string;
  city: string;
  status: 'منتشر شده' | 'پیش‌نویس';
  stars: number;
  type: string;
  tags: string[];
  isSnapp: boolean;
  snappId?: string | number;
  logo?: string;
}

const initialHotelsData: HotelItem[] = [
  { id: 66, name: 'مهرگان', city: 'تهران', status: 'منتشر شده', stars: 2, type: 'هتل آپارتمان', tags: ['هتل اقتصادی', 'نزدیک به کلیسای مقدس'], isSnapp: true, snappId: '48' },
  { id: 65, name: 'لولاگر (گودو)', city: 'تهران', status: 'منتشر شده', stars: 1, type: 'اقامتگاه سنتی', tags: ['هتل اقتصادی', 'مهمانپذیر درجه ۱'], isSnapp: false, snappId: '-' },
  { id: 64, name: 'زیبا', city: 'تهران', status: 'منتشر شده', stars: 2, type: 'هتل', tags: ['هتل اقتصادی', 'نزدیک به سفارت آلمان'], isSnapp: true, snappId: '436' },
  { id: 63, name: 'مینا', city: 'تهران', status: 'منتشر شده', stars: 2, type: 'هتل', tags: ['هتل اقتصادی', 'نزدیک به دروازه دولت'], isSnapp: true, snappId: '2766' },
  { id: 62, name: 'خانواده', city: 'تهران', status: 'منتشر شده', stars: 1, type: 'مهمانپذیر', tags: ['هتل اقتصادی', 'نزدیک به موزه عبرت'], isSnapp: false, snappId: '-' },
  { id: 61, name: 'بابا طاهر', city: 'تهران', status: 'منتشر شده', stars: 3, type: 'هتل', tags: ['هتل اقتصادی', 'نزدیک به میدان فردوسی'], isSnapp: true, snappId: '55' },
  { id: 60, name: 'آسیا', city: 'تهران', status: 'منتشر شده', stars: 1, type: 'هتل', tags: ['هتل اقتصادی', 'نزدیک به چهارراه ولیعصر'], isSnapp: true, snappId: '434' },
  { id: 59, name: 'سیمرغ', city: 'شیراز', status: 'منتشر شده', stars: 4, type: 'هتل', tags: ['لوکس', 'نزدیک حافظیه'], isSnapp: true, snappId: '112' },
  { id: 58, name: 'کوروش', city: 'اصفهان', status: 'منتشر شده', stars: 3, type: 'هتل', tags: ['نزدیک سی‌وسه‌پل'], isSnapp: true, snappId: '305' },
  { id: 57, name: 'داریوش', city: 'کیش', status: 'منتشر شده', stars: 5, type: 'هتل', tags: ['ساحلی', 'لوکس'], isSnapp: true, snappId: '99' },
  { id: 56, name: 'هما', city: 'مشهد', status: 'منتشر شده', stars: 4, type: 'هتل', tags: ['نزدیک حرم'], isSnapp: true, snappId: '210' },
  { id: 55, name: 'اسپیناس پالاس', city: 'تهران', status: 'منتشر شده', stars: 5, type: 'هتل', tags: ['فوق لوکس', 'سعادت‌آباد'], isSnapp: true, snappId: '101' },
  { id: 54, name: 'پردیسان', city: 'مشهد', status: 'منتشر شده', stars: 5, type: 'هتل', tags: ['ییلاقی', 'لوکس'], isSnapp: true, snappId: '202' },
  { id: 53, name: 'عباسی', city: 'اصفهان', status: 'منتشر شده', stars: 5, type: 'اقامتگاه سنتی', tags: ['تاریخی', 'چهارباغ'], isSnapp: true, snappId: '333' },
  { id: 52, name: 'پارسیان آزادی', city: 'تهران', status: 'منتشر شده', stars: 5, type: 'هتل', tags: ['هتل مدرن', 'شمال تهران'], isSnapp: true, snappId: '890' },
];

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  searchable?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, placeholder, searchable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFilterText('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!filterText.trim()) return options;
    return options.filter(o => o.label.toLowerCase().includes(filterText.toLowerCase().trim()));
  }, [options, filterText]);

  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2.5 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0] shadow-2xs transition-all flex items-center justify-between"
      >
        <span>{selectedLabel}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl p-2 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
          {searchable && (
            <div className="mb-2 p-1">
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="جستجو در لیست..."
                className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6644F0]"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="space-y-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => (
                <button
                  key={`${opt.value}-${index}`}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setFilterText('');
                  }}
                  className={`w-full text-right px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    value === opt.value
                      ? 'bg-violet-50 dark:bg-violet-950/50 text-[#6644F0] dark:text-violet-300 font-bold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span>{opt.label}</span>
                  {value === opt.value && <span className="text-[#6644F0]">✓</span>}
                </button>
              ))
            ) : (
              <div className="text-center py-3 text-xs text-gray-400">موردی یافت نشد</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [selectedType, setSelectedType] = useState('همه');
  const [hotels, setHotels] = useState<HotelItem[]>(initialHotelsData);
  const itemsPerPage = 10;

  const cityOptions = [
    { label: 'همه شهرها', value: 'همه' },
    { label: 'تهران', value: 'تهران' },
    { label: 'شیراز', value: 'شیراز' },
    { label: 'اصفهان', value: 'اصفهان' },
    { label: 'کیش', value: 'کیش' },
    { label: 'مشهد', value: 'مشهد' },
    { label: 'تبریز', value: 'تبریز' },
    { label: 'رشت', value: 'رشت' },
    { label: 'مازندران', value: 'مازندران' },
    { label: 'قم', value: 'قم' },
    { label: 'کرمان', value: 'کرمان' },
    { label: 'یزد', value: 'یزد' },
    { label: 'اهواز', value: 'اهواز' },
    { label: 'قشم', value: 'قشم' },
    { label: 'رامسر', value: 'رامسر' },
  ];

  const typeOptions = [
    { label: 'همه نوع اقامتگاه‌ها', value: 'همه' },
    { label: 'هتل', value: 'هتل' },
    { label: 'هتل آپارتمان', value: 'هتل آپارتمان' },
    { label: 'اقامتگاه سنتی', value: 'اقامتگاه سنتی' },
    { label: 'مهمانپذیر', value: 'مهمانپذیر' },
    { label: 'ویلا', value: 'ویلا' },
    { label: 'بوم‌گردی', value: 'بوم‌گردی' },
    { label: 'سوئیت', value: 'سوئیت' },
    { label: 'متل', value: 'متل' },
    { label: 'هاستل', value: 'هاستل' },
  ];

  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      const matchesSearch = !searchQuery.trim() || 
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        hotel.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase().trim()));

      const matchesCity = selectedCity === 'همه' || hotel.city === selectedCity;
      const matchesType = selectedType === 'همه' || hotel.type === selectedType;

      return matchesSearch && matchesCity && matchesType;
    });
  }, [hotels, searchQuery, selectedCity, selectedType]);

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
          {/* نوار جستجوی پیشرفته و فیلترها با CustomDropdown */}
          <div className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                className="w-full pr-9 pl-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0] shadow-2xs transition-all"
              />
            </div>

            {/* فیلتر شهر با منوی سفارشی و جستجو */}
            <div>
              <CustomDropdown
                value={selectedCity}
                onChange={(val) => {
                  setSelectedCity(val);
                  setCurrentPage(1);
                }}
                options={cityOptions}
                placeholder="همه شهرها"
                searchable={true}
              />
            </div>

            {/* فیلتر نوع اقامتگاه با منوی سفارشی و جستجو */}
            <div>
              <CustomDropdown
                value={selectedType}
                onChange={(val) => {
                  setSelectedType(val);
                  setCurrentPage(1);
                }}
                options={typeOptions}
                placeholder="همه نوع اقامتگاه‌ها"
                searchable={true}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-3 text-xs text-gray-500 dark:text-gray-400 px-1">
            <span>مجموع هتل‌های یافت شده: <strong className="text-gray-800 dark:text-gray-200">{filteredHotels.length}</strong> مورد</span>
            {(selectedCity !== 'همه' || selectedType !== 'همه' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCity('همه');
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
                  <th className="p-3">ID</th>
                  <th className="p-3">نام هتل</th>
                  <th className="p-3">شهر</th>
                  <th className="p-3">وضعیت انتشار</th>
                  <th className="p-3 text-center">تعداد ستاره</th>
                  <th className="p-3">نوع اقامتگاه</th>
                  <th className="p-3 text-center">هتل اسنپ؟</th>
                  <th className="p-3 text-center">شناسه اسنپ</th>
                  <th className="p-3">عملیات اسنپ</th>
                  <th className="p-3">تگ‌های عمومی</th>
                  <th className="p-3 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-xs text-gray-700 dark:text-gray-200">
                {currentHotels.length > 0 ? (
                  currentHotels.map((hotel) => (
                    <tr key={hotel.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="p-3 font-mono text-gray-500 dark:text-gray-400">{hotel.id}</td>
                      <td className="p-3 font-bold text-gray-800 dark:text-gray-100">{hotel.name}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-300">{hotel.city}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                          {hotel.status}
                        </span>
                      </td>
                      <td className="p-3 text-center font-medium">{hotel.stars} ستاره</td>
                      <td className="p-3 text-gray-600 dark:text-gray-300">{hotel.type}</td>
                      <td className="p-3 text-center">
                        {hotel.isSnapp ? (
                          <ShieldTickIcon className="w-5 h-5 mx-auto" />
                        ) : (
                          <ShieldCrossIcon className="w-5 h-5 mx-auto" />
                        )}
                      </td>
                      <td className="p-3 text-center font-mono">
                        {hotel.snappId !== '-' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-violet-50 dark:bg-violet-950/50 text-[#6644F0] dark:text-violet-300 border border-violet-200 dark:border-violet-800 shadow-2xs">
                            {hotel.snappId}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => handleSnappSync(hotel.name)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-medium transition-colors shadow-2xs flex items-center gap-1"
                        >
                          <RefreshIcon className="w-3.5 h-3.5" />
                          <span>دریافت اتاق‌ها از اسنپ</span>
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {hotel.tags.map((tag, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-violet-50 dark:bg-violet-950/50 text-[#6644F0] dark:text-violet-300 border border-violet-200 dark:border-violet-800 shadow-2xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteHotel(hotel.id, hotel.name)}
                          className="p-1.5 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                          title="حذف هتل"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="text-center py-8 text-gray-400 text-xs">
                      هیچ هتلی با این مشخصات یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* پجینیشن */}
          {totalPages > 1 && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-[#6644F0] mb-4">
            <DocumentTextIcon className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1">{activeTab}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm">این بخش به زودی فعال خواهد شد. تمامی اطلاعات این تب نیز در پایگاه داده مدیریت می‌شود.</p>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;
