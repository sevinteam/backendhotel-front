/**
 * منبع داده متمرکز و هماهنگ بین پنل مدیریت جنگو (/admin) و فرانت‌اند مدرن (/)
 * شامل تمامی اپلیکیشن‌ها و مدل‌های رسمی تعریف شده در بک‌اند جنگو
 */

export interface ModelFieldDefinition {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'text' | 'select';
  required?: boolean;
  options?: string[];
  helpText?: string;
  fieldset?: string;
}

export interface DjangoModelConfig {
  id: string;
  name: string;
  nameEn: string;
  tableName: string;
  fields: ModelFieldDefinition[];
  data: Record<string, any>[];
  fieldsets?: { title: string; fields: string[] }[];
}

export interface DjangoAppConfig {
  appId: string;
  appName: string;
  appNameEn: string;
  icon: string;
  models: DjangoModelConfig[];
}

export const initialDjangoApps: DjangoAppConfig[] = [
  // ۱. احراز هویت و کاربران (AUTHENTICATION)
  {
    appId: 'authentication',
    appName: 'احراز هویت و کاربران (AUTHENTICATION)',
    appNameEn: 'Authentication & Users',
    icon: '🔐',
    models: [
      {
        id: 'baseuser',
        name: 'کاربران اصلی (BaseUser)',
        nameEn: 'Users',
        tableName: 'authentication_baseuser',
        fields: [
          { name: 'phone_number', label: 'شماره موبایل', type: 'string', required: true, helpText: 'شناسه یکتای ورود کاربر (موبایل ۱۱ رقمی)' },
          { name: 'is_staff', label: 'دسترسی ادمین (Staff)', type: 'boolean', helpText: 'آیا این کاربر می‌تواند وارد پنل شود؟' },
          { name: 'is_superuser', label: 'سوپریوزر (مدیر کل)', type: 'boolean', helpText: 'دسترسی کامل به تمام اپ‌های جنگو' },
          { name: 'is_active', label: 'حساب فعال', type: 'boolean' },
          { name: 'date_joined', label: 'تاریخ عضویت', type: 'string' },
        ],
        data: [
          { id: 1, phone_number: '09120759419', is_staff: true, is_superuser: true, is_active: true, date_joined: '۱۴۰۳/۰۶/۱۵' },
          { id: 2, phone_number: '09912356290', is_staff: false, is_superuser: false, is_active: true, date_joined: '۱۴۰۳/۰۶/۲۰' },
          { id: 3, phone_number: '09121112233', is_staff: false, is_superuser: false, is_active: true, date_joined: '۱۴۰۳/۰۷/۰۱' },
          { id: 4, phone_number: '09351234567', is_staff: true, is_superuser: false, is_active: true, date_joined: '۱۴۰۳/۰۷/۱۰' },
        ],
      },
      {
        id: 'naturalprofile',
        name: 'پروفایل‌های حقیقی (NaturalProfile)',
        nameEn: 'Natural Profiles',
        tableName: 'authentication_naturalprofile',
        fields: [
          { name: 'user_phone', label: 'کاربر', type: 'string' },
          { name: 'first_name', label: 'نام', type: 'string', required: true },
          { name: 'last_name', label: 'نام خانوادگی', type: 'string', required: true },
          { name: 'national_code', label: 'کد ملی', type: 'string', required: true },
          { name: 'gender', label: 'جنسیت', type: 'select', options: ['مرد', 'زن'] },
          { name: 'birth_date', label: 'تاریخ تولد', type: 'string' },
        ],
        data: [
          { id: 1, user_phone: '09912356290', first_name: 'علیرضا', last_name: 'آذرخش آلوچه', national_code: '0012345678', gender: 'مرد', birth_date: '۱۳۷۰/۰۵/۱۲' },
          { id: 2, user_phone: '09121112233', first_name: 'پرهام', last_name: 'رحیمی', national_code: '0023456789', gender: 'مرد', birth_date: '۱۳۷۵/۰۸/۲۱' },
          { id: 3, user_phone: '09351234567', first_name: 'مریم', last_name: 'حسینی', national_code: '0034567890', gender: 'زن', birth_date: '۱۳۷۸/۰۲/۱۵' },
        ],
      },
      {
        id: 'juridicalprofile',
        name: 'پروفایل‌های حقوقی و شرکتی (JuridicalProfile)',
        nameEn: 'Juridical Profiles',
        tableName: 'authentication_juridicalprofile',
        fields: [
          { name: 'company_name', label: 'نام شرکت / سازمان', type: 'string', required: true },
          { name: 'economic_code', label: 'کد اقتصادی', type: 'string', required: true },
          { name: 'national_id', label: 'شناسه ملی شرکت', type: 'string', required: true },
          { name: 'status', label: 'وضعیت احراز', type: 'select', options: ['تایید شده', 'در حال بررسی', 'رد شده'] },
        ],
        data: [
          { id: 1, company_name: 'هلدینگ سفرهای طلایی پارس', economic_code: '14002345678', national_id: '10103456789', status: 'تایید شده' },
          { id: 2, company_name: 'شرکت خدمات گردشگری آریا', economic_code: '14008765432', national_id: '10109876543', status: 'در حال بررسی' },
        ],
      },
      {
        id: 'totpdevice',
        name: 'دستگاه‌های گوگل آتنتیکیتور (TOTPDevice)',
        nameEn: 'Google Authenticator Devices',
        tableName: 'otp_totp_totpdevice',
        fields: [
          { name: 'user_phone', label: 'کاربر مربوطه', type: 'string', required: true },
          { name: 'name', label: 'نام دستگاه', type: 'string' },
          { name: 'confirmed', label: 'تایید شده و فعال', type: 'boolean' },
          { name: 'step', label: 'بازه زمانی (ثانیه)', type: 'number' },
        ],
        data: [
          { id: 1, user_phone: '09120759419', name: 'Admin Mobile - iPhone', confirmed: true, step: 30 },
          { id: 2, user_phone: '09351234567', name: 'Manager Backup Device', confirmed: true, step: 30 },
        ],
      },
    ],
  },

  // ۲. مدیریت هتل و رزرواسیون (RESERVATION)
  {
    appId: 'reservation',
    appName: 'مدیریت هتل و رزرواسیون (RESERVATION)',
    appNameEn: 'Hotels & Reservations',
    icon: '🏨',
    models: [
      {
        id: 'hotel',
        name: 'هتل‌ها (Hotel)',
        nameEn: 'Hotels',
        tableName: 'reservation_hotel',
        fields: [
          { name: 'name', label: 'نام هتل', type: 'string', required: true },
          { name: 'city', label: 'شهر', type: 'string', required: true },
          { name: 'province', label: 'استان', type: 'string' },
          { name: 'stars', label: 'ستاره', type: 'number' },
          { name: 'hotel_type', label: 'نوع هتل', type: 'select', options: ['هتل بین‌المللی', 'هتل سنتی', 'هتل آپارتمان', 'بوتیک هتل', 'بوم‌گردی'] },
          { name: 'address', label: 'آدرس دقیق', type: 'string' },
          { name: 'phone', label: 'تلفن تماس', type: 'string' },
          { name: 'rating', label: 'امتیاز کاربران (از ۵)', type: 'number' },
          { name: 'min_price', label: 'شروع قیمت (تومان)', type: 'string' },
          { name: 'is_active', label: 'وضعیت نمایش', type: 'boolean' },
        ],
        data: [
          { id: 1, name: 'هتل اسپیناس پالاس تهران', city: 'تهران', province: 'تهران', stars: 5, hotel_type: 'هتل بین‌المللی', address: 'سعادت آباد، میدان بهرود', phone: '021-75675000', rating: 4.8, min_price: '۸,۵۰۰,۰۰۰', is_active: true },
          { id: 2, name: 'هتل مجلل درویشی مشهد', city: 'مشهد', province: 'خراسان رضوی', stars: 5, hotel_type: 'هتل بین‌المللی', address: 'خیابان امام رضا بین ۲۴ و ۲۶', phone: '051-38080000', rating: 4.9, min_price: '۷,۹۰۰,۰۰۰', is_active: true },
          { id: 3, name: 'هتل استقلال تهران', city: 'تهران', province: 'تهران', stars: 5, hotel_type: 'هتل بین‌المللی', address: 'تقاطع بزرگراه چمران و ولی‌عصر', phone: '021-22660011', rating: 4.5, min_price: '۶,۲۰۰,۰۰۰', is_active: true },
          { id: 4, name: 'هتل داریوش کیش', city: 'کیش', province: 'هرمزگان', stars: 5, hotel_type: 'بوتیک هتل', address: 'میدان داریوش', phone: '076-44444900', rating: 4.7, min_price: '۹,۱۰۰,۰۰۰', is_active: true },
          { id: 5, name: 'هتل عباسی اصفهان', city: 'اصفهان', province: 'اصفهان', stars: 5, hotel_type: 'هتل سنتی', address: 'خیابان چهارباغ عباسی، خیابان آمادگاه', phone: '031-32226010', rating: 4.8, min_price: '۷,۴۰۰,۰۰۰', is_active: true },
        ],
      },
      {
        id: 'room',
        name: 'اتاق‌ها (Room)',
        nameEn: 'Rooms',
        tableName: 'reservation_room',
        fields: [
          { name: 'hotel_name', label: 'نام هتل', type: 'string', required: true },
          { name: 'title', label: 'عنوان اتاق', type: 'string', required: true },
          { name: 'capacity', label: 'ظرفیت استاندارد (نفر)', type: 'number' },
          { name: 'extra_capacity', label: 'ظرفیت اضافه', type: 'number' },
          { name: 'price', label: 'نرخ هر شب (تومان)', type: 'string' },
          { name: 'breakfast_included', label: 'صبحانه رایگان', type: 'boolean' },
          { name: 'is_available', label: 'آماده رزرو', type: 'boolean' },
        ],
        data: [
          { id: 101, hotel_name: 'هتل اسپیناس پالاس تهران', title: 'سوئیت رویال دو خوابه رو به کوهستان', capacity: 4, extra_capacity: 1, price: '۱۴,۵۰۰,۰۰۰', breakfast_included: true, is_available: true },
          { id: 102, hotel_name: 'هتل اسپیناس پالاس تهران', title: 'اتاق دوتخته دلوکس کینگ', capacity: 2, extra_capacity: 0, price: '۸,۵۰۰,۰۰۰', breakfast_included: true, is_available: true },
          { id: 201, hotel_name: 'هتل مجلل درویشی مشهد', title: 'سوئیت امپریال دوبلکس هندی', capacity: 3, extra_capacity: 1, price: '۱۱,۹۰۰,۰۰۰', breakfast_included: true, is_available: true },
          { id: 301, hotel_name: 'هتل داریوش کیش', title: 'اتاق دو تخته رو به آب‌های خلیج فارس', capacity: 2, extra_capacity: 1, price: '۹,۱۰۰,۰۰۰', breakfast_included: true, is_available: true },
        ],
      },
      {
        id: 'snapphoteldirectory',
        name: 'بانک هتل‌های اسنپ‌تریپ (SnappHotelDirectory)',
        nameEn: 'SnappTrip Hotel Bank',
        tableName: 'reservation_snapphoteldirectory',
        fields: [
          { name: 'snapp_hotel_id', label: 'شناسه اسنپ‌تریپ', type: 'string', required: true },
          { name: 'name', label: 'نام هتل در اسنپ‌تریپ', type: 'string', required: true },
          { name: 'city', label: 'شهر', type: 'string' },
          { name: 'stars', label: 'ستاره', type: 'number' },
          { name: 'snapp_rating', label: 'امتیاز اسنپ‌تریپ', type: 'number' },
          { name: 'sync_status', label: 'وضعیت اتصال وب‌سرویس', type: 'select', options: ['متصل و همگام', 'در انتظار بررسی', 'خطا در وب‌سرویس'] },
          { name: 'last_synced', label: 'آخرین آپدیت قیمت', type: 'string' },
        ],
        data: [
          { id: 1, snapp_hotel_id: 'SNT-TEH-1082', name: 'هتل اسپیناس پالاس تهران', city: 'تهران', stars: 5, snapp_rating: 4.8, sync_status: 'متصل و همگام', last_synced: '۱۰ دقیقه پیش' },
          { id: 2, snapp_hotel_id: 'SNT-MHD-3021', name: 'هتل مجلل درویشی مشهد', city: 'مشهد', stars: 5, snapp_rating: 4.9, sync_status: 'متصل و همگام', last_synced: '۲۵ دقیقه پیش' },
          { id: 3, snapp_hotel_id: 'SNT-KIH-5049', name: 'هتل داریوش کیش', city: 'کیش', stars: 5, snapp_rating: 4.7, sync_status: 'متصل و همگام', last_synced: 'امروز ۱۱:۳۰' },
          { id: 4, snapp_hotel_id: 'SNT-IFN-2018', name: 'هتل پارسیان کوثر اصفهان', city: 'اصفهان', stars: 5, snapp_rating: 4.6, sync_status: 'متصل و همگام', last_synced: 'امروز ۰۹:۰۰' },
          { id: 5, snapp_hotel_id: 'SNT-SYZ-4011', name: 'هتل بزرگ شیراز (دروازه قرآن)', city: 'شیراز', stars: 5, snapp_rating: 4.7, sync_status: 'متصل و همگام', last_synced: 'امروز ۱۰:۱۵' },
        ],
      },
      {
        id: 'snapptripsetting',
        name: 'تنظیمات وب‌سرویس اسنپ‌تریپ (SnappTripSetting)',
        nameEn: 'SnappTrip API Settings',
        tableName: 'reservation_snapptripsetting',
        fields: [
          { name: 'api_url', label: 'آدرس Endpoint وب‌سرویس', type: 'string', required: true },
          { name: 'api_key', label: 'توکن دسترسی (API Token)', type: 'string', required: true },
          { name: 'markup_percent', label: 'درصد مارک‌آپ (سود آژانس)', type: 'number' },
          { name: 'auto_sync', label: 'همگام‌سازی خودکار تقویم و نرخ', type: 'boolean' },
          { name: 'is_active', label: 'سرویس فعال است', type: 'boolean' },
        ],
        data: [
          { id: 1, api_url: 'https://b2b-api.snapptrip.com/v2/hotel-service', api_key: 'snapp_b2b_live_key_948210398', markup_percent: 7.5, auto_sync: true, is_active: true },
        ],
      },
      {
        id: 'reservationhotel',
        name: '01- رزروها (Reservationhotel)',
        nameEn: 'Hotel Reservations',
        tableName: 'reservation_reservationhotel',
        fields: [
          { name: 'tracking_code', label: 'کد پیگیری رزرو', type: 'string', required: true },
          { name: 'buyer_phone_number', label: 'موبایل خریدار', type: 'string' },
          { name: 'reserver_first_name', label: 'نام رزرو کننده', type: 'string' },
          { name: 'reserver_last_name', label: 'نام خانوادگی رزرو کننده', type: 'string' },
          { name: 'reserver_phone_number', label: 'شماره تماس رزرو کننده', type: 'string' },
          { name: 'reserver_national_code', label: 'کد ملی رزرو کننده', type: 'string' },
          { name: 'check_in_date', label: 'تاریخ ورود', type: 'string', required: true },
          { name: 'check_out_date', label: 'تاریخ خروج', type: 'string', required: true },
          { name: 'nights_count_fa', label: 'تعداد شب‌ها', type: 'number' },
          { name: 'total_price_fa', label: 'مجموع قیمت (تومان)', type: 'string' },
          { name: 'final_price_fa', label: 'قیمت نهایی', type: 'string', required: true },
          { name: 'payment_status', label: 'وضعیت پرداخت', type: 'select', options: ['در انتظار پرداخت', 'پرداخت نشده', 'پرداخت شده'] },
          { name: 'capacity_status', label: 'وضعیت ظرفیت', type: 'select', options: ['در انتظار تایید', 'تایید شده', 'رزرو رد شده'] },
          { name: 'is_snapptrip_reservation', label: 'رزرو اسنپ‌تریپ است؟', type: 'boolean' },
          { name: 'snapp_reservation_code', label: 'کد رزرو اسنپ', type: 'string' },
          { name: 'snapp_status', label: 'وضعیت در اسنپ', type: 'select', options: ['پیش‌نویس', 'true', 'ناموفق'] },
          { name: 'created_jalali', label: 'تاریخ ثبت', type: 'string' },
          { name: 'additional_notes', label: 'توضیحات تکمیلی', type: 'text' },
          { name: 'wallet_withdrawal_amount', label: 'مبلغ برداشت از کیف پول', type: 'number' },
          { name: 'wallet_withdrawn_fa', label: 'برداشت انجام شده', type: 'boolean' },
          { name: 'points_assigned_fa', label: 'امتیاز باشگاه', type: 'boolean' },
          { name: 'discount_processed_fa', label: 'پردازش تخفیف', type: 'boolean' },
          { name: 'cancellation_requested_fa', label: 'درخواست کنسلی', type: 'boolean' },
        ],
        data: [
          {
            id: 173,
            tracking_code: 'sfa5652848978',
            buyer_phone_number: '-',
            reserver_first_name: '',
            reserver_last_name: '',
            reserver_phone_number: '',
            reserver_national_code: '',
            check_in_date: '1405-08-18',
            check_out_date: '1405-08-19',
            nights_count_fa: 1,
            total_price_fa: '21,089,000',
            final_price_fa: '21,089,000',
            payment_status: 'در انتظار پرداخت',
            capacity_status: 'رزرو رد شده',
            is_snapptrip_reservation: true,
            snapp_reservation_code: '547869023',
            snapp_status: 'پیش‌نویس',
            created_jalali: '21:34 1405/08/18',
            additional_notes: '',
            wallet_withdrawal_amount: 0,
            wallet_withdrawn_fa: false,
            points_assigned_fa: false,
            discount_processed_fa: false,
            cancellation_requested_fa: false,
            total_rooms_fa: 1,
            total_guests_fa: 1,
            rooms: [
              {
                id: 1,
                room_title: 'یک تخته استاندارد CF - اسپیناس پالاس',
                price_per_night: '21,089,000',
                extra_passenger_price: '0',
                fixed_discount: '0',
                subtotal: '21,089,000',
                primary_passengers_count: 1,
                extra_passengers_count: 0,
                half_day_in_selected: false,
                half_day_out_selected: false,
                passengers: [
                  { id: 1, passenger_type: 'بزرگسال', first_name: '', last_name: '', mobile_number: '', national_code: '' }
                ]
              }
            ]
          },
          {
            id: 172,
            tracking_code: 'sfa0863799811',
            buyer_phone_number: '09120759419',
            reserver_first_name: 'Alireza',
            reserver_last_name: 'Azarakhsh',
            reserver_phone_number: '09120759419',
            reserver_national_code: '0012345678',
            check_in_date: '1405-08-18',
            check_out_date: '1405-08-19',
            nights_count_fa: 1,
            total_price_fa: '15,200,000',
            final_price_fa: '15,200,000',
            payment_status: 'پرداخت نشده',
            capacity_status: 'تایید شده',
            is_snapptrip_reservation: true,
            snapp_reservation_code: '655711349',
            snapp_status: 'true',
            created_jalali: '17:19 1405/08/18',
            additional_notes: '',
            wallet_withdrawal_amount: 0,
            wallet_withdrawn_fa: false,
            points_assigned_fa: false,
            discount_processed_fa: false,
            cancellation_requested_fa: false,
            total_rooms_fa: 1,
            total_guests_fa: 1,
            rooms: [
              {
                id: 1,
                room_title: 'اتاق دو تخته دلوکس - هتل اسپیناس پالاس',
                price_per_night: '15,200,000',
                extra_passenger_price: '0',
                fixed_discount: '0',
                subtotal: '15,200,000',
                primary_passengers_count: 2,
                extra_passengers_count: 0,
                half_day_in_selected: false,
                half_day_out_selected: false,
                passengers: [
                  { id: 1, passenger_type: 'بزرگسال', first_name: 'Alireza', last_name: 'Azarakhsh', mobile_number: '09120759419', national_code: '0012345678' }
                ]
              }
            ]
          },
          {
            id: 171,
            tracking_code: 'sfa0331271768',
            buyer_phone_number: '09120759419',
            reserver_first_name: '',
            reserver_last_name: '',
            reserver_phone_number: '09120759419',
            reserver_national_code: '',
            check_in_date: '1405-08-18',
            check_out_date: '1405-08-19',
            nights_count_fa: 1,
            total_price_fa: '15,200,000',
            final_price_fa: '15,200,000',
            payment_status: 'در انتظار پرداخت',
            capacity_status: 'در انتظار تایید',
            is_snapptrip_reservation: true,
            snapp_reservation_code: '383822862',
            snapp_status: 'true',
            created_jalali: '17:19 1405/08/18',
            additional_notes: '',
            wallet_withdrawal_amount: 0,
            wallet_withdrawn_fa: false,
            points_assigned_fa: false,
            discount_processed_fa: false,
            cancellation_requested_fa: false,
            total_rooms_fa: 1,
            total_guests_fa: 1,
            rooms: []
          },
          {
            id: 170,
            tracking_code: 'sfa3258726228',
            buyer_phone_number: '-',
            reserver_first_name: '',
            reserver_last_name: '',
            reserver_phone_number: '',
            reserver_national_code: '',
            check_in_date: '1405-08-18',
            check_out_date: '1405-08-19',
            nights_count_fa: 1,
            total_price_fa: '15,200,000',
            final_price_fa: '15,200,000',
            payment_status: 'در انتظار پرداخت',
            capacity_status: 'در انتظار تایید',
            is_snapptrip_reservation: true,
            snapp_reservation_code: '237519797',
            snapp_status: 'true',
            created_jalali: '13:52 1405/08/18',
            additional_notes: '',
            wallet_withdrawal_amount: 0,
            wallet_withdrawn_fa: false,
            points_assigned_fa: false,
            discount_processed_fa: false,
            cancellation_requested_fa: false,
            total_rooms_fa: 1,
            total_guests_fa: 1,
            rooms: []
          },
          {
            id: 169,
            tracking_code: 'sfa1139380936',
            buyer_phone_number: '09120759419',
            reserver_first_name: 'Alireza',
            reserver_last_name: 'Azarakhsh',
            reserver_phone_number: '09120759419',
            reserver_national_code: '0012345678',
            check_in_date: '1405-08-15',
            check_out_date: '1405-08-18',
            nights_count_fa: 3,
            total_price_fa: '3,392',
            final_price_fa: '3,392',
            payment_status: 'پرداخت نشده',
            capacity_status: 'تایید شده',
            is_snapptrip_reservation: true,
            snapp_reservation_code: '959962109',
            snapp_status: 'true',
            created_jalali: '16:44 1405/08/14',
            additional_notes: '',
            wallet_withdrawal_amount: 0,
            wallet_withdrawn_fa: false,
            points_assigned_fa: false,
            discount_processed_fa: false,
            cancellation_requested_fa: false,
            total_rooms_fa: 1,
            total_guests_fa: 1,
            rooms: []
          },
          {
            id: 168,
            tracking_code: 'sfa6322859959',
            buyer_phone_number: '09120759419',
            reserver_first_name: 'Alireza',
            reserver_last_name: 'Azarakhsh',
            reserver_phone_number: '09120759419',
            reserver_national_code: '0012345678',
            check_in_date: '1405-08-15',
            check_out_date: '1405-08-21',
            nights_count_fa: 6,
            total_price_fa: '6,890',
            final_price_fa: '6,890',
            payment_status: 'در انتظار پرداخت',
            capacity_status: 'در انتظار تایید',
            is_snapptrip_reservation: true,
            snapp_reservation_code: '558221202',
            snapp_status: 'true',
            created_jalali: '16:36 1405/08/14',
            additional_notes: '',
            wallet_withdrawal_amount: 0,
            wallet_withdrawn_fa: false,
            points_assigned_fa: false,
            discount_processed_fa: false,
            cancellation_requested_fa: false,
            total_rooms_fa: 1,
            total_guests_fa: 1,
            rooms: []
          },
          {
            id: 167,
            tracking_code: 'sfa6074524409',
            buyer_phone_number: '09120759419',
            reserver_first_name: 'Alireza',
            reserver_last_name: 'Azarakhsh',
            reserver_phone_number: '09120759419',
            reserver_national_code: '0012345678',
            check_in_date: '1405-08-15',
            check_out_date: '1405-08-16',
            nights_count_fa: 1,
            total_price_fa: '1,060',
            final_price_fa: '1,060',
            payment_status: 'پرداخت شده',
            capacity_status: 'تایید شده',
            is_snapptrip_reservation: true,
            snapp_reservation_code: '469311137',
            snapp_status: 'ناموفق',
            created_jalali: '15:16 1405/08/14',
            additional_notes: '',
            wallet_withdrawal_amount: 0,
            wallet_withdrawn_fa: false,
            points_assigned_fa: false,
            discount_processed_fa: false,
            cancellation_requested_fa: false,
            total_rooms_fa: 1,
            total_guests_fa: 1,
            rooms: []
          },
        ],
      },
      {
        id: 'facilities',
        name: 'امکانات عمومی هتل (Facilities)',
        nameEn: 'Hotel Facilities',
        tableName: 'reservation_facilities',
        fields: [
          { name: 'title', label: 'عنوان امکانات', type: 'string', required: true },
          { name: 'icon', label: 'کد آیکون', type: 'string' },
          { name: 'is_popular', label: 'امکانات شاخص و محبوب', type: 'boolean' },
        ],
        data: [
          { id: 1, title: 'استخر روباز و سرپوشیده', icon: 'pool', is_popular: true },
          { id: 2, title: 'اینترنت وای‌فای پرسرعت رایگان', icon: 'wifi', is_popular: true },
          { id: 3, title: 'پارکینگ اختصاصی رایگان', icon: 'parking', is_popular: true },
          { id: 4, title: 'رستوران سنتی و بین‌المللی', icon: 'restaurant', is_popular: true },
          { id: 5, title: 'سالن بدنسازی و اسپا', icon: 'gym', is_popular: true },
        ],
      },
      {
        id: 'roomfacilities',
        name: 'امکانات داخل اتاق (RoomFacilities)',
        nameEn: 'Room Facilities',
        tableName: 'reservation_roomfacilities',
        fields: [
          { name: 'title', label: 'نام امکانات اتاق', type: 'string', required: true },
          { name: 'icon', label: 'آیکون', type: 'string' },
        ],
        data: [
          { id: 1, title: 'چای‌ساز و قهوه‌ساز', icon: 'coffee' },
          { id: 2, title: 'مینی‌بار مجهز', icon: 'minibar' },
          { id: 3, title: 'صندوق امانات الکترونیکی (Safe Box)', icon: 'safe' },
          { id: 4, title: 'تلویزیون هوشمند ۴K', icon: 'tv' },
        ],
      },
      {
        id: 'besthotels',
        name: 'هتل‌های برتر صفحه اصلی (BestHotels)',
        nameEn: 'Best Hotels',
        tableName: 'reservation_besthotels',
        fields: [
          { name: 'hotel_name', label: 'هتل منتخب', type: 'string', required: true },
          { name: 'badge_title', label: 'برچسب پیشنهاد ویژه', type: 'string' },
          { name: 'priority', label: 'اولویت چینش', type: 'number' },
          { name: 'is_active', label: 'نمایش در بنر صفحه اصلی', type: 'boolean' },
        ],
        data: [
          { id: 1, hotel_name: 'هتل اسپیناس پالاس تهران', badge_title: 'پرفروش‌ترین هتل لوکس پایتخت', priority: 1, is_active: true },
          { id: 2, hotel_name: 'هتل مجلل درویشی مشهد', badge_title: 'بهترین هتل نزدیک حرم مطهر', priority: 2, is_active: true },
          { id: 3, hotel_name: 'هتل داریوش کیش', badge_title: 'اقامت شاهانه در سواحل خلیج فارس', priority: 3, is_active: true },
        ],
      },
      {
        id: 'cancellationreason',
        name: 'دلایل کنسلی (CancellationReason)',
        nameEn: 'Cancellation Reasons',
        tableName: 'reservation_cancellationreason',
        fields: [
          { name: 'title', label: 'عنوان دلیل کنسلی', type: 'string', required: true },
          { name: 'penalty_rate', label: 'درصد جریمه طبق قانون', type: 'string' },
        ],
        data: [
          { id: 1, title: 'تغییر تاریخ پرواز یا لغو سفر توسط مسافر', penalty_rate: '۱۰٪' },
          { id: 2, title: 'بیماری اورژانسی با ارائه گواهی پزشکی', penalty_rate: '۰٪' },
          { id: 3, title: 'عدم تطابق امکانات هتل با تعهدات', penalty_rate: '۰٪' },
        ],
      },
      {
        id: 'usercancellation',
        name: 'درخواست‌های کنسلی کاربران (UserCancellation)',
        nameEn: 'User Cancellations',
        tableName: 'reservation_usercancellation',
        fields: [
          { name: 'tracking_code', label: 'کد رهگیری رزرو', type: 'string', required: true },
          { name: 'traveler_name', label: 'مسافر', type: 'string' },
          { name: 'reason', label: 'علت کنسلی', type: 'string' },
          { name: 'penalty_amount', label: 'مبلغ جریمه (تومان)', type: 'string' },
          { name: 'refund_amount', label: 'مبلغ قابل استرداد', type: 'string' },
          { name: 'status', label: 'وضعیت رسیدگی', type: 'select', options: ['مسترد شد', 'در انتظار واریز', 'رد درخواست'] },
        ],
        data: [
          { id: 1, tracking_code: 'sfa3218870584', traveler_name: 'محمد علی خاکیان', reason: 'تغییر تاریخ پرواز یا لغو سفر', penalty_amount: '۸۵۰,۰۰۰', refund_amount: '۷,۶۵۰,۰۰۰', status: 'مسترد شد' },
        ],
      },
      {
        id: 'invoicesettings',
        name: 'تنظیمات فاکتور رسمی (ReservationInvoiceSettings)',
        nameEn: 'Invoice Settings',
        tableName: 'reservation_invoicesettings',
        fields: [
          { name: 'company_name', label: 'نام ثبتی شرکت صدور فاکتور', type: 'string', required: true },
          { name: 'economic_code', label: 'کد اقتصادی سازمان مالیاتی', type: 'string', required: true },
          { name: 'national_id', label: 'شناسه ملی', type: 'string' },
          { name: 'vat_percent', label: 'نرخ مالیات بر ارزش افزوده (درصد)', type: 'number' },
          { name: 'official_stamp', label: 'مهر و امضای الکترونیک فعال', type: 'boolean' },
        ],
        data: [
          { id: 1, company_name: 'شرکت خدمات مسافرت هوایی و جهانگردی سفرنامه ۲۴', economic_code: '411589412356', national_id: '10320498102', vat_percent: 10, official_stamp: true },
        ],
      },
    ],
  },

  // ۳. تنظیمات سامانه و محتوای سایت (CONFIG)
  {
    appId: 'config',
    appName: 'تنظیمات و محتوای سایت (CONFIG)',
    appNameEn: 'Site Configuration',
    icon: '⚙️',
    models: [
      {
        id: 'siteconfig',
        name: 'تنظیمات اصلی سایت (SiteConfig)',
        nameEn: 'Site Config',
        tableName: 'config_siteconfig',
        fields: [
          { name: 'site_title', label: 'عنوان سامانه', type: 'string', required: true },
          { name: 'phone', label: 'تلفن تماس پشتیبانی', type: 'string', required: true },
          { name: 'support_email', label: 'ایمیل پشتیبانی', type: 'string' },
          { name: 'address', label: 'آدرس دفتر مرکزی', type: 'string' },
          { name: 'copyright', label: 'متن کپی‌رایت فوتر', type: 'string' },
          { name: 'is_active', label: 'سامانه در دسترس است', type: 'boolean' },
        ],
        data: [
          { id: 1, site_title: 'سفرنامه ۲۴ - سامانه جامع رزرواسیون هتل و خدمات گردشگری', phone: '021-91002424', support_email: 'support@safarnameh24.com', address: 'تهران، خیابان ولی‌عصر، بالاتر از میدان ونک، برج سفرنامه، طبقه ۷', copyright: 'تمامی حقوق مادی و معنوی متعلق به سفرنامه ۲۴ است.', is_active: true },
        ],
      },
      {
        id: 'slides',
        name: 'اسلایدرهای صفحه اول (Slide)',
        nameEn: 'Home Slides',
        tableName: 'config_slide',
        fields: [
          { name: 'title', label: 'عنوان اسلاید', type: 'string', required: true },
          { name: 'subtitle', label: 'زیرعنوان', type: 'string' },
          { name: 'link', label: 'لینک دکمه', type: 'string' },
          { name: 'order', label: 'ترتیب نمایش', type: 'number' },
          { name: 'is_active', label: 'فعال', type: 'boolean' },
        ],
        data: [
          { id: 1, title: 'سفری خاطره‌انگیز به مشهد مقدس', subtitle: 'تا ۳۵٪ تخفیف رزرو هتل‌های ۵ ستاره نزدیک حرم', link: '/hotels/mashhad', order: 1, is_active: true },
          { id: 2, title: 'آرامش لوکس در سواحل نیلگون کیش', subtitle: 'همراه با گشت رایگان جزیره و ترانسفر فرودگاهی', link: '/hotels/kish', order: 2, is_active: true },
        ],
      },
      {
        id: 'enamadlicense',
        name: 'مجوزها و نمادهای اعتماد (EnamadLicense)',
        nameEn: 'Trust Badges & Licenses',
        tableName: 'config_enamadlicense',
        fields: [
          { name: 'license_name', label: 'نام مجوز', type: 'string', required: true },
          { name: 'license_code', label: 'کد استعلام / شناسه نماد', type: 'string' },
          { name: 'issuer', label: 'مرجع صادرکننده', type: 'string' },
          { name: 'is_active', label: 'نمایش در فوتر', type: 'boolean' },
        ],
        data: [
          { id: 1, license_name: 'اینماد ۵ ستاره (نماد تجارت الکترونیکی)', license_code: 'ENAMAD-8942104', issuer: 'وزارت صنعت، معدن و تجارت', is_active: true },
          { id: 2, license_name: 'نشان ملی ثبت رسانه‌های دیجیتال (ساماندهی)', license_code: 'SAMANDEHI-104928', issuer: 'وزارت فرهنگ و ارشاد اسلامی', is_active: true },
          { id: 3, license_name: 'مجوز بند ب سازمان میراث فرهنگی و گردشگری', license_code: 'CHTO-94812', issuer: 'وزارت میراث فرهنگی و گردشگری', is_active: true },
        ],
      },
      {
        id: 'faq',
        name: 'سوالات متداول مسافران (FAQ)',
        nameEn: 'FAQs',
        tableName: 'config_faq',
        fields: [
          { name: 'question', label: 'پرسش', type: 'string', required: true },
          { name: 'answer', label: 'پاسخ', type: 'text', required: true },
          { name: 'category', label: 'دسته موضوعی', type: 'select', options: ['رزرو هتل', 'کنسلی و استرداد', 'پرداخت و فاکتور'] },
        ],
        data: [
          { id: 1, question: 'چگونه می‌توانم رزرو قطعی هتل را پس از پرداخت دریافت کنم؟', answer: 'بلافاصله پس از پرداخت وجه، واچر رسمی هتل با مهر الکترونیکی در پنل کاربری شما صادر و پیامک حاوی لینک دانلود ارسال می‌گردد.', category: 'رزرو هتل' },
          { id: 2, question: 'قوانین و شرایط لغو رزرو هتل چیست؟', answer: 'کنسلی طبق بخشنامه سازمان میراث فرهنگی و قوانین اختصاصی هر هتل اعمال می‌شود. تا ۴۸ ساعت قبل از ورود معمولاً بدون جریمه یا با حداقل جریمه امکان‌پذیر است.', category: 'کنسلی و استرداد' },
        ],
      },
      {
        id: 'userlevel',
        name: 'سطوح کاربری مسافران (UserLevel)',
        nameEn: 'User Levels',
        tableName: 'config_userlevel',
        fields: [
          { name: 'title', label: 'عنوان سطح', type: 'string', required: true },
          { name: 'min_points', label: 'حداقل امتیاز مورد نیاز', type: 'number' },
          { name: 'discount_percent', label: 'تخفیف دائم روی تمام رزروها', type: 'number' },
        ],
        data: [
          { id: 1, title: 'میهمان پایه', min_points: 0, discount_percent: 0 },
          { id: 2, title: 'مسافر نقره‌ای', min_points: 500, discount_percent: 5 },
          { id: 3, title: 'مسافر طلایی VIP', min_points: 1500, discount_percent: 10 },
        ],
      },
    ],
  },

  // ۴. تنظیمات درگاه‌های بانکی و پرداخت (SETTING_PAYMENT)
  {
    appId: 'setting_payment',
    appName: 'تنظیمات درگاه‌های بانکی (SETTING_PAYMENT)',
    appNameEn: 'Payment Gateways',
    icon: '💳',
    models: [
      {
        id: 'zarinpalgateway',
        name: 'درگاه پرداخت زرین‌پال (ZarinpalGateway)',
        nameEn: 'Zarinpal Gateway',
        tableName: 'setting_payment_zarinpalgateway',
        fields: [
          { name: 'merchant_id', label: 'کد مرچنت ۳۶ کاراکتری', type: 'string', required: true },
          { name: 'description', label: 'توضیحات پیش‌فرض تراکنش', type: 'string' },
          { name: 'is_sandbox', label: 'محیط آزمایشی (Sandbox)', type: 'boolean' },
          { name: 'is_active', label: 'درگاه فعال است', type: 'boolean' },
        ],
        data: [
          { id: 1, merchant_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', description: 'خرید اینترنتی رزرو هتل از سفرنامه ۲۴', is_sandbox: false, is_active: true },
        ],
      },
      {
        id: 'iraniangateway',
        name: 'درگاه‌های شاپرکی شتاب (IranianGateway)',
        nameEn: 'Shaparak Gateways',
        tableName: 'setting_payment_iraniangateway',
        fields: [
          { name: 'bank_name', label: 'بانک ارائه‌دهنده', type: 'select', options: ['به‌پرداخت ملت', 'سامان کیش (SEP)', 'سداد بانک ملی', 'پارسیان (تاپ)'] },
          { name: 'terminal_id', label: 'کد پایانه (Terminal ID)', type: 'string', required: true },
          { name: 'username', label: 'نام کاربری وب‌سرویس', type: 'string' },
          { name: 'password', label: 'رمز عبور / کلید امنیتی', type: 'string' },
          { name: 'is_active', label: 'درگاه فعال است', type: 'boolean' },
        ],
        data: [
          { id: 1, bank_name: 'به‌پرداخت ملت', terminal_id: '78491024', username: 'safarnameh_bpm', password: '••••••••••••', is_active: true },
          { id: 2, bank_name: 'سامان کیش (SEP)', terminal_id: '49201948', username: 'safarnameh_sep', password: '••••••••••••', is_active: false },
        ],
      },
      {
        id: 'gatewaypreference',
        name: 'اولویت درگاه‌های پرداخت (PaymentGatewayPreference)',
        nameEn: 'Gateway Preferences',
        tableName: 'setting_payment_gatewaypreference',
        fields: [
          { name: 'gateway_title', label: 'درگاه پرداخت انتخابی', type: 'string', required: true },
          { name: 'priority', label: 'اولویت انتخاب خودکار', type: 'number' },
          { name: 'is_default', label: 'درگاه پیش‌فرض سایت', type: 'boolean' },
        ],
        data: [
          { id: 1, gateway_title: 'به‌پرداخت ملت (BPM)', priority: 1, is_default: true },
          { id: 2, gateway_title: 'زرین‌پال (ZarinPal)', priority: 2, is_default: false },
        ],
      },
    ],
  },

  // ۵. تنظیمات پیامک و وب‌سرویس‌ها (SETTING_SMS)
  {
    appId: 'setting_sms',
    appName: 'تنظیمات پیامک کاوه‌نگار (SETTING_SMS)',
    appNameEn: 'SMS Gateway Settings',
    icon: '📱',
    models: [
      {
        id: 'kavenegarsmssetting',
        name: 'وب‌سرویس کاوه‌نگار (KavenegarSMSSetting)',
        nameEn: 'Kavenegar SMS Settings',
        tableName: 'setting_sms_kavenegarsmssetting',
        fields: [
          { name: 'api_key', label: 'کلید وب‌سرویس (API Key)', type: 'string', required: true },
          { name: 'sender_number', label: 'خط اختصاصی پیامک', type: 'string', required: true },
          { name: 'credit_balance', label: 'موجودی اعتبار (پیامک)', type: 'number' },
          { name: 'is_active', label: 'وب‌سرویس فعال است', type: 'boolean' },
        ],
        data: [
          { id: 1, api_key: '6b492048102948120394812039481234567890abcdef', sender_number: '10008492048', credit_balance: 45800, is_active: true },
        ],
      },
      {
        id: 'smspattern',
        name: 'الگوهای پیامک خدماتی (SMSPattern)',
        nameEn: 'SMS Service Patterns',
        tableName: 'setting_sms_smspattern',
        fields: [
          { name: 'pattern_code', label: 'کد پترن در کاوه‌نگار', type: 'string', required: true },
          { name: 'description', label: 'مورد استفاده الگو', type: 'string' },
          { name: 'sample_text', label: 'متن الگو و متغیرها', type: 'text', required: true },
          { name: 'is_active', label: 'الگو تایید شده و فعال', type: 'boolean' },
        ],
        data: [
          { id: 1, pattern_code: 'safar_otp', description: 'کد تایید ورود مسافر (OTP)', sample_text: 'کد ورود شما به سفرنامه ۲۴: %token% \nاین کد محرمانه است.', is_active: true },
          { id: 2, pattern_code: 'safar_reserve_success', description: 'تایید نهایی رزرواسیون هتل', sample_text: 'مسافر گرامی %token%\nرزرو شما در %token2% قطعی شد. کد رهگیری: %token3%', is_active: true },
          { id: 3, pattern_code: 'safar_cancellation', description: 'اعلام استرداد وجه کنسلی', sample_text: 'مبلغ %token% تومان بابت کنسلی رزرو %token2% به کیف پول شما واریز شد.', is_active: true },
        ],
      },
    ],
  },

  // ۶. مالی و کیف پول (FINANCE)
  {
    appId: 'finance',
    appName: 'مالی، کیف پول و تراکنش‌ها (FINANCE)',
    appNameEn: 'Finance & Payments',
    icon: '💰',
    models: [
      {
        id: 'wallet',
        name: 'کیف پول کاربران (Wallet)',
        nameEn: 'User Wallets',
        tableName: 'finance_wallet',
        fields: [
          { name: 'user_phone', label: 'کاربر مربوطه', type: 'string', required: true },
          { name: 'balance', label: 'موجودی کیف پول (تومان)', type: 'string' },
          { name: 'updated_at', label: 'آخرین تراکنش', type: 'string' },
        ],
        data: [
          { id: 1, user_phone: '09912356290', balance: '۱,۴۵۰,۰۰۰', updated_at: '۱۴۰۳/۰۶/۲۴ ساعت ۱۵:۴۰' },
          { id: 2, user_phone: '09121112233', balance: '۰', updated_at: '۱۴۰۳/۰۶/۲۰ ساعت ۱۰:۱۵' },
          { id: 3, user_phone: '09351234567', balance: '۸۵۰,۰۰۰', updated_at: '۱۴۰۳/۰۷/۰۱ ساعت ۱۸:۳۰' },
        ],
      },
      {
        id: 'admincardsettings',
        name: 'شماره کارت‌های واریز مدیر (AdminCardSettings)',
        nameEn: 'Admin Destination Cards',
        tableName: 'finance_admincardsettings',
        fields: [
          { name: 'bank_name', label: 'نام بانک', type: 'string', required: true },
          { name: 'card_number', label: 'شماره کارت ۱۶ رقمی', type: 'string', required: true },
          { name: 'shaba_number', label: 'شماره شبا (IBAN)', type: 'string', required: true },
          { name: 'owner_name', label: 'نام صاحب حساب', type: 'string', required: true },
          { name: 'is_active', label: 'فعال برای دریافت فیش', type: 'boolean' },
        ],
        data: [
          { id: 1, bank_name: 'بانک سامان', card_number: '۶۲۱۹-۸۶۱۰-۲۴۵۸-۹۰۱۲', shaba_number: 'IR120560000000108920498201', owner_name: 'شرکت خدمات گردشگری سفرنامه ۲۴', is_active: true },
          { id: 2, bank_name: 'بانک ملت', card_number: '۶۱۰۴-۳۳۷۸-۹۰۱۲-۳۴۵۶', shaba_number: 'IR880120000000208920498202', owner_name: 'علیرضا آذرخش آلوچه', is_active: true },
        ],
      },
      {
        id: 'depositreceipt',
        name: 'فیش‌های واریز نقدی مسافران (DepositReceipt)',
        nameEn: 'Deposit Receipts',
        tableName: 'finance_depositreceipt',
        fields: [
          { name: 'user_phone', label: 'شماره مسافر', type: 'string', required: true },
          { name: 'amount', label: 'مبلغ واریزی (تومان)', type: 'string', required: true },
          { name: 'tracking_number', label: 'شماره پیگیری فیش', type: 'string', required: true },
          { name: 'destination_card', label: 'کارت مقصد', type: 'string' },
          { name: 'status', label: 'وضعیت بررسی مالی', type: 'select', options: ['تایید شد و شارژ شد', 'در انتظار تایید حسابداری', 'رد فیش'] },
        ],
        data: [
          { id: 1, user_phone: '09912356290', amount: '۵,۰۰۰,۰۰۰', tracking_number: 'TR-8920412', destination_card: 'بانک سامان (۹۰۱۲)', status: 'تایید شد و شارژ شد' },
          { id: 2, user_phone: '09121112233', amount: '۲,۵۰۰,۰۰۰', tracking_number: 'TR-8920415', destination_card: 'بانک ملت (۳۴۵۶)', status: 'در انتظار تایید حسابداری' },
        ],
      },
      {
        id: 'withdrawalrequest',
        name: 'درخواست‌های تسویه حساب (WithdrawalRequest)',
        nameEn: 'Withdrawal Requests',
        tableName: 'finance_withdrawalrequest',
        fields: [
          { name: 'requester_phone', label: 'درخواست‌کننده (هتلدار/کاربر)', type: 'string', required: true },
          { name: 'amount', label: 'مبلغ درخواستی (تومان)', type: 'string', required: true },
          { name: 'shaba', label: 'شماره شبا مقصد', type: 'string' },
          { name: 'status', label: 'وضعیت تسویه پایا', type: 'select', options: ['واریز شد (موفق)', 'در نوبت حواله پایا', 'رد درخواست'] },
        ],
        data: [
          { id: 1, requester_phone: '09120759419', amount: '۱۴,۵۰۰,۰۰۰', shaba: 'IR880120000000208920498202', status: 'واریز شد (موفق)' },
        ],
      },
    ],
  },

  // ۷. باشگاه مشتریان (BASHGAH_MOSHTARIAN)
  {
    appId: 'bashgah_moshtarian',
    appName: 'باشگاه مشتریان و تخفیف‌ها (CRM)',
    appNameEn: 'Customer Club & Loyalty',
    icon: '🎁',
    models: [
      {
        id: 'hoteldiscountcode',
        name: 'کدهای تخفیف هتل (HotelDiscountCode)',
        nameEn: 'Hotel Discounts',
        tableName: 'crm_hoteldiscountcode',
        fields: [
          { name: 'code', label: 'کد کوپن تخفیف', type: 'string', required: true },
          { name: 'discount_percent', label: 'درصد تخفیف', type: 'number', required: true },
          { name: 'max_discount', label: 'حداکثر سقف تخفیف (تومان)', type: 'string' },
          { name: 'valid_until', label: 'مهلت استفاده', type: 'string' },
          { name: 'usage_count', label: 'دفعات مصرف شده', type: 'number' },
          { name: 'is_active', label: 'کد فعال است', type: 'boolean' },
        ],
        data: [
          { id: 1, code: 'NOROOZ1404', discount_percent: 15, max_discount: '۱,۰۰۰,۰۰۰', valid_until: '۱۴۰۴/۰۱/۱۵', usage_count: 84, is_active: true },
          { id: 2, code: 'FIRST_HOTEL', discount_percent: 20, max_discount: '۵۰۰,۰۰۰', valid_until: '۱۴۰۴/۱۲/۲۹', usage_count: 312, is_active: true },
          { id: 3, code: 'VIP_TRAVEL', discount_percent: 25, max_discount: '۲,۰۰۰,۰۰۰', valid_until: '۱۴۰۴/۰۶/۳۱', usage_count: 19, is_active: true },
        ],
      },
      {
        id: 'customerclubpoint',
        name: 'امتیازهای وفاداری مسافران (CustomerClubPoint)',
        nameEn: 'Loyalty Points',
        tableName: 'crm_customerclubpoint',
        fields: [
          { name: 'user_phone', label: 'شماره کاربر', type: 'string', required: true },
          { name: 'points', label: 'مجموع امتیازهای باشگاه', type: 'number' },
          { name: 'tier', label: 'سطح وفاداری', type: 'string' },
        ],
        data: [
          { id: 1, user_phone: '09912356290', points: 1840, tier: 'مسافر طلایی VIP' },
          { id: 2, user_phone: '09121112233', points: 420, tier: 'مسافر پایه' },
          { id: 3, user_phone: '09351234567', points: 950, tier: 'مسافر نقره‌ای' },
        ],
      },
    ],
  },

  // ۸. اشتراک ویژه هتلداران و اعضا (USER_SUBSCRIPTION_SETTINGS)
  {
    appId: 'user_subscription_settings',
    appName: 'اشتراک‌ها و سطوح اعضا (SUBSCRIPTIONS)',
    appNameEn: 'Subscriptions',
    icon: '👑',
    models: [
      {
        id: 'subscriptionpackage',
        name: 'پکیج‌های اشتراک ویژه (SubscriptionPackage)',
        nameEn: 'Subscription Packages',
        tableName: 'subscription_package',
        fields: [
          { name: 'title', label: 'عنوان بسته اشتراک', type: 'string', required: true },
          { name: 'price', label: 'مبلغ اشتراک (تومان)', type: 'string', required: true },
          { name: 'duration_days', label: 'مدت اعتبار (روز)', type: 'number' },
          { name: 'features', label: 'امکانات پکیج', type: 'string' },
          { name: 'is_active', label: 'فعال', type: 'boolean' },
        ],
        data: [
          { id: 1, title: 'اشتراک ۳ ماهه نقره‌ای مسافر برتر', price: '۱,۲۰۰,۰۰۰', duration_days: 90, features: '۱۰٪ تخفیف مازاد + ترانسفر فرودگاهی رایگان', is_active: true },
          { id: 2, title: 'اشتراک سالانه الماس هتلداران و مسافران', price: '۳,۸۰۰,۰۰۰', duration_days: 365, features: 'پشتیبانی اختصاصی VIP + واچر بدون کارمزد', is_active: true },
        ],
      },
    ],
  },

  // ۹. وبلاگ و گردشگری (BLOG)
  {
    appId: 'blog',
    appName: 'وبلاگ و مقالات گردشگری (BLOG)',
    appNameEn: 'Travel Blog',
    icon: '📝',
    models: [
      {
        id: 'article',
        name: 'مقالات گردشگری (Article)',
        nameEn: 'Articles',
        tableName: 'blog_article',
        fields: [
          { name: 'title', label: 'عنوان مقاله', type: 'string', required: true },
          { name: 'category', label: 'دسته‌بندی', type: 'string' },
          { name: 'author', label: 'نویسنده', type: 'string' },
          { name: 'views', label: 'تعداد بازدید', type: 'number' },
          { name: 'is_published', label: 'منتشر شده', type: 'boolean' },
        ],
        data: [
          { id: 1, title: 'راهنمای جامع انتخاب بهترین هتل‌های ۵ ستاره مشهد در سال جدید', category: 'راهنمای سفر', author: 'علیرضا آذرخش', views: 2420, is_published: true },
          { id: 2, title: 'معرفی ۱۰ جاذبه رویایی کیش در فصل خنک پاییزی', category: 'کیش‌گردی', author: 'سارا محمدی', views: 1850, is_published: true },
        ],
      },
    ],
  },

  // ۱۰. تماس و پیام‌ها (CONTACT)
  {
    appId: 'contact',
    appName: 'پیام‌ها و پشتیبانی (CONTACT)',
    appNameEn: 'Support Messages',
    icon: '💬',
    models: [
      {
        id: 'contactmessage',
        name: 'پیام‌های تماس با ما (ContactMessage)',
        nameEn: 'Messages',
        tableName: 'contact_contactmessage',
        fields: [
          { name: 'name', label: 'نام فرستنده', type: 'string', required: true },
          { name: 'phone', label: 'تلفن تماس', type: 'string', required: true },
          { name: 'subject', label: 'موضوع پیام', type: 'string' },
          { name: 'date', label: 'زمان ارسال', type: 'string' },
          { name: 'status', label: 'وضعیت رسیدگی', type: 'select', options: ['خوانده شده', 'در حال پیگیری', 'خوانده نشده'] },
        ],
        data: [
          { id: 1, name: 'علیرضا آذرخش آلوچه', phone: '09912356290', subject: 'هماهنگی رزرو گروهی سازمانی', date: 'امروز، ساعت ۱۴:۲۰', status: 'در حال پیگیری' },
          { id: 2, name: 'پرهام رحیمی', phone: '09121112233', subject: 'درخواست تغییر تاریخ رزرو هتل اسپیناس', date: 'دیروز', status: 'خوانده شده' },
        ],
      },
    ],
  },

  // ۱۱. نوتیفیکیشن‌ها (NOTIFICATION)
  {
    appId: 'notification',
    appName: 'نوتیفیکیشن‌ها و اعلان‌ها (NOTIFICATION)',
    appNameEn: 'Notifications',
    icon: '🔔',
    models: [
      {
        id: 'notification',
        name: 'اعلان‌های سیستمی (Notification)',
        nameEn: 'System Notifications',
        tableName: 'notification_notification',
        fields: [
          { name: 'title', label: 'عنوان اعلان', type: 'string', required: true },
          { name: 'message', label: 'متن پیام اعلان', type: 'string' },
          { name: 'date', label: 'زمان', type: 'string' },
          { name: 'is_read', label: 'وضعیت مشاهده', type: 'boolean' },
        ],
        data: [
          { id: 1, title: 'رزرو جدید با موفقیت ثبت شد', message: 'رزرو هتل اسپیناس پالاس کد sfa3218870581 با موفقیت ثبت شد.', date: '۱۰ دقیقه پیش', is_read: false },
          { id: 2, title: 'تایید تراکنش بانکی شاپرک', message: 'پرداخت شماره TR-98234 با موفقیت تایید شد.', date: '۱ ساعت پیش', is_read: true },
        ],
      },
    ],
  },

  // ۱۲. علاقه‌مندی‌ها (FAVORITE)
  {
    appId: 'favorite',
    appName: 'علاقه‌مندی‌های کاربران (FAVORITE)',
    appNameEn: 'Favorites',
    icon: '❤️',
    models: [
      {
        id: 'favorite',
        name: 'هتل‌های نشان‌شده (Favorite)',
        nameEn: 'Saved Hotels',
        tableName: 'favorite_favorite',
        fields: [
          { name: 'user_phone', label: 'کاربر', type: 'string' },
          { name: 'hotel_name', label: 'هتل نشان‌شده', type: 'string' },
          { name: 'saved_date', label: 'تاریخ نشان‌گذاری', type: 'string' },
        ],
        data: [
          { id: 1, user_phone: '09912356290', hotel_name: 'هتل مجلل درویشی مشهد', saved_date: '۱۴۰۳/۰۶/۱۸' },
          { id: 2, user_phone: '09912356290', hotel_name: 'هتل داریوش کیش', saved_date: '۱۴۰۳/۰۶/۲۲' },
        ],
      },
    ],
  },

  // ۱۳. بکاپ هتل (HOTEL_BACKUP)
  {
    appId: 'hotel_backup',
    appName: 'پشتیبان‌گیری دیتابیس (HOTEL_BACKUP)',
    appNameEn: 'Database Backups',
    icon: '💾',
    models: [
      {
        id: 'hotelbackupmanager',
        name: 'لاگ نسخه‌های پشتیبان (HotelBackupManager)',
        nameEn: 'Backup Logs',
        tableName: 'backup_hotelbackupmanager',
        fields: [
          { name: 'file_name', label: 'نام فایل پشتیبان', type: 'string' },
          { name: 'size', label: 'حجم فایل', type: 'string' },
          { name: 'created_at', label: 'تاریخ ایجاد', type: 'string' },
          { name: 'status', label: 'وضعیت سلامت آرشیو', type: 'string' },
        ],
        data: [
          { id: 1, file_name: 'safarnameh24_db_auto_14030624.dump', size: '48.2 MB', created_at: '۱۴۰۳/۰۶/۲۴ ساعت ۰۳:۰۰', status: 'تایید شده و سالم' },
          { id: 2, file_name: 'safarnameh24_db_auto_14030623.dump', size: '47.8 MB', created_at: '۱۴۰۳/۰۶/۲۳ ساعت ۰۳:۰۰', status: 'تایید شده و سالم' },
        ],
      },
    ],
  },

  // ۱۴. آیکون‌ها و علائم بصری (ICONS)
  {
    appId: 'icons',
    appName: 'آیکون‌ها و علائم بصری (ICONS)',
    appNameEn: 'Visual Icons',
    icon: '🎨',
    models: [
      {
        id: 'iconshortcut',
        name: 'میانبر آیکون‌ها (IconShortcut)',
        nameEn: 'Icon Shortcuts',
        tableName: 'icons_iconshortcut',
        fields: [
          { name: 'title', label: 'عنوان امکانات', type: 'string' },
          { name: 'icon_code', label: 'کد آیکون', type: 'string' },
          { name: 'category', label: 'بخش مربوطه', type: 'string' },
        ],
        data: [
          { id: 1, title: 'هتل و اقامتگاه', icon_code: 'Bank', category: 'رزرواسیون' },
          { id: 2, title: 'کیف پول و مالی', icon_code: 'WalletMoney', category: 'مالی' },
          { id: 3, title: 'پشتیبانی ۲۴ ساعته', icon_code: 'Headphone', category: 'ارتباطات' },
        ],
      },
    ],
  },
];

// کلید ذخیره‌سازی در مرورگر (نسخه به‌روزشده v2)
const STORAGE_KEY = 'django_admin_database_store_v2';

export const getStoredDjangoApps = (): DjangoAppConfig[] => {
  if (typeof window === 'undefined') return initialDjangoApps;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDjangoApps));
      return initialDjangoApps;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDjangoApps));
      return initialDjangoApps;
    }
    return parsed;
  } catch {
    return initialDjangoApps;
  }
};

export const saveStoredDjangoApps = (apps: DjangoAppConfig[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    window.dispatchEvent(new Event('django_db_updated'));
  } catch (e) {
    console.error('Error saving django database state:', e);
  }
};
