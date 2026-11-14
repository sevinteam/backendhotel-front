'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/components/LoginPage';
import Toast from '@/components/Toast';
import type { ToastType } from '@/types';

export default function LoginRoutePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [toasts, setToasts] = useState<ToastType[]>([]);

  useEffect(() => {
    const auth = !!localStorage.getItem('isAuthenticated');
    if (auth) {
      router.replace('/dashboard');
      return;
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    setMounted(true);
  }, [router]);

  useEffect(() => {
    if (!mounted) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme, mounted]);

  const addToast = useCallback(
    (message: string, type: 'success' | 'error', onToastClose?: () => void) => {
      const id = Date.now();
      setToasts((prevToasts) => [
        ...prevToasts,
        { id, message, type, onCloseCallback: onToastClose },
      ]);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const handleLoginSuccess = useCallback(() => {
    localStorage.setItem('isAuthenticated', 'true');
    router.replace('/dashboard');
  }, [router]);

  const handleSetTheme = useCallback((nextTheme: 'light' | 'dark') => {
    setTheme(nextTheme);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6644F0]"></div>
      </div>
    );
  }

  return (
    <>
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onShowToast={addToast}
        theme={theme}
        setTheme={handleSetTheme}
      />
      <div className="fixed bottom-0 md:bottom-8 left-0 md:left-8 right-0 md:right-auto z-[1000] flex flex-col items-center md:items-start gap-4 w-full md:w-auto pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="w-full md:w-auto pointer-events-auto">
            <Toast toast={toast} onClose={removeToast} />
          </div>
        ))}
      </div>
    </>
  );
}
