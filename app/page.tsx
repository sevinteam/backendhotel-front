'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('isAuthenticated');
    router.replace(isAuthenticated ? '/dashboard' : '/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6644F0]"></div>
    </div>
  );
}
