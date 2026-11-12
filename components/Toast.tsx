import React, { useEffect, useState } from 'react';
import { XIcon, CheckCircleIcon, XCircleIcon } from './icons';
import type { ToastType } from '../types';

interface ToastProps {
  toast: ToastType;
  onClose: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  // state برای کنترل نوار پیشرفت (progress bar)
  const [progress, setProgress] = useState(100);
  const duration = 3000; // مدت زمان نمایش Toast به میلی‌ثانیه

  // useEffect برای مدیریت بسته شدن خودکار و نوار پیشرفت
  useEffect(() => {
    const autoClose = () => {
      // اگر تابعی برای پس از بسته شدن تعریف شده، آن را اجرا کن
      if (toast.onCloseCallback) {
        toast.onCloseCallback();
      }
      onClose(toast.id);
    };

    const intervalTime = 50; // زمان به‌روزرسانی نوار پیشرفت
    const totalSteps = duration / intervalTime;
    const decrement = 100 / totalSteps;

    const interval = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress <= 0) {
          clearInterval(interval);
          return 0;
        }
        return oldProgress - decrement;
      });
    }, intervalTime);

    // تایمر برای بسته شدن خودکار
    const timer = setTimeout(autoClose, duration);

    // تابع پاکسازی برای جلوگیری از نشت حافظه
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [toast, onClose]);

  const isSuccess = toast.type === 'success';

  // آماده‌سازی پیام‌ها برای نمایش در موبایل (Bottom Sheet)
  let title = '';
  let description = '';
  if (isSuccess) {
    title = 'عملیات موفق';
    description = toast.message;
  } else {
    const parts = toast.message.split('! ');
    title = parts[0] + '!';
    description = parts.length > 1 ? parts.slice(1).join('! ') : '';
  }

  return (
    <>
      {/* نمای موبایل: Bottom Sheet */}
      <div className="md:hidden w-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl overflow-hidden animate-slide-in-up">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
        <div className="p-6 pt-2 text-center">
          <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${isSuccess ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
            {isSuccess ? <CheckCircleIcon className="w-10 h-10 text-green-500" /> : <XCircleIcon className="w-10 h-10 text-red-500" />}
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        {/* نوار پیشرفت برای موبایل */}
        <div className={`w-full bg-gray-200 dark:bg-gray-700 h-1.5`}>
            <div
                className={`h-1.5 ${isSuccess ? 'bg-green-500' : 'bg-red-500'} transition-all duration-100 ease-linear`}
                style={{ width: `${progress}%` }}
            ></div>
        </div>
      </div>

      {/* نمای دسکتاپ: Toast */}
      <div className={`hidden md:flex relative w-96 text-white p-4 rounded-2xl shadow-lg items-center justify-between gap-4 overflow-hidden animate-slide-in-bottom ${isSuccess ? 'bg-[#16A34A]' : 'bg-[#DC2626]'}`}>
        <div className="flex items-center gap-3">
            {isSuccess ? <CheckCircleIcon className="w-6 h-6 flex-shrink-0" /> : <XCircleIcon className="w-6 h-6 flex-shrink-0" />}
            <span className="font-bold text-sm">{toast.message}</span>
        </div>
        <button onClick={() => onClose(toast.id)} className="p-1 rounded-full hover:bg-transparent backdrop-blur-xs transition-colors flex-shrink-0">
            <XIcon className="w-5 h-5" />
        </button>
        {/* نوار پیشرفت برای دسکتاپ */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent backdrop-blur-xs">
            <div
                className="h-full bg-white/30"
                style={{ width: `${progress}%`, transition: 'width 50ms linear' }}
            ></div>
        </div>
      </div>

      {/* انیمیشن‌های سفارشی */}
      <style>{`
        @keyframes slide-in-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
        .animate-slide-in-up { animation: slide-in-up 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        @keyframes slide-in-bottom {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in-bottom { animation: slide-in-bottom 0.3s ease-out forwards; }
      `}</style>
    </>
  );
};

export default Toast;