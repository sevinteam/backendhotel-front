import type { User } from '@/types';

export const VIEW_TO_PATH: Record<string, string> = {
  'پیشخوان ادمین': '/dashboard',
  'مدیریت هتل و اتاق ها': '/hotels',
  'مدیریت رزروهای کاربران': '/reservations',
  'مدیریت پروفایل کاربران': '/users',
  'مدیریت چت های کاربران': '/chats',
  'مدیریت نوتیفیکیشن ها': '/notifications',
  'مدیریت کد تخفیف ها': '/discounts',
  'مدیریت بخش مالی': '/finance',
  'مدیریت مقالات وبسایت': '/articles',
  'پیام‌های تماس با ما': '/messages',
  'تنظیمات محتوای وب سایت': '/website-settings',
  'مدیریت تسک ادمین ها': '/tasks',
  'تنظیمات ادمین': '/admin-settings',
};

export const PATH_TO_VIEW: Record<string, string> = Object.fromEntries(
  Object.entries(VIEW_TO_PATH).map(([view, path]) => [path, view])
);

export function getPathForView(view: string, openUserProfiles: User[] = []): string {
  const matchedUser = openUserProfiles.find((u) => u.name === view);
  if (matchedUser) {
    return `/users/${matchedUser.id}`;
  }
  return VIEW_TO_PATH[view] || '/dashboard';
}

export function getViewFromPathname(pathname: string, openUserProfiles: User[] = []): string {
  if (pathname.startsWith('/users/')) {
    const idSegment = pathname.replace('/users/', '').split('/')[0];
    const matchedUser = openUserProfiles.find((u) => String(u.id) === idSegment);
    if (matchedUser) {
      return matchedUser.name;
    }
    return 'مدیریت پروفایل کاربران';
  }
  return PATH_TO_VIEW[pathname] || 'پیشخوان ادمین';
}
