'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  ArrowRight,
  Save,
  Building2,
  Tags,
  Image as ImageIcon,
  RefreshCw,
  TrendingUp,
  HelpCircle,
  BedDouble,
  Plus,
  Trash2,
  X,
  Star,
  Clock,
  MapPin,
  Calendar,
  Upload,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  HotelItem,
  FacilityOption,
  LogoOption,
  HotelRoomItem,
  RoomPriceRangeItem,
  HotelFaqItem,
  NearbyPlaceItem,
} from './hotelTypes';
import {
  cityOptions,
  typeOptions,
  boardTypeOptions,
} from './hotelData';
import YoastSeoPanel from './YoastSeoPanel';
import QuickAddOptionModal, { QuickAddMode } from './QuickAddOptionModal';
import RoomPriceCalendarModal from './RoomPriceCalendarModal';
import DualServiceSelector from './DualServiceSelector';

interface HotelEditorProps {
  initialHotel: HotelItem;
  isCreating: boolean;
  availableTags: string[];
  availableHotelFacilities: FacilityOption[];
  availableRoomFacilities: FacilityOption[];
  availableLogos: LogoOption[];
  availableRoomServices: string[];
  onAddTagOption: (title: string) => void;
  onAddHotelFacilityOption: (opt: FacilityOption) => void;
  onAddRoomFacilityOption: (opt: FacilityOption) => void;
  onAddLogoOption: (opt: LogoOption) => void;
  onAddRoomServiceOption: (service: string) => void;
  onSave: (hotel: HotelItem) => void;
  onCancel: () => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

type EditorSectionId =
  | 'basic'
  | 'facilities'
  | 'media'
  | 'snapp'
  | 'seo'
  | 'extras'
  | 'rooms';

const sectionTabs: { id: EditorSectionId; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'basic', label: 'اطلاعات پایه و انتشار', Icon: Building2 },
  { id: 'facilities', label: 'برچسب‌ها و امکانات', Icon: Tags },
  { id: 'media', label: 'تصاویر و توضیحات', Icon: ImageIcon },
  { id: 'snapp', label: 'اتصال اسنپ‌تریپ', Icon: RefreshCw },
  { id: 'seo', label: 'سئو (Yoast SEO)', Icon: TrendingUp },
  { id: 'extras', label: 'سوالات متداول، اماکن و کنسلی', Icon: HelpCircle },
  { id: 'rooms', label: 'اتاق‌ها و نرخ‌گذاری', Icon: BedDouble },
];

