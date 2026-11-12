'use client';

import React, { useState } from 'react';
import { BankIcon, DocumentTextIcon } from './icons';

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
          onClick={() => onShowToast('قابلیت افزودن در حال توسعه است', 'success')}
          className="bg-[#6644F0] hover:bg-[#5533E0] text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>+ افزودن مورد جدید</span>
        </button>
      </div>

      {/* تب‌های ناوبری */}
      <div className="flex overflow-x-auto gap-2 py-4 border-b border-gray-100 dark:border-gray-700 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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

      {/* محتوای تب فعال (خالی و آماده برای اتصال به API جنگو) */}
      <div className="flex-1 flex items-center justify-center flex-col text-center py-16">
        <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-300 dark:text-gray-500 mb-4">
          <DocumentTextIcon className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-gray-700 dark:text-gray-200">بخش {activeType(activeTab)}</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-sm">
          اطلاعات و جدول مربوط به این تب به‌زودی از طریق API های جنگو بارگذاری خواهد شد.
        </p>
      </div>
    </div>
  );

  function activeType(tab: string) {
    return tab;
  }
};

export default HotelManagement;
