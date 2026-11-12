import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'سفرنامه ۲۴ - پنل مدیریت رزرواسیون هتل',
  description: 'پنل مدیریت پیشرفته رزرواسیون هتل، کاربران، تراکنش‌ها، پیام‌ها و تنظیمات سایت سفرنامه ۲۴',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning className="font-['Vazirmatn'] antialiased bg-[#F9F9F9] dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {children}
      </body>
    </html>
  );
}