const HotelEditor: React.FC<HotelEditorProps> = ({
  initialHotel,
  isCreating,
  availableTags,
  availableHotelFacilities,
  availableRoomFacilities,
  availableLogos,
  availableRoomServices,
  onAddTagOption,
  onAddHotelFacilityOption,
  onAddRoomFacilityOption,
  onAddLogoOption,
  onAddRoomServiceOption,
  onSave,
  onCancel,
  onShowToast,
}) => {
  const [draft, setDraft] = useState<HotelItem>(() => JSON.parse(JSON.stringify(initialHotel)));
  const [activeSection, setActiveSection] = useState<EditorSectionId>('basic');

  // جستجوی داخل انتخابگرهای چندتایی
  const [tagSearch, setTagSearch] = useState('');
  const [hotelFacSearch, setHotelFacSearch] = useState('');
  const [roomFacSearch, setRoomFacSearch] = useState('');

  // مودال افزودن سریع برچسب/امکانات/لوگو/خدمت
  const [quickAddModal, setQuickAddModal] = useState<{ isOpen: boolean; mode: QuickAddMode | null }>({
    isOpen: false,
    mode: null,
  });

  // مودال تقویم و قیمت اتاق
  const [calendarRoomId, setCalendarRoomId] = useState<string | null>(null);
  const [expandedRoomIds, setExpandedRoomIds] = useState<string[]>(() =>
    initialHotel.rooms.length > 0 ? [initialHotel.rooms[0].id] : []
  );

  const mainImgInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateField = <K extends keyof HotelItem>(key: K, value: HotelItem[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const setNowTime = (field: 'checkInTime' | 'checkOutTime') => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    updateField(field, `${hh}:${mm}:00`);
  };

  const generateSlugFromName = () => {
    if (!draft.name.trim()) return;
    const base = draft.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]/g, '');
    updateField('slug', base || `hotel-${draft.id}`);
  };

  const handleImageUpload = (file: File, onResult: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onResult(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleQuickAddSubmit = (payload: { title: string; iconKey?: string; imageUrl?: string }) => {
    const mode = quickAddModal.mode;
    if (!mode) return;

    if (mode === 'tag') {
      onAddTagOption(payload.title);
      if (!draft.tags.includes(payload.title)) {
        updateField('tags', [...draft.tags, payload.title]);
      }
      onShowToast(`برچسب «${payload.title}» اضافه و انتخاب شد.`, 'success');
    } else if (mode === 'hotelFacility') {
      onAddHotelFacilityOption({
        id: `hf-${Date.now()}`,
        label: payload.title,
        iconKey: payload.iconKey,
      });
      if (!draft.hotelFacilities.includes(payload.title)) {
        updateField('hotelFacilities', [...draft.hotelFacilities, payload.title]);
      }
      onShowToast(`امکان رفاهی «${payload.title}» اضافه شد.`, 'success');
    } else if (mode === 'roomFacility') {
      onAddRoomFacilityOption({
        id: `rf-${Date.now()}`,
        label: payload.title,
        iconKey: payload.iconKey,
      });
      if (!draft.roomFacilities.includes(payload.title)) {
        updateField('roomFacilities', [...draft.roomFacilities, payload.title]);
      }
      onShowToast(`امکان اتاق «${payload.title}» اضافه شد.`, 'success');
    } else if (mode === 'logo') {
      const newLogo: LogoOption = {
        id: String(Date.now()).slice(-4),
        label: payload.title,
        imageUrl: payload.imageUrl || '/logo.png',
      };
      onAddLogoOption(newLogo);
      updateField('logoId', newLogo.id);
      onShowToast(`لوگوی «${payload.title}» اضافه شد.`, 'success');
    } else if (mode === 'roomService') {
      onAddRoomServiceOption(payload.title);
      onShowToast(`خدمت «${payload.title}» به لیست خدمات اتاق اضافه شد.`, 'success');
    }
  };

  // مدیریت انتخاب چندتایی برچسب‌ها و امکانات
  const toggleArrayItem = (field: 'tags' | 'hotelFacilities' | 'roomFacilities', item: string) => {
    const current = draft[field];
    if (current.includes(item)) {
      updateField(field, current.filter(i => i !== item));
    } else {
      updateField(field, [...current, item]);
    }
  };

  const filteredTagPool = useMemo(
    () =>
      availableTags.filter(
        t => !tagSearch.trim() || t.toLowerCase().includes(tagSearch.trim().toLowerCase())
      ),
    [availableTags, tagSearch]
  );

  const filteredHotelFacPool = useMemo(
    () =>
      availableHotelFacilities.filter(
        f => !hotelFacSearch.trim() || f.label.toLowerCase().includes(hotelFacSearch.trim().toLowerCase())
      ),
    [availableHotelFacilities, hotelFacSearch]
  );

  const filteredRoomFacPool = useMemo(
    () =>
      availableRoomFacilities.filter(
        f => !roomFacSearch.trim() || f.label.toLowerCase().includes(roomFacSearch.trim().toLowerCase())
      ),
    [availableRoomFacilities, roomFacSearch]
  );

  const selectedLogoObj = availableLogos.find(l => l.id === draft.logoId);

  // تگ‌های عمومی هتل
  const handleAddPublicTag = () => {
    updateField('publicTags', [
      ...draft.publicTags,
      { id: `pt-${Date.now()}`, title: '' },
    ]);
  };

  const handleUpdatePublicTag = (id: string, title: string) => {
    updateField(
      'publicTags',
      draft.publicTags.map(t => (t.id === id ? { ...t, title } : t))
    );
  };

  const handleRemovePublicTag = (id: string) => {
    updateField(
      'publicTags',
      draft.publicTags.filter(t => t.id !== id)
    );
  };

  // سوالات متداول
  const handleAddFaq = () => {
    const nextFaq: HotelFaqItem = {
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
    };
    updateField('faqs', [...draft.faqs, nextFaq]);
  };

  const handleUpdateFaq = (id: string, key: 'question' | 'answer', value: string) => {
    updateField(
      'faqs',
      draft.faqs.map(f => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const handleRemoveFaq = (id: string) => {
    updateField(
      'faqs',
      draft.faqs.filter(f => f.id !== id)
    );
  };

  // اماکن نزدیک
  const handleAddNearby = () => {
    const nextPlace: NearbyPlaceItem = {
      id: `np-${Date.now()}`,
      title: '',
      distanceMeters: 0,
      driveMinutes: 0,
      walkMinutes: 0,
      lat: '',
      lng: '',
    };
    updateField('nearbyPlaces', [...draft.nearbyPlaces, nextPlace]);
  };

  const handleUpdateNearby = <K extends keyof NearbyPlaceItem>(
    id: string,
    key: K,
    value: NearbyPlaceItem[K]
  ) => {
    updateField(
      'nearbyPlaces',
      draft.nearbyPlaces.map(p => (p.id === id ? { ...p, [key]: value } : p))
    );
  };

  const handleRemoveNearby = (id: string) => {
    updateField(
      'nearbyPlaces',
      draft.nearbyPlaces.filter(p => p.id !== id)
    );
  };

  // درصد جریمه کنسلی
  const handleAddPenalty = () => {
    updateField('cancellationPenalties', [
      ...draft.cancellationPenalties,
      { id: `cp-${Date.now()}`, percent: 0, title: '' },
    ]);
  };

  const handleUpdatePenalty = (id: string, key: 'percent' | 'title', value: string | number) => {
    updateField(
      'cancellationPenalties',
      draft.cancellationPenalties.map(p => (p.id === id ? { ...p, [key]: value } : p))
    );
  };

  const handleRemovePenalty = (id: string) => {
    updateField(
      'cancellationPenalties',
      draft.cancellationPenalties.filter(p => p.id !== id)
    );
  };

  // اتاق‌ها
  const handleAddRoom = () => {
    const newRoom: HotelRoomItem = {
      id: `room-${Date.now()}`,
      name: 'اتاق جدید',
      boardType: 'با صبحانه',
      capacity: 2,
      extraCapacity: 0,
      currentStock: 10,
      capacityNeedsAdmin: 0,
      capacityNoAdmin: 10,
      loyaltyPoints: 30,
      selectedServices: [],
      description: '',
      rules: '',
      snappRoomId: '',
      isSnappRoom: false,
      priceRanges: [],
    };
    updateField('rooms', [...draft.rooms, newRoom]);
    setExpandedRoomIds(prev => [...prev, newRoom.id]);
  };

  const handleUpdateRoom = <K extends keyof HotelRoomItem>(
    roomId: string,
    key: K,
    value: HotelRoomItem[K]
  ) => {
    updateField(
      'rooms',
      draft.rooms.map(r => (r.id === roomId ? { ...r, [key]: value } : r))
    );
  };

  const handleRemoveRoom = (roomId: string) => {
    updateField(
      'rooms',
      draft.rooms.filter(r => r.id !== roomId)
    );
  };

  const toggleExpandRoom = (roomId: string) => {
    setExpandedRoomIds(prev =>
      prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
    );
  };

  const handleSaveRoomRanges = (roomId: string, updatedRanges: RoomPriceRangeItem[]) => {
    handleUpdateRoom(roomId, 'priceRanges', updatedRanges);
    onShowToast('بازه‌های زمانی و قیمت‌های اتاق با موفقیت به‌روزرسانی شد.', 'success');
  };

  const handleSubmitHotel = () => {
    if (!draft.name.trim()) {
      setActiveSection('basic');
      onShowToast('لطفاً نام هتل را وارد کنید.', 'error');
      return;
    }
    onSave(draft);
  };

  const activeCalendarRoom = draft.rooms.find(r => r.id === calendarRoomId) || null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col flex-1 overflow-hidden">
      {/* نوار هدر بالای فرم ویرایش/افزودن هتل */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            type="button"
            onClick={onCancel}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shrink-0"
            title="بازگشت به لیست هتل‌ها"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <span>مدیریت هتل و اتاق‌ها</span>
              <span>/</span>
              <span>{isCreating ? 'افزودن هتل جدید' : `ویرایش هتل #${draft.id}`}</span>
            </div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate mt-0.5">
              {isCreating ? 'ثبت هتل جدید در سیستم' : draft.name || 'ویرایش اطلاعات هتل'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
          >
            بازگشت به لیست
          </button>
          <button
            type="button"
            onClick={handleSubmitHotel}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#6644F0] hover:bg-[#5533E0] transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Save className="w-4 h-4" />
            <span>{isCreating ? 'ذخیره و ثبت هتل' : 'ذخیره تغییرات هتل'}</span>
          </button>
        </div>
      </div>

      {/* تب‌های بخش‌بندی فرم */}
      <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/80 flex flex-wrap items-center gap-2">
        {sectionTabs.map(({ id, label, Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-[#6644F0] text-white shadow-sm'
                  : 'bg-white dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-[#6644F0]/50 hover:text-[#6644F0] dark:hover:text-violet-300'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {id === 'rooms' && (
                <span className={`text-[11px] tabular-nums ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                  ({draft.rooms.length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* محتوای هر بخش */}
      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        {/* ======================== بخش ۱: اطلاعات پایه و انتشار ======================== */}
        {activeSection === 'basic' && (
          <div className="space-y-6">
            {/* وضعیت انتشار و نمایش در صفحه اصلی */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">وضعیت انتشار هتل</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      draft.status === 'منتشر شده'
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hotelStatus"
                      checked={draft.status === 'منتشر شده'}
                      onChange={() => updateField('status', 'منتشر شده')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="block text-xs font-bold text-gray-800 dark:text-gray-100">
                        منتشر شده
                      </span>
                      <span className="block text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        هتل در لیست‌ها و نتایج جستجو نمایش داده می‌شود
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      draft.status === 'پیش‌نویس'
                        ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hotelStatus"
                      checked={draft.status === 'پیش‌نویس'}
                      onChange={() => updateField('status', 'پیش‌نویس')}
                      className="mt-0.5 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="block text-xs font-bold text-gray-800 dark:text-gray-100">
                        پیش‌نویس
                      </span>
                      <span className="block text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        هتل نمایش داده نمی‌شود تا تکمیل گردد
                      </span>
                    </div>
                  </label>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  اگر هنوز تمام اطلاعات و عکس‌های هتل آماده نیست، وضعیت را روی «پیش‌نویس» بگذارید.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  جایگاه‌های ویژه در صفحه اصلی
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'isSpecialOffer' as const, label: 'پیشنهاد ویژه صفحه اصلی' },
                    { key: 'isAmazingOffer' as const, label: 'شگفت‌انگیز صفحه اصلی' },
                    { key: 'isBestSeller' as const, label: 'پرفروش‌ترین‌های صفحه اصلی' },
                  ].map(flag => (
                    <label
                      key={flag.key}
                      className={`flex items-center gap-2.5 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        draft[flag.key]
                          ? 'border-[#6644F0] bg-violet-50/60 dark:bg-violet-950/30 text-[#6644F0] dark:text-violet-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={draft[flag.key]}
                        onChange={e => updateField(flag.key, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#6644F0] focus:ring-[#6644F0]"
                      />
                      <span className="text-xs font-semibold">{flag.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  تعیین می‌کند این هتل در کدام بخش‌های صفحه اول وب‌سایت نمایش داده شود.
                </p>
              </div>
            </div>

            {/* اطلاعات پایه هتل */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-5">
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 pb-3 border-b border-gray-100 dark:border-gray-700">
                اطلاعات پایه و مشخصات هتل
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                    نام هتل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={e => updateField('name', e.target.value)}
                    placeholder="مثال: آپارتمان مهرگان"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-200">
                      اسلاگ (Slug):
                    </label>
                    <button
                      type="button"
                      onClick={generateSlugFromName}
                      className="text-[11px] font-semibold text-[#6644F0] hover:underline"
                    >
                      ساخت از نام
                    </button>
                  </div>
                  <input
                    type="text"
                    dir="ltr"
                    value={draft.slug}
                    onChange={e => updateField('slug', e.target.value)}
                    placeholder="mehregan"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                    شهر:
                  </label>
                  <select
                    value={draft.city}
                    onChange={e => updateField('city', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                  >
                    {cityOptions
                      .filter(c => c.value !== 'همه')
                      .map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                    نوع اقامتگاه:
                  </label>
                  <select
                    value={draft.type}
                    onChange={e => updateField('type', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                  >
                    {typeOptions
                      .filter(t => t.value !== 'همه')
                      .map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                    تعداد ستاره:
                  </label>
                  <div className="flex items-center justify-between px-3.5 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => updateField('stars', st)}
                          className="p-0.5 transition-transform hover:scale-110"
                          title={`${st} ستاره`}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              st <= draft.stars
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold tabular-nums text-gray-700 dark:text-gray-200">
                      {draft.stars} ستاره
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                    امتیاز هتل (از ۵):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={5}
                    dir="ltr"
                    value={draft.rating}
                    onChange={e => updateField('rating', Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                    تعداد رزرو هتل:
                  </label>
                  <input
                    type="number"
                    min={0}
                    dir="ltr"
                    value={draft.bookingsCount}
                    onChange={e => updateField('bookingsCount', Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                  />
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                    این مقدار فقط در نمایش هتل در قسمت هتل‌های پرفروش تاثیر دارد.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                    تعداد طبقات هتل:
                  </label>
                  <input
                    type="number"
                    min={1}
                    dir="ltr"
                    value={draft.floorsCount}
                    onChange={e => updateField('floorsCount', Number(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                    تعداد اتاق‌های هتل:
                  </label>
                  <input
                    type="number"
                    min={1}
                    dir="ltr"
                    value={draft.roomsCount}
                    onChange={e => updateField('roomsCount', Number(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                  />
                </div>
              </div>

              {/* لوگوی هتل + پیش‌نمایش لوگو */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-200">
                      لوگوی هتل:
                    </label>
                    <button
                      type="button"
                      onClick={() => setQuickAddModal({ isOpen: true, mode: 'logo' })}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن لوگوی جدید</span>
                    </button>
                  </div>
                  <select
                    value={draft.logoId}
                    onChange={e => updateField('logoId', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                  >
                    <option value="">انتخاب کنید...</option>
                    {availableLogos.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    لوگو انتخاب‌شده:
                  </span>
                  <div className="w-16 h-16 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40 flex items-center justify-center overflow-hidden">
                    {selectedLogoObj?.imageUrl ? (
                      <img
                        src={selectedLogoObj.imageUrl}
                        alt={selectedLogoObj.label}
                        className="w-full h-full object-contain p-1.5"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                    )}
                  </div>
                  {selectedLogoObj && (
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      {selectedLogoObj.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* موقعیت جغرافیایی و ساعت ورود و خروج */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                  <MapPin className="w-4 h-4 text-[#6644F0]" />
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    موقعیت جغرافیایی (نقشه)
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                      عرض جغرافیایی (Latitude):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={draft.latitude}
                      onChange={e => updateField('latitude', e.target.value)}
                      placeholder="35.711825"
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                      طول جغرافیایی (Longitude):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={draft.longitude}
                      onChange={e => updateField('longitude', e.target.value)}
                      placeholder="51.417210"
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                  <Clock className="w-4 h-4 text-[#6644F0]" />
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    ساعت ورود و خروج و نیم‌شارژ
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        ساعت ورود به هتل:
                      </label>
                      <button
                        type="button"
                        onClick={() => setNowTime('checkInTime')}
                        className="text-[11px] font-semibold text-[#6644F0] hover:underline"
                      >
                        اکنون
                      </button>
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={draft.checkInTime}
                      onChange={e => updateField('checkInTime', e.target.value)}
                      placeholder="14:00:00"
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        ساعت خروج از هتل:
                      </label>
                      <button
                        type="button"
                        onClick={() => setNowTime('checkOutTime')}
                        className="text-[11px] font-semibold text-[#6644F0] hover:underline"
                      >
                        اکنون
                      </button>
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={draft.checkOutTime}
                      onChange={e => updateField('checkOutTime', e.target.value)}
                      placeholder="12:00:00"
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.halfChargeCheckIn}
                      onChange={e => updateField('halfChargeCheckIn', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#6644F0] focus:ring-[#6644F0]"
                    />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      نیم شارژ ورود
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.halfChargeCheckOut}
                      onChange={e => updateField('halfChargeCheckOut', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#6644F0] focus:ring-[#6644F0]"
                    />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      نیم شارژ خروج
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================== بخش ۲: برچسب‌ها و امکانات ======================== */}
        {activeSection === 'facilities' && (
          <div className="space-y-6">
            {/* برچسب‌های هتل */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    برچسب‌های هتل ({draft.tags.length} مورد انتخاب‌شده)
                  </h2>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    روی هر برچسب کلیک کنید تا انتخاب یا حذف شود؛ یا برچسب جدید اضافه کنید.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickAddModal({ isOpen: true, mode: 'tag' })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>اضافه کردن برچسب جدید</span>
                </button>
              </div>

              <div className="relative max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={tagSearch}
                  onChange={e => setTagSearch(e.target.value)}
                  placeholder="فیلتر برچسب‌ها..."
                  className="w-full pr-9 pl-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filteredTagPool.map(tag => {
                  const selected = draft.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleArrayItem('tags', tag)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        selected
                          ? 'bg-violet-50 dark:bg-violet-950/60 border-[#6644F0] text-[#6644F0] dark:text-violet-300 font-bold'
                          : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      {selected ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 opacity-60" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* امکانات رفاهی و تفریحی هتل */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    امکانات رفاهی و تفریحی هتل ({draft.hotelFacilities.length} مورد انتخاب‌شده)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickAddModal({ isOpen: true, mode: 'hotelFacility' })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>اضافه کردن امکانات رفاهی و تفریحی</span>
                </button>
              </div>

              <div className="relative max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={hotelFacSearch}
                  onChange={e => setHotelFacSearch(e.target.value)}
                  placeholder="جستجو در امکانات رفاهی هتل..."
                  className="w-full pr-9 pl-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-1">
                {filteredHotelFacPool.map(fac => {
                  const selected = draft.hotelFacilities.includes(fac.label);
                  return (
                    <button
                      key={fac.id}
                      type="button"
                      onClick={() => toggleArrayItem('hotelFacilities', fac.label)}
                      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs text-right transition-all ${
                        selected
                          ? 'bg-violet-50 dark:bg-violet-950/50 border-[#6644F0] text-[#6644F0] dark:text-violet-300 font-bold'
                          : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="truncate">{fac.label}</span>
                      {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* امکانات داخل اتاق */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    امکانات داخل اتاق ({draft.roomFacilities.length} مورد انتخاب‌شده)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickAddModal({ isOpen: true, mode: 'roomFacility' })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>اضافه کردن امکانات داخل اتاق</span>
                </button>
              </div>

              <div className="relative max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={roomFacSearch}
                  onChange={e => setRoomFacSearch(e.target.value)}
                  placeholder="جستجو در امکانات داخل اتاق..."
                  className="w-full pr-9 pl-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-1">
                {filteredRoomFacPool.map(fac => {
                  const selected = draft.roomFacilities.includes(fac.label);
                  return (
                    <button
                      key={fac.id}
                      type="button"
                      onClick={() => toggleArrayItem('roomFacilities', fac.label)}
                      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs text-right transition-all ${
                        selected
                          ? 'bg-violet-50 dark:bg-violet-950/50 border-[#6644F0] text-[#6644F0] dark:text-violet-300 font-bold'
                          : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="truncate">{fac.label}</span>
                      {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* تگ‌های عمومی هتل */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    تگ‌های عمومی هتل
                  </h2>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    تگ‌های اختصاصی نمایش‌داده‌شده در صفحه هتل و لیست‌ها
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPublicTag}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-[#6644F0] dark:text-violet-300 text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن تگ عمومی</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {draft.publicTags.length > 0 ? (
                  draft.publicTags.map(pt => (
                    <div key={pt.id} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={pt.title}
                        onChange={e => handleUpdatePublicTag(pt.id, e.target.value)}
                        placeholder="عنوان تگ عمومی..."
                        className="flex-1 px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePublicTag(pt.id)}
                        className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                        title="حذف تگ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 py-3 text-center">
                    هنوز تگ عمومی برای این هتل تعریف نشده است.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================== بخش ۳: تصاویر و توضیحات ======================== */}
        {activeSection === 'media' && (
          <div className="space-y-6">
            {/* تصاویر هتل */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-5">
              <div className="pb-3 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  تصویر اصلی و گالری تصاویر هتل
                </h2>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                  تصویر اصلی به‌عنوان کاور کارت هتل نمایش داده می‌شود و تصاویر ۱ تا ۴ در گالری صفحه هتل قرار می‌گیرند.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* تصویر اصلی */}
                <div className="p-3.5 rounded-xl border border-[#6644F0]/40 bg-violet-50/30 dark:bg-violet-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6644F0] dark:text-violet-300">
                      تصویر اصلی
                    </span>
                    {draft.mainImage && (
                      <button
                        type="button"
                        onClick={() => updateField('mainImage', '')}
                        className="text-red-500 hover:text-red-600"
                        title="حذف تصویر"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="aspect-[4/3] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    {draft.mainImage ? (
                      <img
                        src={draft.mainImage}
                        alt="تصویر اصلی هتل"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-400">
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-[11px]">بدون تصویر</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => mainImgInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-lg bg-[#6644F0] hover:bg-[#5533E0] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>انتخاب فایل</span>
                  </button>
                  <input
                    ref={mainImgInputRef}
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, url => updateField('mainImage', url));
                    }}
                    className="hidden"
                  />
                </div>

                {/* تصاویر ۱ تا ۴ */}
                {[0, 1, 2, 3].map(idx => {
                  const imgVal = draft.galleryImages[idx] || '';
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200 tabular-nums">
                          تصویر {idx + 1}
                        </span>
                        {imgVal && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...draft.galleryImages];
                              next[idx] = '';
                              updateField('galleryImages', next);
                            }}
                            className="text-red-500 hover:text-red-600"
                            title="حذف تصویر"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="aspect-[4/3] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                        {imgVal ? (
                          <img
                            src={imgVal}
                            alt={`تصویر ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-gray-400">
                            <ImageIcon className="w-6 h-6" />
                            <span className="text-[11px]">بدون تصویر</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => galleryInputRefs.current[idx]?.click()}
                        className="w-full py-2 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-[#6644F0] hover:text-[#6644F0] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>انتخاب فایل</span>
                      </button>
                      <input
                        ref={el => {
                          galleryInputRefs.current[idx] = el;
                        }}
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file, url => {
                              const next = [...draft.galleryImages];
                              next[idx] = url;
                              updateField('galleryImages', next);
                            });
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* آدرس، توضیحات و قوانین */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-5">
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 pb-3 border-b border-gray-100 dark:border-gray-700">
                آدرس، توضیحات و قوانین هتل
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                    آدرس کامل هتل:
                  </label>
                  <textarea
                    rows={2}
                    value={draft.address}
                    onChange={e => updateField('address', e.target.value)}
                    placeholder="تهران، میدان فردوسی، خیابان سپهبد قرنی، نبش بن‌بست دوم"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                      توضیحات هتل:
                    </label>
                    <textarea
                      rows={5}
                      value={draft.description}
                      onChange={e => updateField('description', e.target.value)}
                      placeholder="معرفی کامل هتل، سال تاسیس، تعداد طبقات و واحدها..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs leading-relaxed text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                      توضیحات تکمیلی (موقعیت و دسترسی‌ها):
                    </label>
                    <textarea
                      rows={5}
                      value={draft.extraDescription}
                      onChange={e => updateField('extraDescription', e.target.value)}
                      placeholder="توضیحات تکمیلی درباره فاصله تا مراکز مهم و ایستگاه‌های حمل‌ونقل..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs leading-relaxed text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                      قوانین و مقررات هتل:
                    </label>
                    <textarea
                      rows={4}
                      value={draft.rules}
                      onChange={e => updateField('rules', e.target.value)}
                      placeholder="شرایط پذیرش، قوانین کودکان، مدارک مورد نیاز..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs leading-relaxed text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                      نکات ضروری هتل:
                    </label>
                    <textarea
                      rows={4}
                      value={draft.essentialNotes}
                      onChange={e => updateField('essentialNotes', e.target.value)}
                      placeholder="محدودیت‌های طرح ترافیک، وضعیت پارکینگ و نکات مهم پیش از رزرو..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs leading-relaxed text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================== بخش ۴: اتصال به اسنپ‌تریپ ======================== */}
        {activeSection === 'snapp' && (
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-5 max-w-3xl">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  اتصال به اسنپ‌تریپ (B2B SnappTrip)
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  شناسه هتل در اسنپ‌تریپ را وارد کرده و تیک همگام‌سازی خودکار نرخ و موجودی را فعال کنید.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                  شناسه هتل در اسنپ‌تریپ:
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={draft.snappId === '-' ? '' : draft.snappId}
                  onChange={e => updateField('snappId', e.target.value)}
                  placeholder="مثال: 31 یا 48"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  onShowToast(
                    `درخواست همگام‌سازی هتل «${draft.name || 'جدید'}» با اسنپ‌تریپ انجام شد.`,
                    'success'
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>دریافت و همگام‌سازی فوری اتاق‌ها</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                <input
                  type="checkbox"
                  checked={draft.syncFromSnapp}
                  onChange={e => updateField('syncFromSnapp', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#6644F0] focus:ring-[#6644F0]"
                />
                <div>
                  <span className="block text-xs font-bold text-gray-800 dark:text-gray-100">
                    همگام‌سازی از اسنپ‌تریپ
                  </span>
                  <span className="block text-[11px] text-gray-400 mt-0.5">
                    به‌روزرسانی خودکار موجودی و قیمت اتاق‌ها
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                <input
                  type="checkbox"
                  checked={draft.isSnapp}
                  onChange={e => updateField('isSnapp', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#6644F0] focus:ring-[#6644F0]"
                />
                <div>
                  <span className="block text-xs font-bold text-gray-800 dark:text-gray-100">
                    هتل اسنپ‌تریپ است؟
                  </span>
                  <span className="block text-[11px] text-gray-400 mt-0.5">
                    اتصال وب‌سرویس رزرواسیون اسنپ فعال باشد
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* ======================== بخش ۵: سئو و متاتگ‌ها (Yoast SEO) ======================== */}
        {activeSection === 'seo' && (
          <YoastSeoPanel
            hotel={draft}
            onChangeSeo={nextSeo => updateField('seo', nextSeo)}
          />
        )}

        {/* ======================== بخش ۶: سوالات متداول، اماکن نزدیک و جریمه کنسلی ======================== */}
        {activeSection === 'extras' && (
          <div className="space-y-6">
            {/* سوالات متداول هتل */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    سوالات متداول هتل ({draft.faqs.length})
                  </h2>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    این سوالات در بخش FAQ صفحه هتل و اسکیمای FAQPage گوگل نمایش داده می‌شوند.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن یک سوال متداول دیگر</span>
                </button>
              </div>

              <div className="space-y-4">
                {draft.faqs.length > 0 ? (
                  draft.faqs.map((faq, index) => (
                    <div
                      key={faq.id}
                      className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200 tabular-nums">
                          سوال متداول #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(faq.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                          سوال:
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={e => handleUpdateFaq(faq.id, 'question', e.target.value)}
                          placeholder="مثال: آدرس هتل آپارتمان مهرگان تهران کجاست؟"
                          className="w-full px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                          جواب:
                        </label>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={e => handleUpdateFaq(faq.id, 'answer', e.target.value)}
                          placeholder="پاسخ کامل و دقیق..."
                          className="w-full px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    هنوز سوال متداولی ثبت نشده است.
                  </p>
                )}
              </div>
            </div>

            {/* اماکن مهم و دیدنی اطراف هتل */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    اماکن مهم و دیدنی اطراف هتل ({draft.nearbyPlaces.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddNearby}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن یک مکان نزدیک دیگر</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                <table className="w-full text-right border-collapse min-w-[780px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 text-[11px] font-bold border-b border-gray-200 dark:border-gray-700">
                      <th className="p-3">عنوان مکان</th>
                      <th className="p-3">مسافت (متر)</th>
                      <th className="p-3">با ماشین (دقیقه)</th>
                      <th className="p-3">پیاده‌روی (دقیقه)</th>
                      <th className="p-3">عرض جغرافیایی</th>
                      <th className="p-3">طول جغرافیایی</th>
                      <th className="p-3">عکس</th>
                      <th className="p-3 text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-xs">
                    {draft.nearbyPlaces.length > 0 ? (
                      draft.nearbyPlaces.map(place => (
                        <tr key={place.id}>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={place.title}
                              onChange={e => handleUpdateNearby(place.id, 'title', e.target.value)}
                              placeholder="مثال: خانه هنرمندان"
                              className="w-full px-2.5 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              dir="ltr"
                              value={place.distanceMeters}
                              onChange={e =>
                                handleUpdateNearby(place.id, 'distanceMeters', Number(e.target.value) || 0)
                              }
                              className="w-24 px-2.5 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              dir="ltr"
                              value={place.driveMinutes}
                              onChange={e =>
                                handleUpdateNearby(place.id, 'driveMinutes', Number(e.target.value) || 0)
                              }
                              className="w-20 px-2.5 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              dir="ltr"
                              value={place.walkMinutes}
                              onChange={e =>
                                handleUpdateNearby(place.id, 'walkMinutes', Number(e.target.value) || 0)
                              }
                              className="w-20 px-2.5 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              dir="ltr"
                              value={place.lat}
                              onChange={e => handleUpdateNearby(place.id, 'lat', e.target.value)}
                              placeholder="35.7105"
                              className="w-28 px-2.5 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              dir="ltr"
                              value={place.lng}
                              onChange={e => handleUpdateNearby(place.id, 'lng', e.target.value)}
                              placeholder="51.4198"
                              className="w-28 px-2.5 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                            />
                          </td>
                          <td className="p-2.5">
                            <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-[11px] font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{place.image ? 'تغییر' : 'آپلود'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                  const f = e.target.files?.[0];
                                  if (f) handleImageUpload(f, url => handleUpdateNearby(place.id, 'image', url));
                                }}
                              />
                            </label>
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveNearby(place.id)}
                              className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-xs text-gray-400">
                          هیچ مکان دیدنی نزدیک هتل ثبت نشده است.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* درصد جریمه کنسلی */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    درصد جریمه کنسلی
                  </h2>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    درصد جریمه کنسلی رزرو را برای بازه‌های مختلف تعریف کنید.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPenalty}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-[#6644F0] dark:text-violet-300 text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن ردیف جریمه</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {draft.cancellationPenalties.length > 0 ? (
                  draft.cancellationPenalties.map((cp, idx) => (
                    <div key={cp.id} className="grid grid-cols-1 sm:grid-cols-[1fr_160px_auto] gap-3 items-center">
                      <input
                        type="text"
                        value={cp.title || ''}
                        onChange={e => handleUpdatePenalty(cp.id, 'title', e.target.value)}
                        placeholder={`توضیح بازه کنسلی #${idx + 1} (مثال: کمتر از ۲۴ ساعت تا ورود)`}
                        className="px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                      />
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          dir="ltr"
                          value={cp.percent}
                          onChange={e =>
                            handleUpdatePenalty(cp.id, 'percent', Number(e.target.value) || 0)
                          }
                          className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          %
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePenalty(cp.id)}
                        className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors justify-self-end"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 py-3 text-center">
                    هنوز قانون جریمه کنسلی ثبت نشده است.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================== بخش ۷: اتاق‌های این هتل و نرخ‌گذاری ======================== */}
        {activeSection === 'rooms' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  اتاق‌های این هتل ({draft.rooms.length} اتاق)
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  مشخصات ظرفیت، خدمات اتاق، شناسه اسنپ و تقویم نرخ‌گذاری هر اتاق را مدیریت کنید.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddRoom}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6644F0] hover:bg-[#5533E0] text-white text-xs font-bold transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن اتاق جدید</span>
              </button>
            </div>

            {draft.rooms.length > 0 ? (
              <div className="space-y-4">
                {draft.rooms.map((room, rIndex) => {
                  const isExpanded = expandedRoomIds.includes(room.id);
                  return (
                    <div
                      key={room.id}
                      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
                    >
                      {/* هدر آکاردئون اتاق */}
                      <div className="px-5 py-4 bg-gray-50/80 dark:bg-gray-700/40 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700">
                        <button
                          type="button"
                          onClick={() => toggleExpandRoom(room.id)}
                          className="flex items-center gap-3 text-right flex-1 min-w-0"
                        >
                          <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-[#6644F0] dark:text-violet-300 flex items-center justify-center shrink-0">
                            <BedDouble className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                              اتاق {rIndex + 1}: {room.name || 'اتاق بدون نام'}
                            </h3>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 tabular-nums">
                              ظرفیت {room.capacity} نفر · {room.boardType} · موجودی فعلی: {room.currentStock} ·{' '}
                              {room.priceRanges.length} بازه نرخی ثبت‌شده
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setCalendarRoomId(room.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>تقویم و قیمت‌ها</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveRoom(room.id)}
                            className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                            title="حذف این اتاق"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* بدنه ویرایش اتاق */}
                      {isExpanded && (
                        <div className="p-5 space-y-6">
                          {/* مشخصات اصلی و ظرفیت اتاق */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-[#6644F0] dark:text-violet-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>مشخصات اصلی و ظرفیت اتاق</span>
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                                  نام اتاق:
                                </label>
                                <input
                                  type="text"
                                  value={room.name}
                                  onChange={e => handleUpdateRoom(room.id, 'name', e.target.value)}
                                  placeholder="مثال: سوئیت دو تخته دابل"
                                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                                  نوع پذیرایی (Board Type):
                                </label>
                                <select
                                  value={room.boardType}
                                  onChange={e => handleUpdateRoom(room.id, 'boardType', e.target.value)}
                                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                                >
                                  {boardTypeOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                                  امتیاز باشگاه مشتریان:
                                </label>
                                <input
                                  type="number"
                                  dir="ltr"
                                  value={room.loyaltyPoints}
                                  onChange={e =>
                                    handleUpdateRoom(
                                      room.id,
                                      'loyaltyPoints',
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                                  ظرفیت اتاق:
                                </label>
                                <input
                                  type="number"
                                  dir="ltr"
                                  value={room.capacity}
                                  onChange={e =>
                                    handleUpdateRoom(room.id, 'capacity', Number(e.target.value) || 1)
                                  }
                                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                                  ظرفیت نفر اضافه:
                                </label>
                                <input
                                  type="number"
                                  dir="ltr"
                                  value={room.extraCapacity}
                                  onChange={e =>
                                    handleUpdateRoom(
                                      room.id,
                                      'extraCapacity',
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                                  موجودی فعلی:
                                </label>
                                <input
                                  type="number"
                                  dir="ltr"
                                  value={room.currentStock}
                                  onChange={e =>
                                    handleUpdateRoom(
                                      room.id,
                                      'currentStock',
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                                  ظرفیت نیازمند تایید ادمین:
                                </label>
                                <input
                                  type="number"
                                  dir="ltr"
                                  value={room.capacityNeedsAdmin}
                                  onChange={e =>
                                    handleUpdateRoom(
                                      room.id,
                                      'capacityNeedsAdmin',
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                                  ظرفیت رزرو بدون تایید ادمین:
                                </label>
                                <input
                                  type="number"
                                  dir="ltr"
                                  value={room.capacityNoAdmin}
                                  onChange={e =>
                                    handleUpdateRoom(
                                      room.id,
                                      'capacityNoAdmin',
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* خدمات اتاق (Dual-list selector) */}
                          <DualServiceSelector
                            availableServices={availableRoomServices}
                            selectedServices={room.selectedServices}
                            onChange={nextServices =>
                              handleUpdateRoom(room.id, 'selectedServices', nextServices)
                            }
                            onRequestAddService={() =>
                              setQuickAddModal({ isOpen: true, mode: 'roomService' })
                            }
                          />

                          {/* توضیحات و قوانین اتاق */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                                توضیحات اتاق:
                              </label>
                              <textarea
                                rows={3}
                                value={room.description}
                                onChange={e =>
                                  handleUpdateRoom(room.id, 'description', e.target.value)
                                }
                                placeholder="امکانات، متراژ، نوع تخت و نمای اتاق..."
                                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                                قوانین و مقررات اتاق:
                              </label>
                              <textarea
                                rows={3}
                                value={room.rules}
                                onChange={e => handleUpdateRoom(room.id, 'rules', e.target.value)}
                                placeholder="قوانین اختصاصی این نوع اتاق..."
                                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                              />
                            </div>
                          </div>

                          {/* اسنپ‌تریپ اتاق و دکمه تقویم نرخ‌گذاری */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="w-40">
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                                  شناسه اتاق در اسنپ‌تریپ:
                                </label>
                                <input
                                  type="text"
                                  dir="ltr"
                                  value={room.snappRoomId}
                                  onChange={e =>
                                    handleUpdateRoom(room.id, 'snappRoomId', e.target.value)
                                  }
                                  placeholder="87"
                                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono tabular-nums text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                                />
                              </div>
                              <label className="flex items-center gap-2 pt-5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={room.isSnappRoom}
                                  onChange={e =>
                                    handleUpdateRoom(room.id, 'isSnappRoom', e.target.checked)
                                  }
                                  className="w-4 h-4 rounded border-gray-300 text-[#6644F0] focus:ring-[#6644F0]"
                                />
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                  اتاق اسنپ‌تریپ است؟
                                </span>
                              </label>
                            </div>

                            <div className="p-3.5 rounded-xl border border-dashed border-sky-300 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <span className="text-[11px] text-gray-600 dark:text-gray-300">
                                با کلیک روی این دکمه جدول بازه‌های زمانی و قیمت‌های این اتاق باز می‌شود
                              </span>
                              <button
                                type="button"
                                onClick={() => setCalendarRoomId(room.id)}
                                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                              >
                                <Calendar className="w-4 h-4" />
                                <span>باز کردن تقویم و قیمت‌های این اتاق</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center space-y-3">
                <BedDouble className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  هنوز اتاقی برای این هتل ثبت نشده است.
                </p>
                <button
                  type="button"
                  onClick={handleAddRoom}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6644F0] text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن اولین اتاق</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* فوتر ثابت پایین فرم ویرایش */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/90 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {isCreating ? 'در حال ثبت هتل جدید' : `در حال ویرایش: ${draft.name || 'هتل'}`}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSubmitHotel}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#6644F0] hover:bg-[#5533E0] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isCreating ? 'ثبت و ذخیره هتل' : 'ذخیره تغییرات هتل'}</span>
          </button>
        </div>
      </div>

      {/* مودال افزودن سریع آیتم‌ها (برچسب، امکانات هتل، امکانات اتاق، لوگو، خدمت اتاق) */}
      <QuickAddOptionModal
        isOpen={quickAddModal.isOpen}
        mode={quickAddModal.mode}
        onClose={() => setQuickAddModal({ isOpen: false, mode: null })}
        onSubmit={handleQuickAddSubmit}
      />

      {/* مودال تقویم و نرخ‌گذاری اتاق */}
      <RoomPriceCalendarModal
        isOpen={Boolean(calendarRoomId)}
        hotelName={draft.name}
        room={activeCalendarRoom}
        onClose={() => setCalendarRoomId(null)}
        onSave={handleSaveRoomRanges}
      />
    </div>
  );
};

export default HotelEditor;
