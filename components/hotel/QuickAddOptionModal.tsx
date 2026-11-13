'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Car,
  Wifi,
  Coffee,
  Utensils,
  Waves,
  Dumbbell,
  Tv,
  Wind,
  Lock,
  Flame,
  Clock,
  Sparkles,
  Phone,
  Upload,
  Check,
} from 'lucide-react';

export type QuickAddMode = 'tag' | 'hotelFacility' | 'roomFacility' | 'logo' | 'roomService';

interface QuickAddOptionModalProps {
  isOpen: boolean;
  mode: QuickAddMode | null;
  onClose: () => void;
  onSubmit: (payload: { title: string; iconKey?: string; imageUrl?: string }) => void;
}

const iconPalette = [
  { key: 'Wifi', label: 'اینترنت', Icon: Wifi },
  { key: 'Car', label: 'پارکینگ', Icon: Car },
  { key: 'Coffee', label: 'صبحانه / چای', Icon: Coffee },
  { key: 'Utensils', label: 'رستوران', Icon: Utensils },
  { key: 'Waves', label: 'استخر', Icon: Waves },
  { key: 'Dumbbell', label: 'ورزش', Icon: Dumbbell },
  { key: 'Tv', label: 'تلویزیون', Icon: Tv },
  { key: 'Wind', label: 'تهویه', Icon: Wind },
  { key: 'Lock', label: 'صندوق امانات', Icon: Lock },
  { key: 'Flame', label: 'اعلام حریق', Icon: Flame },
  { key: 'Clock', label: '۲۴ ساعته', Icon: Clock },
  { key: 'Phone', label: 'تلفن', Icon: Phone },
  { key: 'Sparkles', label: 'سایر امکانات', Icon: Sparkles },
];

const modalTitles: Record<QuickAddMode, string> = {
  tag: 'اضافه کردن برچسب هتل',
  hotelFacility: 'اضافه کردن امکانات رفاهی و تفریحی',
  roomFacility: 'اضافه کردن امکانات داخل اتاق',
  logo: 'اضافه کردن لوگوی جدید هتل',
  roomService: 'اضافه کردن خدمت جدید اتاق',
};

const QuickAddOptionModal: React.FC<QuickAddOptionModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Sparkles');
  const [imageUrl, setImageUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSelectedIcon('Sparkles');
      setImageUrl('');
    }
  }, [isOpen, mode]);

  if (!isOpen || !mode) return null;

  const needsIcon = mode === 'hotelFacility' || mode === 'roomFacility';
  const needsLogo = mode === 'logo';
  const activeIconEntry = iconPalette.find(i => i.key === selectedIcon) || iconPalette[iconPalette.length - 1];
  const ActiveIconComp = activeIconEntry.Icon;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      iconKey: needsIcon ? selectedIcon : undefined,
      imageUrl: needsLogo ? imageUrl : undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
            {modalTitles[mode]}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
              عنوان:
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={
                mode === 'tag'
                  ? 'مثال: هتل نزدیک مترو فردوسی'
                  : mode === 'logo'
                  ? 'مثال: 47 - هتل اسپیناس پالاس'
                  : 'عنوان مورد نظر را وارد کنید...'
              }
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
            />
          </div>

          {needsIcon && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200">
                  آیکون:
                </label>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <span>آیکون انتخاب‌شده:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-950/50 text-[#6644F0] dark:text-violet-300 font-semibold">
                    <ActiveIconComp className="w-4 h-4" />
                    {activeIconEntry.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
                {iconPalette.map(({ key, label, Icon }) => {
                  const isSelected = selectedIcon === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedIcon(key)}
                      className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-[11px] transition-all ${
                        isSelected
                          ? 'bg-violet-50 dark:bg-violet-950/50 border-[#6644F0] text-[#6644F0] dark:text-violet-300 font-bold'
                          : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="truncate w-full text-center">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {needsLogo && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-200">
                فایل لوگو:
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center overflow-hidden shrink-0">
                  {imageUrl ? (
                    <img src={imageUrl} alt="لوگو" className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-[11px] text-gray-400">بدون لوگو</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>انتخاب تصویر لوگو</span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#6644F0] hover:bg-[#5533E0] disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>ذخیره</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddOptionModal;
