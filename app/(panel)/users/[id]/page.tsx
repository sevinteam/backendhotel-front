'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import UserProfile from '@/components/UserProfile';
import { useAdmin } from '@/context/AdminContext';
import { Profile2UserIcon } from '@/components/icons';

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const { openUserProfiles, handleAdminAvatarChange, addToast, theme, handleNavigate } =
    useAdmin();

  const user = openUserProfiles.find((u) => String(u.id) === String(params?.id));

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm flex-1 flex items-center justify-center flex-col text-center border border-gray-100 dark:border-gray-700">
        <Profile2UserIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
          پروفایل کاربر یافت نشد
        </h2>
        <p className="text-gray-400 dark:text-gray-500 mt-2 max-w-md text-xs">
          برای مشاهده پروفایل کاربر، از لیست کاربران روی دکمه مشاهده پروفایل کلیک کنید.
        </p>
        <button
          type="button"
          onClick={() => handleNavigate('مدیریت پروفایل کاربران')}
          className="mt-5 px-5 py-2.5 rounded-xl bg-[#6644F0] hover:bg-[#5533E0] text-white text-xs font-bold transition-colors"
        >
          بازگشت به لیست کاربران
        </button>
      </div>
    );
  }

  return (
    <UserProfile
      user={user}
      onAdminAvatarChange={handleAdminAvatarChange}
      onShowToast={addToast}
      theme={theme}
    />
  );
}
