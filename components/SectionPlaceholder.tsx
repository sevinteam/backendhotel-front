'use client';

import React from 'react';
import { DocumentTextIcon } from '@/components/icons';

export default function SectionPlaceholder({ title }: { title: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm flex-1 flex items-center justify-center flex-col text-center border border-gray-100 dark:border-gray-700">
      <DocumentTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">صفحه {title}</h2>
      <p className="text-gray-400 dark:text-gray-500 mt-2 max-w-md text-sm">
        محتوای این صفحه در حال آماده سازی و یکپارچه‌سازی با سرویس‌های هتلداری است.
      </p>
    </div>
  );
}
