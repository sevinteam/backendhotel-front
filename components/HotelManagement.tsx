'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BankIcon, DocumentTextIcon, SearchIcon, PlusIcon, TrashIcon, RefreshIcon, ShieldTickIcon, ShieldCrossIcon } from './icons';
import Pagination from './Pagination';
import ConfirmationModal from './ConfirmationModal';
import HotelEditor from './hotel/HotelEditor';
import { HotelItem, FacilityOption, LogoOption } from './hotel/hotelTypes';
import {
  initialHotelsData,
  cityOptions,
  typeOptions,
  initialTagOptions,
  initialHotelFacilities,
  initialRoomFacilities,
  initialLogoOptions,
  initialRoomServices,
  createEmptyHotel,
} from './hotel/hotelData';

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

const HotelManagement: React.FC<HotelManagementProps> = ({ onShowToast }) => {
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

  // کاتالوگ‌های قابل افزایش در فرم ویرایش/افزودن هتل
  const [availableTags, setAvailableTags] = useState<string[]>(initialTagOptions);
  const [availableHotelFacilities, setAvailableHotelFacilities] = useState<FacilityOption[]>(initialHotelFacilities);
  const [availableRoomFacilities, setAvailableRoomFacilities] = useState<FacilityOption[]>(initialRoomFacilities);
  const [availableLogos, setAvailableLogos] = useState<LogoOption[]>(initialLogoOptions);
  const [availableRoomServices, setAvailableRoomServices] = useState<string[]>(initialRoomServices);

  // وضعیت نمایش بخش ویرایش یا افزودن هتل
  const [editorState, setEditorState] = useState<{
    mode: 'list' | 'edit' | 'create';
    hotel: HotelItem | null;
  }>({ mode: 'list', hotel: null });

  const itemsPerPage = 10;

  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      const matchesSearch =
        !searchQuery.trim() ||
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        String(hotel.id).includes(searchQuery.trim()) ||
        hotel.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase().trim()));

      const matchesCity = selectedCity === 'همه' || hotel.city === selectedCity;
      const matchesType = selectedType === 'همه' || hotel.type === selectedType;

      return matchesSearch && matchesCity && matchesType;
    });
  }, [hotels, searchQuery, selectedCity, selectedType]);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; hotel: HotelItem | null }>({
    isOpen: false,
    hotel: null,
  });

  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const currentHotels = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return filteredHotels.slice(start, start + itemsPerPage);
  }, [filteredHotels, safeCurrentPage]);

  const handleOpenEditHotel = (hotel: HotelItem) => {
    setEditorState({ mode: 'edit', hotel });
  };

  const handleOpenCreateHotel = () => {
    const maxId = hotels.reduce((max, h) => (h.id > max ? h.id : max), 66);
    setEditorState({ mode: 'create', hotel: createEmptyHotel(maxId + 1) });
  };

  const handleSaveHotel = (savedHotel: HotelItem) => {
    if (editorState.mode === 'create') {
      setHotels(prev => [savedHotel, ...prev]);
      onShowToast(`هتل «${savedHotel.name}» با موفقیت ثبت شد.`, 'success');
    } else {
      setHotels(prev => prev.map(h => (h.id === savedHotel.id ? savedHotel : h)));
      onShowToast(`تغییرات هتل «${savedHotel.name}» با موفقیت ذخیره شد.`, 'success');
    }
    setEditorState({ mode: 'list', hotel: null });
  };

  const handleOpenDeleteModal = (hotel: HotelItem) => {
    setDeleteModal({ isOpen: true, hotel });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.hotel) {
      const hotelName = deleteModal.hotel.name;
      setHotels(prev => prev.filter(h => h.id !== deleteModal.hotel!.id));
      onShowToast(`هتل "${hotelName}" با موفقیت حذف شد.`, 'success');
      setDeleteModal({ isOpen: false, hotel: null });
    }
  };

  const handleSnappSync = (name: string) => {
    onShowToast(`اتاق‌ها و اطلاعات هتل "${name}" از اسنپ‌تریپ با موفقیت به‌روزرسانی شد.`, 'success');
  };

  // نمایش فرم ویرایش / افزودن هتل
  if (editorState.mode !== 'list' && editorState.hotel) {
    return (
      <HotelEditor
        initialHotel={editorState.hotel}
        isCreating={editorState.mode === 'create'}
        availableTags={availableTags}
        availableHotelFacilities={availableHotelFacilities}
        availableRoomFacilities={availableRoomFacilities}
        availableLogos={availableLogos}
        availableRoomServices={availableRoomServices}
        onAddTagOption={title =>
          setAvailableTags(prev => (prev.includes(title) ? prev : [title, ...prev]))
        }
        onAddHotelFacilityOption={opt =>
          setAvailableHotelFacilities(prev => [opt, ...prev])
        }
        onAddRoomFacilityOption={opt =>
          setAvailableRoomFacilities(prev => [opt, ...prev])
        }
        onAddLogoOption={opt => setAvailableLogos(prev => [opt, ...prev])}
        onAddRoomServiceOption={svc =>
          setAvailableRoomServices(prev => (prev.includes(svc) ? prev : [svc, ...prev]))
        }
        onSave={handleSaveHotel}
        onCancel={() => setEditorState({ mode: 'list', hotel: null })}
        onShowToast={onShowToast}
      />
    );
  }

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
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">مدیریت جامع هتل‌ها، اتاق‌ها، امکانات و سئو صفحات هتل</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateHotel}
          className="bg-[#6644F0] hover:bg-[#5533E0] text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          <span>افزودن هتل</span>
        </button>
      </div>

      {/* تب‌های ناوبری */}
      <div className="flex flex-wrap items-center gap-2 py-4 border-b border-gray-100 dark:border-gray-700">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
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
                placeholder="جستجو نام هتل، شناسه، شهر یا تگ..."
                className="w-full pr-9 pl-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0] shadow-2xs transition-all"
              />
            </div>

            {/* فیلتر شهر */}
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

            {/* فیلتر نوع اقامتگاه */}
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
            <span>
              مجموع هتل‌های یافت شده:{' '}
              <strong className="text-gray-800 dark:text-gray-200 tabular-nums">{filteredHotels.length}</strong> مورد
              <span className="hidden sm:inline text-gray-400 mr-2">· برای ویرایش روی شناسه یا نام هتل کلیک کنید</span>
            </span>
            {(selectedCity !== 'همه' || selectedType !== 'همه' || searchQuery) && (
              <button
                type="button"
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
                      <td
                        onClick={() => handleOpenEditHotel(hotel)}
                        className="p-3 font-mono tabular-nums cursor-pointer text-[#6644F0] dark:text-violet-300 font-bold hover:underline"
                        title={`ویرایش هتل ${hotel.name}`}
                      >
                        {hotel.id}
                      </td>
                      <td
                        onClick={() => handleOpenEditHotel(hotel)}
                        className="p-3 font-bold text-gray-800 dark:text-gray-100 cursor-pointer hover:text-[#6644F0] dark:hover:text-violet-300 transition-colors"
                        title={`ویرایش هتل ${hotel.name}`}
                      >
                        {hotel.name}
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-300">{hotel.city}</td>
                      <td className="p-3">
                        <span
                          className={`text-xs font-semibold ${
                            hotel.status === 'منتشر شده'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {hotel.status}
                        </span>
                      </td>
                      <td className="p-3 text-center font-medium tabular-nums">{hotel.stars} ستاره</td>
                      <td className="p-3 text-gray-600 dark:text-gray-300">{hotel.type}</td>
                      <td className="p-3 text-center">
                        {hotel.isSnapp ? (
                          <ShieldTickIcon className="w-5 h-5 mx-auto" />
                        ) : (
                          <ShieldCrossIcon className="w-5 h-5 mx-auto" />
                        )}
                      </td>
                      <td className="p-3 text-center font-mono tabular-nums">
                        {hotel.snappId && hotel.snappId !== '-' ? (
                          <span className="font-bold text-red-600 dark:text-red-500">
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
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-medium transition-colors shadow-2xs flex items-center gap-1 whitespace-nowrap"
                        >
                          <RefreshIcon className="w-3.5 h-3.5" />
                          <span>دریافت اتاق‌ها از اسنپ</span>
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap items-center gap-1.5 min-w-[160px] max-w-[240px]">
                          {hotel.tags.length > 0 ? (
                            hotel.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-950/60 border border-[#6644F0]/60 dark:border-violet-600 text-[#5533E0] dark:text-violet-300 text-[11px] font-bold whitespace-nowrap"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">—</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteModal(hotel)}
                          className="w-8 h-8 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors inline-flex items-center justify-center shadow-2xs"
                          title="حذف هتل"
                        >
                          <TrashIcon className="w-5 h-5" />
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
                currentPage={safeCurrentPage}
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

      {/* مودال تایید حذف هتل */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, hotel: null })}
        onConfirm={handleConfirmDelete}
        title="آیا از حذف این هتل مطمئن هستید؟"
        message={
          <>
            آیا از حذف هتل{' '}
            <strong className="font-bold text-gray-800 dark:text-gray-200">
              {deleteModal.hotel?.name}
            </strong>{' '}
            اطمینان دارید؟ این عمل غیرقابل بازگشت خواهد بود.
          </>
        }
      />
    </div>
  );
};

export default HotelManagement;
