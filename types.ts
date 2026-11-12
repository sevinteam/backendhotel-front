
import React from 'react';

// تعریف نوع برای آیتم‌های منوی ناوبری (سایدبار)
export interface NavItemType {
  name: string; // نام آیتم
  icon: React.ComponentType<{ className?: string }>; // کامپوننت آیکون
  active?: boolean; // آیا فعال است؟
  badgeCount?: number;
}

// تعریف نوع برای اطلاعات کاربر
export interface User {
  id: number;
  name: string;
  phone: string;
  avatar: string; // آدرس تصویر پروفایل
  email?: string;
}

// تعریف نوع برای ارجاع به کاربر (مثلا در انتخاب کاربر برای تسک)
export interface UserReference {
  id: number;
  name: string;
  avatar?: string; // آدرس تصویر پروفایل (اختیاری)
}

// تعریف نوع برای هر آیتم در چک‌لیست تسک
export interface ChecklistItem {
  id: number;
  text: string; // متن آیتم
  completed: boolean; // آیا انجام شده است؟
}

// تعریف وضعیت‌های ممکن برای رزرو
export type ReservationStatus = 'در انتظار' | 'عدم تایید' | 'پرداخت شده' | 'لغو شده' | 'تایید شده';
// تعریف وضعیت‌های ممکن برای درخواست پروفایل حقوقی
export type LegalRequestStatus = 'بررسی شده' | 'تایید شده' | 'عدم تایید';
// تعریف وضعیت‌های ممکن برای پرداخت رزرو
export type PaymentStatus = 'در انتظار پرداخت' | 'عدم تایید' | 'پرداخت شده' | 'لغو شده';


// تعریف نوع برای اطلاعات یک رزرو
export interface Reservation {
  id: number;
  user: User; // کاربر رزرو کننده
  dateRange: string; // بازه زمانی
  hotelName: string; // نام هتل
  trackingCode: string; // کد پیگیری
  status: ReservationStatus; // وضعیت رزرو
}

// تعریف نوع برای اطلاعات یک رزرو در پروفایل کاربر
export interface ProfileReservation {
    id: number;
    trackingCode: string;
    travelerName: string;
    dateRange: string;
    numberOfRooms: string;
    numberOfTravelers: string;
    totalPrice: string;
    status: PaymentStatus;
}

// تعریف نوع جدید برای صفحه مدیریت رزروها
export interface ManagedReservation {
  id: number;
  trackingCode: string;
  user: {
    name: string;
    phone: string;
  };
  mainTravelerName: string;
  dateRange: string;
  hotelName: string;
  roomCount: number;
  status: PaymentStatus;
}

// FIX: Add NewReservationData type for creating new reservations.
// تعریف نوع برای داده‌های یک رزرو جدید
export interface NewReservationData {
  user: UserReference;
  hotelName: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  roomCount: number;
  status: PaymentStatus;
}

// تعریف نوع برای اطلاعات کارت بانکی
export interface CardInfo {
  id: number;
  logo: React.ComponentType<{ className?: string }>; // کامپوننت آیکون لوگو
  fullNumber: string; // شماره ۱۶ رقمی کارت
  iban: string; // شماره ۲۴ رقمی شبا
}

// تعریف نوع برای درخواست پروفایل حقوقی
export interface LegalProfileRequest {
    id: number;
    user: User;
    status: LegalRequestStatus;
}

// تعریف پراپرتی‌های کامپوننت کارت آمار
export interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string; // مقدار اصلی
    change?: string; // درصد تغییر
    changeType?: 'increase' | 'decrease'; // نوع تغییر (افزایشی یا کاهشی)
}

// تعریف وضعیت‌های ممکن برای یک تسک
export type TaskStatus = 'در حال انجام' | 'انجام شده' | 'در حال برسی';

// تعریف نوع برای اطلاعات یک تسک
export interface Task {
  id: number;
  adminName: string; // نام ادمین مسئول
  title:string;
  status: TaskStatus;
  description: string;
  startDate: string;
  endDate: string;
  supervisors: UserReference[]; // ناظران
  files?: UploadedFile[]; // فایل‌های ضمیمه
  admins?: UserReference[]; // ادمین‌های دیگر
  checklist?: ChecklistItem[]; // چک‌لیست
  chatHistory?: ChatMessage[]; // تاریخچه چت
}


// تعریف نوع برای یک فایل آپلود شده
export interface UploadedFile {
  id: number;
  name: string;
  size: string;
  uploader: string; // نام آپلود کننده
  format: string; // فرمت فایل
  content?: string; // محتوای base64/dataURL فایل
}

// تعریف نوع برای یک پیام در چت
export interface ChatMessage {
  id: number;
  sender: string; // فرستنده
  avatar: string;
  timestamp: string; // زمان ارسال
  isCurrentUser: boolean; // آیا پیام برای کاربر فعلی است؟
  type: 'text' | 'audio' | 'image' | 'video' | 'file'; // نوع پیام
  content: string; // محتوای متنی یا آدرس/base64 رسانه
  fileInfo?: {
    name: string;
    size?: string;
    duration?: string; // برای فایل‌های صوتی
  };
}

// تعریف نوع برای یک اعلان Toast
export interface ToastType {
  id: number;
  message: string;
  type: 'success' | 'error';
  onCloseCallback?: () => void; // تابعی که پس از بسته شدن اجرا می‌شود
}

// تعریف نوع برای سطح کاربری و سطح ادمین
export type UserLevel = 'طلایی' | 'نقره ای' | 'برنزی';
export type AdminLevel = 'دارد' | 'ندارد';

// تعریف نوع برای کاربر در صفحه مدیریت پروفایل کاربران
export interface ManagedUser {
  id: number;
  name: string;
  phone: string;
  avatar: string;
  email: string;
  userLevel: UserLevel;
  adminLevel: AdminLevel;
  walletBalance: string;
}

// تعریف نوع برای مسافر
export interface Traveler {
  id: number;
  name: string;
  familyName: string;
  phone: string;
  nationalId: string;
}

// تعریف نوع برای یک تیکت کاربر
export interface Ticket {
  id: number;
  title: string;
  avatar: string;
  status: 'open' | 'closed' | 'pending';
  lastUpdate: string;
  unreadCount?: number;
  messages: ChatMessage[];
  month?: string;
  lastMessageFrom?: 'user' | 'support';
  isNew?: boolean;
  department?: string; // دپارتمان مربوط به تیکت
}

export interface Article {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  source: string;
  date: string;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  stars: number;
  price: string;
  imageUrl: string;
}

export interface Wishlist {
  id: number;
  title: string;
  images: string[];
  articles?: Article[];
  hotels?: Hotel[];
}

// تعریف وضعیت‌های ممکن برای نوتیفیکیشن
export type NotificationStatus = 'مهم' | 'جدید';

// تعریف نوع برای یک نوتیفیکیشن
export interface Notification {
  id: number;
  title: string;
  date: string;
  time: string;
  status: NotificationStatus;
  sentToAll: boolean;
  description?: string;
  users?: UserReference[];
  readBy?: UserReference[];
}

// تعریف وضعیت‌های ممکن برای پیام تماس با ما
export type ContactMessageStatus = 'خوانده شده' | 'خوانده نشده';

// تعریف نوع برای یک پیام تماس با ما
export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string;
  subject: string;
  date: string;
  status: ContactMessageStatus;
  message: string;
}
