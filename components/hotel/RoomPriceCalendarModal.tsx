'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Check, Building2, BedDouble } from 'lucide-react';
import { HotelRoomItem, RoomPriceRangeItem } from './hotelTypes';
import CustomPersianDatePicker from '../CustomPersianDatePicker';

interface RoomPriceCalendarModalProps {
  isOpen: boolean;
  hotelName: string;
  room: HotelRoomItem | null;
  onClose: () => void;
  onSave: (roomId: string, updatedRanges: RoomPriceRangeItem[]) => void;
}

const userLevelOptions = ['همه سطوح', 'برنزی', 'نقره‌ای', 'طلایی'];
const discountTypeOptions: RoomPriceRangeItem['discountType'][] = [
  'بدون تخفیف',
  'درصدی',
  'مبلغ ثابت',
];

const RoomPriceCalendarModal: React.FC<RoomPriceCalendarModalProps> = ({
  isOpen,
  hotelName,
  room,
  onClose,
  onSave,
}) => {
  const [ranges, setRanges] = useState<RoomPriceRangeItem[]>([]);
  const [activePickerRowId, setActivePickerRowId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && room) {
      setRanges(room.priceRanges.map(r => ({ ...r })));
      setActivePickerRowId(null);
    }
  }, [isOpen, room]);

  if (!isOpen || !room) return null;

  const updateRow = <K extends keyof RoomPriceRangeItem>(
    id: string,
    key: K,
    value: RoomPriceRangeItem[K]
  ) => {
    setRanges(prev => prev.map(row => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const handleAddRow = () => {
    const newRow: RoomPriceRangeItem = {
      id: `pr-${Date.now()}`,
      userLevel: 'همه سطوح',
      startDate: '1405-08-20',
      endDate: '1405-08-25',
      buyPrice: 2800000,
      nightlyPrice: 3100000,
      extraPersonPrice: 0,
      discountType: 'بدون تخفیف',
      discountValue: 0,
      discountExpiry: '',
      discountOnPurchase: false,
    };
    setRanges(prev => [...prev, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    setRanges(prev => prev.filter(r => r.id !== id));
    if (activePickerRowId === id) setActivePickerRowId(null);
  };

  const handleSave = () => {
    onSave(room.id, ranges);
    onClose();
  };

  const activeRow = ranges.find(r => r.id === activePickerRowId);

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* هدر مودال */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
              تقویم و نرخ‌گذاری اتاق: {room.name || 'اتاق بدون نام'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              بازه‌های زمانی، قیمت خرید، قیمت فروش هر شب و تنظیمات تخفیف این اتاق را مدیریت کنید.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* بدنه اسکرول‌شونده */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* بنر اطلاعات اتاق */}
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                هتل: {hotelName || 'هتل جدید'}
              </span>
              <span className="text-emerald-400">|</span>
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4" />
                اتاق: {room.name || 'اتاق جدید'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              تغییرات بازه‌های زمانی پس از ذخیره روی اتاق اعمال می‌شود.
            </p>
          </div>

          {/* تقویم انتخاب بازه در صورت کلیک روی آیکون تقویم یک سطر */}
          {activeRow && (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  انتخاب تاریخ شروع و پایان از روی تقویم شمسی
                </span>
                <button
                  type="button"
                  onClick={() => setActivePickerRowId(null)}
                  className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  بستن تقویم
                </button>
              </div>
              <div className="max-w-sm">
                <CustomPersianDatePicker
                  allowPastDates={true}
                  startDate={activeRow.startDate.replace(/-/g, '/')}
                  endDate={activeRow.endDate.replace(/-/g, '/')}
                  onRangeSelect={({ start, end }) => {
                    const toDashLatin = (d: string) =>
                      d
                        .replace(/[۰-۹]/g, c => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c)))
                        .replace(/\//g, '-');
                    updateRow(activeRow.id, 'startDate', toDashLatin(start));
                    updateRow(activeRow.id, 'endDate', toDashLatin(end));
                    setActivePickerRowId(null);
                  }}
                />
              </div>
            </div>
          )}

          {/* جدول بازه‌های زمانی و قیمت‌ها */}
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
            <table className="w-full text-right border-collapse min-w-[960px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 text-[11px] font-bold border-b border-gray-200 dark:border-gray-700">
                  <th className="p-3">سطح کاربری</th>
                  <th className="p-3">تاریخ شروع بازه</th>
                  <th className="p-3">تاریخ پایان بازه</th>
                  <th className="p-3">قیمت خرید اتاق (تومان)</th>
                  <th className="p-3">قیمت هر شب (تومان)</th>
                  <th className="p-3">قیمت نفر اضافه</th>
                  <th className="p-3">نوع تخفیف</th>
                  <th className="p-3">مقدار تخفیف</th>
                  <th className="p-3">انقضای تخفیف</th>
                  <th className="p-3 text-center">تخفیف هنگام خرید</th>
                  <th className="p-3 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-xs">
                {ranges.length > 0 ? (
                  ranges.map(row => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="p-2.5">
                        <select
                          value={row.userLevel}
                          onChange={e => updateRow(row.id, 'userLevel', e.target.value)}
                          className="w-full px-2.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                        >
                          {userLevelOptions.map(lvl => (
                            <option key={lvl} value={lvl}>
                              {lvl}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            dir="ltr"
                            value={row.startDate}
                            onChange={e => updateRow(row.id, 'startDate', e.target.value)}
                            className="w-28 px-2.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono tabular-nums text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setActivePickerRowId(prev => (prev === row.id ? null : row.id))
                            }
                            title="انتخاب از تقویم شمسی"
                            className="p-2 rounded-lg text-gray-500 hover:text-[#6644F0] hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-colors"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          dir="ltr"
                          value={row.endDate}
                          onChange={e => updateRow(row.id, 'endDate', e.target.value)}
                          className="w-28 px-2.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono tabular-nums text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          dir="ltr"
                          value={row.buyPrice}
                          onChange={e => updateRow(row.id, 'buyPrice', Number(e.target.value) || 0)}
                          className="w-28 px-2.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono tabular-nums text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          dir="ltr"
                          value={row.nightlyPrice}
                          onChange={e =>
                            updateRow(row.id, 'nightlyPrice', Number(e.target.value) || 0)
                          }
                          className="w-28 px-2.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono tabular-nums text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          dir="ltr"
                          value={row.extraPersonPrice}
                          onChange={e =>
                            updateRow(row.id, 'extraPersonPrice', Number(e.target.value) || 0)
                          }
                          className="w-24 px-2.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono tabular-nums text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                        />
                      </td>
                      <td className="p-2.5">
                        <select
                          value={row.discountType}
                          onChange={e =>
                            updateRow(
                              row.id,
                              'discountType',
                              e.target.value as RoomPriceRangeItem['discountType']
                            )
                          }
                          className="w-28 px-2 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                        >
                          {discountTypeOptions.map(dt => (
                            <option key={dt} value={dt}>
                              {dt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          dir="ltr"
                          value={row.discountValue}
                          disabled={row.discountType === 'بدون تخفیف'}
                          onChange={e =>
                            updateRow(row.id, 'discountValue', Number(e.target.value) || 0)
                          }
                          className="w-20 px-2.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono tabular-nums text-gray-800 dark:text-gray-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          dir="ltr"
                          placeholder="1405-09-01"
                          value={row.discountExpiry}
                          disabled={row.discountType === 'بدون تخفیف'}
                          onChange={e => updateRow(row.id, 'discountExpiry', e.target.value)}
                          className="w-24 px-2.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono tabular-nums text-gray-800 dark:text-gray-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                        />
                      </td>
                      <td className="p-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={row.discountOnPurchase}
                          onChange={e => updateRow(row.id, 'discountOnPurchase', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-[#6644F0] focus:ring-[#6644F0]"
                        />
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                          title="حذف بازه"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-xs text-gray-400">
                      هنوز بازه زمانی و نرخی برای این اتاق ثبت نشده است.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#6644F0] text-[#6644F0] dark:text-violet-300 text-xs font-bold hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن بازه زمانی و نرخ جدید</span>
          </button>
        </div>

        {/* فوتر مودال */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#6644F0] hover:bg-[#5533E0] transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>ذخیره نرخ‌ها و بستن</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomPriceCalendarModal;
