'use client';

import React, { useMemo, useState } from 'react';
import { Search, Plus, ArrowLeft, ArrowRight, CheckCheck, Trash2 } from 'lucide-react';

interface DualServiceSelectorProps {
  availableServices: string[];
  selectedServices: string[];
  onChange: (nextSelected: string[]) => void;
  onRequestAddService: () => void;
}

const DualServiceSelector: React.FC<DualServiceSelectorProps> = ({
  availableServices,
  selectedServices,
  onChange,
  onRequestAddService,
}) => {
  const [availSearch, setAvailSearch] = useState('');
  const [selectedSearch, setSelectedSearch] = useState('');
  const [highlightedAvail, setHighlightedAvail] = useState<string[]>([]);
  const [highlightedSelected, setHighlightedSelected] = useState<string[]>([]);

  const unselectedList = useMemo(() => {
    return availableServices
      .filter(s => !selectedServices.includes(s))
      .filter(s => !availSearch.trim() || s.toLowerCase().includes(availSearch.trim().toLowerCase()));
  }, [availableServices, selectedServices, availSearch]);

  const selectedList = useMemo(() => {
    return selectedServices.filter(
      s => !selectedSearch.trim() || s.toLowerCase().includes(selectedSearch.trim().toLowerCase())
    );
  }, [selectedServices, selectedSearch]);

  const toggleHighlightAvail = (item: string) => {
    setHighlightedAvail(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleHighlightSelected = (item: string) => {
    setHighlightedSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const moveSelectedToRight = () => {
    if (highlightedAvail.length === 0) return;
    onChange([...selectedServices, ...highlightedAvail]);
    setHighlightedAvail([]);
  };

  const moveSelectedToLeft = () => {
    if (highlightedSelected.length === 0) return;
    onChange(selectedServices.filter(s => !highlightedSelected.includes(s)));
    setHighlightedSelected([]);
  };

  const selectAll = () => {
    onChange([...availableServices]);
    setHighlightedAvail([]);
  };

  const clearAll = () => {
    onChange([]);
    setHighlightedSelected([]);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 dark:text-gray-200">
          خدمات اتاق:
        </label>
        <button
          type="button"
          onClick={onRequestAddService}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن خدمت جدید</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
        {/* لیست خدمات موجود */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col bg-white dark:bg-gray-800">
          <div className="px-3.5 py-2.5 bg-gray-100 dark:bg-gray-700/70 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">خدمات موجود</span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 tabular-nums">
              {unselectedList.length} مورد
            </span>
          </div>
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={availSearch}
                onChange={e => setAvailSearch(e.target.value)}
                placeholder="جستجو در خدمات..."
                className="w-full pr-8 pl-2.5 py-1.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6644F0]"
              />
            </div>
          </div>
          <div className="flex-1 min-h-[140px] max-h-44 overflow-y-auto p-1.5 space-y-1">
            {unselectedList.length > 0 ? (
              unselectedList.map(item => {
                const isHighlighted = highlightedAvail.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleHighlightAvail(item)}
                    onDoubleClick={() => onChange([...selectedServices, item])}
                    className={`w-full text-right px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      isHighlighted
                        ? 'bg-violet-50 dark:bg-violet-950/60 text-[#6644F0] dark:text-violet-300 font-bold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                    }`}
                  >
                    {item}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-[11px] text-gray-400">موردی موجود نیست</div>
            )}
          </div>
          <button
            type="button"
            onClick={selectAll}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700/40 border-t border-gray-100 dark:border-gray-700 text-[11px] font-semibold text-gray-600 dark:text-gray-300 hover:text-[#6644F0] flex items-center justify-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>انتخاب همه</span>
          </button>
        </div>

        {/* دکمه‌های انتقال بین دو لیست */}
        <div className="flex md:flex-col items-center justify-center gap-2 py-1">
          <button
            type="button"
            onClick={moveSelectedToRight}
            disabled={highlightedAvail.length === 0}
            title="افزودن موارد انتخابی"
            className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-[#6644F0] hover:text-white hover:border-[#6644F0] disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-gray-800 disabled:hover:text-gray-700 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={moveSelectedToLeft}
            disabled={highlightedSelected.length === 0}
            title="حذف موارد انتخابی"
            className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white hover:border-red-500 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-gray-800 disabled:hover:text-gray-700 transition-colors flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* لیست خدمات انتخاب‌شده */}
        <div className="border border-[#6644F0]/30 dark:border-violet-800/60 rounded-xl overflow-hidden flex flex-col bg-white dark:bg-gray-800">
          <div className="px-3.5 py-2.5 bg-violet-50/70 dark:bg-violet-950/40 border-b border-[#6644F0]/20 dark:border-violet-800/60 flex items-center justify-between">
            <span className="text-xs font-bold text-[#6644F0] dark:text-violet-300">
              خدمات انتخاب شده
            </span>
            <span className="text-[11px] text-[#6644F0] dark:text-violet-300 tabular-nums">
              {selectedList.length} مورد
            </span>
          </div>
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={selectedSearch}
                onChange={e => setSelectedSearch(e.target.value)}
                placeholder="جستجو در انتخاب‌ها..."
                className="w-full pr-8 pl-2.5 py-1.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6644F0]"
              />
            </div>
          </div>
          <div className="flex-1 min-h-[140px] max-h-44 overflow-y-auto p-1.5 space-y-1">
            {selectedList.length > 0 ? (
              selectedList.map(item => {
                const isHighlighted = highlightedSelected.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleHighlightSelected(item)}
                    onDoubleClick={() => onChange(selectedServices.filter(s => s !== item))}
                    className={`w-full text-right px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      isHighlighted
                        ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                    }`}
                  >
                    {item}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-[11px] text-gray-400">هنوز خدمتی انتخاب نشده است</div>
            )}
          </div>
          <button
            type="button"
            onClick={clearAll}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700/40 border-t border-gray-100 dark:border-gray-700 text-[11px] font-semibold text-gray-600 dark:text-gray-300 hover:text-red-600 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف همه</span>
          </button>
        </div>
      </div>
      <p className="text-[11px] text-gray-400 dark:text-gray-500">
        برای انتقال سریع می‌توانید روی هر مورد دابل کلیک کنید یا موارد دلخواه را انتخاب و با فلش جابه‌جا نمایید.
      </p>
    </div>
  );
};

export default DualServiceSelector;
