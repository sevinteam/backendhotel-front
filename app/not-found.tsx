import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 p-4" dir="rtl">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg border max-w-md w-full">
        <h1 className="text-4xl font-black text-[#417690] mb-2">۴۰۴</h1>
        <h2 className="text-xl font-bold mb-3">صفحه مورد نظر یافت نشد</h2>
        <p className="text-gray-500 mb-6 text-sm">
          آدرس وارد شده اشتباه است یا صفحه به مکان دیگری منتقل شده است.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-[#417690] hover:bg-[#264b5d] text-white font-medium rounded-lg transition-colors text-sm shadow"
        >
          بازگشت به پنل اصلی
        </Link>
      </div>
    </div>
  );
}
