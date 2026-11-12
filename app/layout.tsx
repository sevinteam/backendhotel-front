import type {Metadata} from 'next';
import './globals.css';
import { Vazirmatn } from 'next/font/google';

const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-vazir',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'سفرنامه ۲۴ - پنل مدیریت رزرواسیون هتل',
  description: 'پنل مدیریت پیشرفته رزرواسیون هتل، کاربران، تراکنش‌ها، پیام‌ها و تنظیمات سایت سفرنامه ۲۴',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className={`${vazir.className} antialiased bg-[#F9F9F9] dark:bg-gray-900 text-gray-800 dark:text-gray-200`}>
        {children}
      </body>
    </html>
  );
}
