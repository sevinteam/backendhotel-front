

import React, { useState, useEffect } from 'react';
import type { User, UserReference, CardInfo, ProfileReservation, PaymentStatus, Traveler, UserLevel } from '../types';
import { TrashIcon, UploadIcon, WalletIcon, CreditCardIcon, TicketIcon, UserIcon, EyeIcon, EyeOffIcon, BankLogoIcon, DefaultAvatarIcon, PaperclipIcon, PlusIcon, DotsVerticalIcon } from './icons';
import CustomSelect, { type SelectOption } from './CustomSelect';
import UserSelectionModal from './UserSelectionModal';
import ProfileImageUploadModal from './ProfileImageUploadModal';
import AddCardModal from './AddCardModal';
import CardDropdown from './CardDropdown';
import TravelerList from './TravelerList';
import AddTravelerModal from './AddTravelerModal';
import ConfirmationModal from './ConfirmationModal';
import UserLevelDropdown from './UserLevelDropdown';
import UserProfileSkeleton from './UserProfileSkeleton';
import UserTicketTab from './UserTicketTab';
import Pagination from './Pagination';
import UserWishlistTab from './UserWishlistTab';


interface UserProfileProps {
  user: User;
  onAdminAvatarChange: (newAvatarUrl: string) => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
  theme: string;
}

// داده‌های نمونه برای لیست رزروهای پروفایل
const profileReservationsData: ProfileReservation[] = [
    { id: 1, trackingCode: 'sfa3152838865', travelerName: 'علیرضا آذرخش آلوچه', dateRange: '۱۴۰۳/۰۶/۲۴ – ۱۴۰۳/۰۶/۲۴', numberOfRooms: '۲ اتاق', numberOfTravelers: '۴ نفر', totalPrice: '۲.۵۰۰.۰۰۰', status: 'در انتظار پرداخت' },
    { id: 2, trackingCode: 'sfa3152838865', travelerName: 'پرهام رحیمی', dateRange: '۱۴۰۳/۰۶/۲۴ – ۱۴۰۳/۰۶/۲۴', numberOfRooms: '۱ اتاق', numberOfTravelers: '۲ نفر', totalPrice: '۲.۵۰۰.۰۰۰', status: 'عدم تایید' },
    { id: 3, trackingCode: 'sfa3152838865', travelerName: 'هادی طایفه کاظمی', dateRange: '۱۴۰۳/۰۶/۲۴ – ۱۴۰۳/۰۶/۲۴', numberOfRooms: '۳ اتاق', numberOfTravelers: '۳ نفر', totalPrice: '۲.۵۰۰.۰۰۰', status: 'پرداخت شده' },
    { id: 4, trackingCode: 'sfa3152838865', travelerName: 'سید باقر موسوی', dateRange: '۱۴۰۳/۰۶/۲۴ – ۱۴۰۳/۰۶/۲۴', numberOfRooms: '۱ اتاق', numberOfTravelers: '۴ نفر', totalPrice: '۲.۵۰۰.۰۰۰', status: 'لغو شده' },
    { id: 5, trackingCode: 'sfa3152838866', travelerName: 'علیرضا آذرخش آلوچه', dateRange: '۱۴۰۳/۰۷/۰۱ – ۱۴۰۳/۰۷/۰۳', numberOfRooms: '۱ اتاق', numberOfTravelers: '۲ نفر', totalPrice: '۱.۸۰۰.۰۰۰', status: 'پرداخت شده' },
    { id: 6, trackingCode: 'sfa3152838867', travelerName: 'هادی طایفه کاظمی', dateRange: '۱۴۰۳/۰۷/۰۵ – ۱۴۰۳/۰۷/۰۸', numberOfRooms: '۲ اتاق', numberOfTravelers: '۳ نفر', totalPrice: '۳.۲۰۰.۰۰۰', status: 'در انتظار پرداخت' },
    { id: 7, trackingCode: 'sfa3152838868', travelerName: 'پرهام رحیمی', dateRange: '۱۴۰۳/۰۷/۱۲ – ۱۴۰۳/۰۷/۱۴', numberOfRooms: '۱ اتاق', numberOfTravelers: '۱ نفر', totalPrice: '۹۵۰.۰۰۰', status: 'لغو شده' },
    { id: 8, trackingCode: 'sfa3152838869', travelerName: 'سید باقر موسوی', dateRange: '۱۴۰۳/۰۷/۱۸ – ۱۴۰۳/۰۷/۲۰', numberOfRooms: '۳ اتاق', numberOfTravelers: '۶ نفر', totalPrice: '۶.۰۰۰.۰۰۰', status: 'پرداخت شده' },
    { id: 9, trackingCode: 'sfa3152838870', travelerName: 'علیرضا آذرخش آلوچه', dateRange: '۱۴۰۳/۰۸/۰۲ – ۱۴۰۳/۰۸/۰۵', numberOfRooms: '۲ اتاق', numberOfTravelers: '۴ نفر', totalPrice: '۴.۱۰۰.۰۰۰', status: 'در انتظار پرداخت' },
];

// داده‌های نمونه برای مسافران
const travelersData: Traveler[] = [
    { id: 1, name: 'علیرضا', familyName: 'آذرخش آلوچه', phone: '۰۹۳۳۳۷۱۱۹۳۱', nationalId: '۵۵۶۵۰۰۰۰۰۱' },
    { id: 2, name: 'هادی', familyName: 'طایفه کاظمی', phone: '۰۹۳۳۳۷۱۱۹۳۱', nationalId: '۵۵۶۵۰۰۰۰۰۱' },
    { id: 3, name: 'علیرضا', familyName: 'علوی', phone: '۰۹۳۳۳۷۱۱۹۳۱', nationalId: '۵۵۶۵۰۰۰۰۰۱' },
    { id: 4, name: 'باقر', familyName: 'موسوی', phone: '۰۹۳۳۳۷۱۱۹۳۱', nationalId: '۵۵۶۵۰۰۰۰۰۱' },
    { id: 5, name: 'علیرضا', familyName: 'نصر اصفهانی', phone: '۰۹۳۳۳۷۱۱۹۳۱', nationalId: '۵۵۶۵۰۰۰۰۰۱' },
    { id: 6, name: 'گوهر', familyName: 'خیراندیش', phone: '۰۹۳۳۳۷۱۱۹۳۱', nationalId: '۵۵۶۵۰۰۰۰۰۱' },
    { id: 7, name: 'آرمان', familyName: 'رمضانی', phone: '۰۹۳۳۳۷۱۱۹۳۱', nationalId: '۵۵۶۵۰۰۰۰۰۱' },
    { id: 8, name: 'حسین', familyName: 'حسینی', phone: '۰۹۳۳۳۷۱۱۹۳۱', nationalId: '۵۵۶۵۰۰۰۰۰۱' },
    { id: 9, name: 'کامران', familyName: 'مولایی', phone: '۰۹۳۳۳۷۱۱۹۳۲', nationalId: '۵۵۶۵۰۰۰۰۰۲' },
    { id: 10, name: 'مریم', familyName: 'رضایی', phone: '۰۹۳۳۳۷۱۱۹۳۳', nationalId: '۵۵۶۵۰۰۰۰۰۳' },
];


// کامپوننت برای نشان وضعیت پرداخت
const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
    const styles: Record<PaymentStatus, string> = {
        'در انتظار پرداخت': 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
        'عدم تایید': 'bg-red-700 text-white dark:bg-red-900/60 dark:text-red-300',
        'پرداخت شده': 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
        'لغو شده': 'bg-red-500 text-white dark:bg-red-800/60 dark:text-red-200',
    };
    return (
        <span className={`inline-flex justify-center items-center w-28 px-3 py-1.5 text-xs font-semibold rounded-md ${styles[status] || ''}`}>
            {status}
        </span>
    );
};


// کامپوننت برای یک فیلد قابل ویرایش
const EditableField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  colSpan?: string;
  isTextArea?: boolean;
}> = ({ label, name, value, onChange, colSpan = 'md:col-span-1', isTextArea = false }) => (
  <div className={colSpan}>
    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</label>
    {isTextArea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 min-h-[52px] border border-transparent focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-gray-800 dark:text-gray-200 font-semibold resize-none"
        rows={1}
      />
    ) : (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 min-h-[52px] border border-transparent focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-gray-800 dark:text-gray-200 font-semibold"
      />
    )}
  </div>
);


const UserProfile: React.FC<UserProfileProps> = ({ user, onAdminAvatarChange, onShowToast, theme }) => {
  const tabs = [
    'اطلاعات پروفایل حقیقی',
    'آمار و ارقام',
    'امنیت و دسترسی',
    'پروفایل حقوقی',
    'لیست رزرو ها',
    'لیست مسافران',
    'چت های کاربر',
    'لیست علاقه مندی کاربر',
  ];

  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem(`userProfileTab_${user.id}`);
    if (savedTab && tabs.includes(savedTab)) {
        return savedTab;
    }
    return 'اطلاعات پروفایل حقیقی';
  });

  const [profileAvatar, setProfileAvatar] = useState<string | null>(user.avatar);
  const [uploadModalContext, setUploadModalContext] = useState<'user' | 'admin' | 'companyLogo' | null>(null);
  
  const [formData, setFormData] = useState({
    name: 'زروان',
    familyName: 'علوی',
    nationalId: '۰۱۵۰۰۳۲۸۴۶',
    mobile: '۰۹۳۵۶۹۷۹۵۵۹',
    email: user.email || 'sanatarabadi@yahoo.com',
    postalCode: '۶۲۱۹۸۵۱۹۵۳۶۷۲۸۹۴',
    address: 'تهران، جردن خ. تاج محل',
    userLevel: 'طلایی' as UserLevel,
  });
   const [statsData, setStatsData] = useState({
    totalPoints: '-',
    usedPoints: '-',
    completedReservations: '۴',
    totalPurchase: '۳,۱۵۲,۴۵۳ تومان',
    walletBalance: '۳,۱۵۲,۴۵۳',
  });
  const [securityData, setSecurityData] = useState({
    userAccessLevel: 'فعال',
    otpCode: '۸۸۰۰',
    adminAccess: 'غیرفعال', // 'فعال' or 'غیرفعال'
    adminLevel: 'ادمین بخش مالی',
    adminPassword: '',
    ticketSignature: '',
    adminAvatar: user.avatar,
    selectedSmsPatterns: [
        { id: 1, name: 'پترن شماره ۱' },
    ] as UserReference[],
  });

  const [legalProfileData, setLegalProfileData] = useState({
    companyName: 'زروان',
    postalCode: '۶۷۴۸۱۱۳۴۸۱',
    registrationNumber: '۲۵۶۳۶۳۷۷۶۱',
    economicCode: '۲۵۶۳۶۳۷۷۶۱',
    nationalId: '۲۵۶۳۶۳۷۷۶۱',
    contactNumber: '۰۸۱۶۴۷۶۷۴۸۹',
    email: 'zarvan@gmail.com',
    legalCardNumber: '',
    address: 'تهران، جردن خ. تاج محل',
  });

  const [legalProfileStatus, setLegalProfileStatus] = useState<'بررسی نشده' | 'تایید شده' | 'عدم تایید'>('بررسی نشده');
  const [rejectionReason, setRejectionReason] = useState('');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  
  const [personalCards, setPersonalCards] = useState<CardInfo[]>([
    { id: 1, logo: BankLogoIcon, fullNumber: '6219861922338877', iban: 'IR760620000000203839657007' },
    { id: 2, logo: BankLogoIcon, fullNumber: '6037991122334455', iban: 'IR123420000000203839659876' }
  ]);
  const [selectedPersonalCardId, setSelectedPersonalCardId] = useState<number | null>(1);

  const [legalCards, setLegalCards] = useState<CardInfo[]>([]);
  const [selectedLegalCardId, setSelectedLegalCardId] = useState<number | null>(null);


  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSmsSelectionModalOpen, setIsSmsSelectionModalOpen] = useState(false);
  
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [addCardModalContext, setAddCardModalContext] = useState<'personal' | 'legal' | null>(null);
  const [editingCard, setEditingCard] = useState<CardInfo | null>(null);

  // State for traveler management
  const [travelers, setTravelers] = useState<Traveler[]>(travelersData);
  const [isTravelerModalOpen, setIsTravelerModalOpen] = useState(false);
  const [editingTraveler, setEditingTraveler] = useState<Traveler | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [travelerToDelete, setTravelerToDelete] = useState<Traveler | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State for reservations pagination
  const [reservationsCurrentPage, setReservationsCurrentPage] = useState(1);

  // Simulate loading when user changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [user.id]);

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem(`userProfileTab_${user.id}`, activeTab);
  }, [activeTab, user.id]);


  const handleOpenUploadModal = (context: 'user' | 'admin' | 'companyLogo') => {
    setUploadModalContext(context);
  };
  
  const handleCloseUploadModal = () => {
    setUploadModalContext(null);
  };
  
  const handleSaveProfileImage = (file: File) => {
    const newAvatarUrl = URL.createObjectURL(file);
    if (uploadModalContext === 'user') {
      setProfileAvatar(newAvatarUrl);
    } else if (uploadModalContext === 'admin') {
      setSecurityData(prev => ({...prev, adminAvatar: newAvatarUrl}));
      onAdminAvatarChange(newAvatarUrl);
    } else if (uploadModalContext === 'companyLogo') {
      setCompanyLogo(newAvatarUrl);
    }
  };
  
  const allSmsPatterns: UserReference[] = [
    { id: 1, name: 'پترن شماره ۱' },
    { id: 2, name: 'پترن شماره ۲' },
    { id: 3, name: 'پترن شماره ۳' },
    { id: 4, name: 'پترن شماره ۴' },
    { id: 5, name: 'پترن شماره ۵' },
  ];

  const userAccessLevelOptions: SelectOption[] = [
    { value: 'فعال', label: 'فعال' },
    { value: 'غیر فعال', label: 'غیر فعال' },
  ];

  const adminLevelOptions: SelectOption[] = [
    { value: 'ادمین کل', label: 'ادمین کل', icon: <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" /> },
    { value: 'ادمین بخش مالی', label: 'ادمین بخش مالی', icon: <CreditCardIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" /> },
    { value: 'ادمین تیکت', label: 'ادمین تیکت', icon: <TicketIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" /> },
  ];


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserLevelChange = (level: UserLevel) => {
    setFormData(prev => ({ ...prev, userLevel: level }));
  };

  const handleStatsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStatsData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSecurityDataChange = (field: keyof typeof securityData, value: string | UserReference[]) => {
    setSecurityData(prev => ({ ...prev, [field]: value }));
  };

  const handleLegalProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLegalProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAddCardModal = (context: 'personal' | 'legal') => {
    setEditingCard(null);
    setAddCardModalContext(context);
    setIsAddCardModalOpen(true);
  };

  const handleEditCard = (card: CardInfo, context: 'personal' | 'legal') => {
    setEditingCard(card);
    setAddCardModalContext(context);
    setIsAddCardModalOpen(true);
  };

  const handleDeleteCard = (id: number, context: 'personal' | 'legal') => {
    if (context === 'personal') {
      const remainingCards = personalCards.filter(c => c.id !== id);
      setPersonalCards(remainingCards);
      if (selectedPersonalCardId === id) {
        setSelectedPersonalCardId(remainingCards.length > 0 ? remainingCards[0].id : null);
      }
    } else {
      const remainingCards = legalCards.filter(c => c.id !== id);
      setLegalCards(remainingCards);
      if (selectedLegalCardId === id) {
        setSelectedLegalCardId(remainingCards.length > 0 ? remainingCards[0].id : null);
      }
    }
  };

  const handleSaveCard = (cardData: Omit<CardInfo, 'id' | 'logo'>) => {
    if (editingCard) { // Update
      const updater = (prev: CardInfo[]) => prev.map(c => c.id === editingCard.id ? { ...c, ...cardData } : c);
      if (addCardModalContext === 'personal') setPersonalCards(updater);
      if (addCardModalContext === 'legal') setLegalCards(updater);
    } else { // Add new
      const newCard: CardInfo = { id: Date.now(), logo: BankLogoIcon, ...cardData };
      if (addCardModalContext === 'personal') {
        const isFirstCard = personalCards.length === 0;
        setPersonalCards(prev => [...prev, newCard]);
        if (isFirstCard) setSelectedPersonalCardId(newCard.id);
      } else if (addCardModalContext === 'legal') {
        const isFirstCard = legalCards.length === 0;
        setLegalCards(prev => [...prev, newCard]);
        if (isFirstCard) setSelectedLegalCardId(newCard.id);
      }
    }
  };

  const handleCloseAddCardModal = () => {
    setIsAddCardModalOpen(false);
    setEditingCard(null);
    setAddCardModalContext(null);
  };

  // --- Traveler Management Handlers ---

  const handleOpenAddTravelerModal = () => {
    setEditingTraveler(null);
    setIsTravelerModalOpen(true);
  };

  const handleOpenEditTravelerModal = (traveler: Traveler) => {
    setEditingTraveler(traveler);
    setIsTravelerModalOpen(true);
  };

  const handleSaveTraveler = (travelerData: Omit<Traveler, 'id'>) => {
    if (editingTraveler) {
      // Edit existing traveler
      setTravelers(prev => prev.map(t => t.id === editingTraveler.id ? { ...editingTraveler, ...travelerData } : t));
      onShowToast(`اطلاعات مسافر ${travelerData.name} ${travelerData.familyName} ویرایش شد`, 'success');
    } else {
      // Add new traveler to the beginning of the list
      const newTraveler: Traveler = { id: Date.now(), ...travelerData };
      setTravelers(prev => [newTraveler, ...prev]);
      onShowToast(`مسافر ${travelerData.name} ${travelerData.familyName} اضافه شد`, 'success');
    }
    setIsTravelerModalOpen(false);
  };

  const handleOpenDeleteModal = (traveler: Traveler) => {
    setTravelerToDelete(traveler);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (travelerToDelete) {
      setTravelers(prev => prev.filter(t => t.id !== travelerToDelete.id));
      onShowToast(`مسافر ${travelerToDelete.name} ${travelerToDelete.familyName} حذف شد`, 'success');
    }
    setIsDeleteModalOpen(false);
    setTravelerToDelete(null);
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setReservationsCurrentPage(1); // Reset page on tab change
  };


  const renderContent = () => {
    switch (activeTab) {
    case 'اطلاعات پروفایل حقیقی':
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6 w-full">
          <EditableField label="نام" name="name" value={formData.name} onChange={handleInputChange} />
          <EditableField label="نام خانوادگی" name="familyName" value={formData.familyName} onChange={handleInputChange} />
          <EditableField label="کد ملی" name="nationalId" value={formData.nationalId} onChange={handleInputChange} />
          <EditableField label="شماره موبایل" name="mobile" value={formData.mobile} onChange={handleInputChange} />

          <EditableField label="ایمیل کاربر" name="email" value={formData.email} onChange={handleInputChange} />
          <EditableField label="کد پستی حقیقی" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
          
          <div>
            <UserLevelDropdown 
                value={formData.userLevel}
                onChange={handleUserLevelChange}
            />
          </div>

          <CardDropdown
            label="شماره کارت حقیقی"
            cards={personalCards}
            selectedCardId={selectedPersonalCardId}
            onSelectCard={setSelectedPersonalCardId}
            onOpenAddModal={() => handleOpenAddCardModal('personal')}
            onEdit={(card) => handleEditCard(card, 'personal')}
            onDelete={(id) => handleDeleteCard(id, 'personal')}
          />
          
          <EditableField label="آدرس" name="address" value={formData.address} onChange={handleInputChange} colSpan="md:col-span-4" isTextArea={true}/>
          
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">عکس پروفایل شما</label>
            <div className="flex items-center gap-4">
              {profileAvatar ? (
                  <img src={profileAvatar} alt={user.name} className="w-14 h-14 rounded-lg object-cover" />
              ) : (
                  <DefaultAvatarIcon className="w-14 h-14" />
              )}
              <div>
                <button
                  onClick={() => handleOpenUploadModal('user')}
                  className="flex items-center gap-2 bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-violet-200 dark:hover:bg-violet-900 transition-colors">
                  <UploadIcon className="w-5 h-5" />
                  <span>آپلود عکس</span>
                </button>
                <p className="text-xs text-gray-400 mt-2">* حداکثر حجم ۱۰ مگابایت می باشد.</p>
              </div>
            </div>
          </div>
        </div>
      );
    case 'آمار و ارقام':
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">امتیاز کلی باشگاه مشتریان</label>
              <input
                type="text"
                name="totalPoints"
                value={statsData.totalPoints}
                onChange={handleStatsInputChange}
                className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 min-h-[52px] border border-transparent focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-gray-800 dark:text-gray-200 font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">امتیازهای استفاده شده</label>
              <input
                type="text"
                name="usedPoints"
                value={statsData.usedPoints}
                onChange={handleStatsInputChange}
                className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 min-h-[52px] border border-transparent focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-gray-800 dark:text-gray-200 font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">تعداد رزروها انجام شده</label>
              <input
                type="text"
                readOnly
                value={statsData.completedReservations}
                className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 min-h-[52px] border border-transparent outline-none text-gray-800 dark:text-gray-200 font-semibold cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">مبلغ کل خرید</label>
              <input
                type="text"
                readOnly
                value={statsData.totalPurchase}
                className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 min-h-[52px] border border-transparent outline-none text-gray-800 dark:text-gray-200 font-semibold cursor-not-allowed"
              />
            </div>
          </div>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">موجودی کیف پول کاربر</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-grow">
                <input
                  type="text"
                  name="walletBalance"
                  value={statsData.walletBalance}
                  onChange={handleStatsInputChange}
                  className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 pr-10 min-h-[52px] border border-transparent focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-gray-800 dark:text-gray-200 font-semibold text-right"
                />
                <WalletIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"/>
              </div>
              <button className="bg-[#353535] dark:bg-gray-800 border border-transparent dark:border-gray-600 text-white font-semibold py-3 px-6 rounded-lg">
                تومان
              </button>
            </div>
          </div>
        </div>
      );
    case 'امنیت و دسترسی':
      return (
        <>
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 w-full items-start">
                    {/* وضعیت سطح دسترسی کاربر */}
                    <CustomSelect
                        label="وضعیت سطح دسترسی کاربر"
                        options={userAccessLevelOptions}
                        value={securityData.userAccessLevel}
                        onChange={(value) => handleSecurityDataChange('userAccessLevel', value)}
                    />
                    {/* کد ارسالی OTP */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">کد ارسالی OTP</label>
                        <input
                            type="text"
                            readOnly
                            value={securityData.otpCode}
                            className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-3 min-h-[52px] border border-transparent outline-none text-gray-800 dark:text-gray-200 font-semibold cursor-not-allowed"
                        />
                    </div>
                    {/* دسترسی ادمین برای کاربر */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">دسترسی ادمین برای کاربر</label>
                        <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1 w-48">
                            <button
                                onClick={() => handleSecurityDataChange('adminAccess', 'غیرفعال')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                                securityData.adminAccess === 'غیرفعال'
                                    ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 shadow'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                غیرفعال
                            </button>
                            <button
                                onClick={() => handleSecurityDataChange('adminAccess', 'فعال')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                                securityData.adminAccess === 'فعال'
                                    ? 'bg-green-500 text-white shadow'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                فعال
                            </button>
                        </div>
                    </div>
                </div>

                {securityData.adminAccess === 'فعال' && (
                    <div className="pt-8 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 w-full items-start">
                        {/* سطح دسترسی ادمین */}
                        <CustomSelect
                            label="سطح دسترسی ادمین"
                            options={adminLevelOptions}
                            value={securityData.adminLevel}
                            onChange={(value) => handleSecurityDataChange('adminLevel', value)}
                        />

                        {/* رمز عبور پنل ادمین */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">رمز عبور پنل ادمین</label>
                            <div className="relative">
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    value={securityData.adminPassword}
                                    onChange={(e) => handleSecurityDataChange('adminPassword', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg py-3 pr-3 pl-10 min-h-[52px] border border-transparent focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-gray-800 dark:text-gray-200 font-semibold text-center"
                                    placeholder="********"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordVisible(prev => !prev)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                >
                                    {isPasswordVisible ? (
                                        <EyeIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeOffIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        {/* پترن پیامکی */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">پترن پیامکی</label>
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1.5 min-h-[52px] border border-transparent">
                                <span className="text-gray-800 dark:text-gray-200 font-semibold px-2 text-sm truncate">
                                    {securityData.selectedSmsPatterns.length > 0 ? securityData.selectedSmsPatterns.map(p => p.name).join('، ') : 'پترنی انتخاب نشده'}
                                </span>
                                <button onClick={() => setIsSmsSelectionModalOpen(true)} className="bg-violet-600 text-white font-semibold py-2 px-4 rounded-md text-sm shadow-md hover:bg-violet-700">
                                مشاهده
                                </button>
                            </div>
                        </div>
                        
                        {/* امضا ادمین برای تیکت */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">امضا ادمین برای تیکت</label>
                            <textarea
                                value={securityData.ticketSignature}
                                onChange={(e) => handleSecurityDataChange('ticketSignature', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 min-h-[120px] border border-transparent focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-gray-800 dark:text-gray-200 font-semibold resize-none"
                                placeholder="لطفا متن توضیحات خود را در باکس وارد نمایید"
                            />
                        </div>
                        
                        {/* عکس پروفایل ادمین */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">عکس پروفایل ادمین</label>
                            <div className="flex items-center gap-4">
                                {securityData.adminAvatar ? (
                                    <img src={securityData.adminAvatar} alt="Admin Avatar" className="w-14 h-14 rounded-full object-cover" />
                                ) : (
                                    <DefaultAvatarIcon className="w-14 h-14 rounded-full" />
                                )}
                                <div>
                                    <button onClick={() => handleOpenUploadModal('admin')} className="flex items-center gap-2 bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-violet-200 dark:hover:bg-violet-900 transition-colors">
                                        <UploadIcon className="w-5 h-5" />
                                        <span>آپلود عکس</span>
                                    </button>
                                    <p className="text-xs text-gray-400 mt-2">* حداکثر حجم ۱۰ مگابایت می باشد.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isSmsSelectionModalOpen && (
                <UserSelectionModal
                    isOpen={isSmsSelectionModalOpen}
                    onClose={() => setIsSmsSelectionModalOpen(false)}
                    title="لیست پترن پیامکی"
                    listTitle="لیست پترن های پیامک"
                    allUsers={allSmsPatterns}
                    selectedUsers={securityData.selectedSmsPatterns}
                    onConfirm={(patterns) => {
                        handleSecurityDataChange('selectedSmsPatterns', patterns);
                        setIsSmsSelectionModalOpen(false);
                    }}
                    showAvatars={false}
                />
            )}
        </>
      );
    case 'پروفایل حقوقی': {
      const getStatusButtonClass = (status: 'بررسی نشده' | 'تایید شده' | 'عدم تایید') => {
        const baseClass = "font-semibold py-2.5 px-6 rounded-lg text-sm whitespace-nowrap transition-colors flex-grow sm:flex-grow-0";
        if (status === legalProfileStatus) {
            if (status === 'تایید شده') return `${baseClass} bg-[#10B981] text-white`;
            if (status === 'عدم تایید') return `${baseClass} bg-[#EF4444] text-white`;
            if (status === 'بررسی نشده') return `${baseClass} bg-gray-500 text-white`;
        }
        return `${baseClass} bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500`;
      };
      return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                <EditableField label="نام شرکت" name="companyName" value={legalProfileData.companyName} onChange={handleLegalProfileInputChange} />
                <EditableField label="کد پستی شرکت" name="postalCode" value={legalProfileData.postalCode} onChange={handleLegalProfileInputChange} />
                <EditableField label="شماره ثبت شرکت" name="registrationNumber" value={legalProfileData.registrationNumber} onChange={handleLegalProfileInputChange} />
                <EditableField label="کد اقتصادی شرکت" name="economicCode" value={legalProfileData.economicCode} onChange={handleLegalProfileInputChange} />
                <EditableField label="شناسه ملی شرکت" name="nationalId" value={legalProfileData.nationalId} onChange={handleLegalProfileInputChange} />
                <EditableField label="تلفن تماس شرکت" name="contactNumber" value={legalProfileData.contactNumber} onChange={handleLegalProfileInputChange} />
                
                <EditableField label="پست الکترونیک (ایمیل) شرکت" name="email" value={legalProfileData.email} onChange={handleLegalProfileInputChange} />
                
                <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">مدارک حقوقی شرکت</label>
                    <button className="w-full flex items-center justify-start gap-2 p-3 min-h-[52px] rounded-lg text-sm font-semibold bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                       <PaperclipIcon className="w-5 h-5" />
                       <span>فایل های ضمیمه شده</span>
                    </button>
                </div>

                <div>
                    <CardDropdown
                      label="شماره کارت حقوقی"
                      cards={legalCards}
                      selectedCardId={selectedLegalCardId}
                      onSelectCard={setSelectedLegalCardId}
                      onOpenAddModal={() => handleOpenAddCardModal('legal')}
                      onEdit={(card) => handleEditCard(card, 'legal')}
                      onDelete={(id) => handleDeleteCard(id, 'legal')}
                    />
                </div>

                <div className="md:col-span-3">
                    <EditableField label="آدرس شرکت" name="address" value={legalProfileData.address} onChange={handleLegalProfileInputChange} isTextArea={true} />
                </div>
                
                <div className="md:col-span-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">لوگوی شرکت</label>
                        <div className="flex items-center gap-4">
                            {companyLogo ? (
                               <img src={companyLogo} alt="Company Logo" className="w-20 h-20 rounded-xl object-cover bg-gray-100 dark:bg-gray-700 shadow-md" />
                            ) : (
                                <DefaultAvatarIcon className="w-20 h-20" />
                            )}
                            <div>
                                <button onClick={() => handleOpenUploadModal('companyLogo')} className="flex items-center gap-2 bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-violet-200 dark:hover:bg-violet-900 transition-colors">
                                    <UploadIcon className="w-5 h-5" />
                                    <span>آپلود لوگو</span>
                                </button>
                                <p className="text-xs text-gray-400 mt-2">* حداکثر حجم ۱۰ مگابایت می باشد.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">وضعیت</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button onClick={() => setLegalProfileStatus('بررسی نشده')} className={getStatusButtonClass('بررسی نشده')}>بررسی نشده</button>
                    <button onClick={() => setLegalProfileStatus('تایید شده')} className={getStatusButtonClass('تایید شده')}>تایید شده</button>
                    <button onClick={() => setLegalProfileStatus('عدم تایید')} className={getStatusButtonClass('عدم تایید')}>عدم تایید</button>
                </div>
                {legalProfileStatus === 'عدم تایید' && (
                    <div className="mt-4">
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="علت عدم تایید پروفایل حقوقی را در باکس زیر وارد نمایید."
                            rows={4}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200 resize-none text-sm"
                        />
                    </div>
                )}
            </div>
        </div>
      );
    }
    case 'لیست رزرو ها': {
      const reservationsPerPage = 8;
      const totalPages = Math.ceil(profileReservationsData.length / reservationsPerPage);
      const paginatedReservations = profileReservationsData.slice(
        (reservationsCurrentPage - 1) * reservationsPerPage,
        reservationsCurrentPage * reservationsPerPage
      );
      return (
          <div className="flex-1 flex flex-col">
            {/* Desktop Table */}
            <div className="flex-1 overflow-x-auto hidden lg:block">
                <table className="w-full min-w-[900px] text-sm text-right">
                    <thead className="text-gray-500 dark:text-gray-400">
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                            <th className="p-3 font-semibold text-center rounded-r-lg">کد پیگیری</th>
                            <th className="p-3 font-semibold text-center">نام مسافر</th>
                            <th className="p-3 font-semibold text-center">تاریخ ورود / خروج</th>
                            <th className="p-3 font-semibold text-center">تعداد اتاق</th>
                            <th className="p-3 font-semibold text-center">تعداد مسافران</th>
                            <th className="p-3 font-semibold text-center">مجموع قیمت</th>
                            <th className="p-3 font-semibold text-center">وضعیت پرداخت</th>
                            <th className="p-3 font-semibold rounded-l-lg"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {paginatedReservations.map((res) => (
                            <tr key={res.id} className="text-gray-700 dark:text-gray-300">
                                <td className="p-4 text-center">{res.trackingCode}</td>
                                <td className="p-4 font-semibold text-gray-800 dark:text-gray-200 text-center">{res.travelerName}</td>
                                <td className="p-4 text-center">{res.dateRange}</td>
                                <td className="p-4 text-center">{res.numberOfRooms}</td>
                                <td className="p-4 text-center">{res.numberOfTravelers}</td>
                                <td className="p-4 text-center">{res.totalPrice}</td>
                                <td className="p-4 text-center">
                                    <PaymentStatusBadge status={res.status} />
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="bg-[#353535] dark:bg-gray-600 text-white font-semibold py-1.5 px-5 rounded-md text-xs whitespace-nowrap hover:bg-opacity-90">
                                            مشاهده
                                        </button>
                                        <button className="p-2 text-gray-500 dark:text-gray-400">
                                            <DotsVerticalIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
                 {paginatedReservations.map((res) => (
                    <div key={res.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{res.travelerName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{res.trackingCode}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs border-t border-gray-200 dark:border-gray-600 pt-3">
                            <div><strong className="text-gray-500 dark:text-gray-400">تاریخ:</strong> {res.dateRange}</div>
                            <div><strong className="text-gray-500 dark:text-gray-400">قیمت:</strong> {res.totalPrice}</div>
                            <div><strong className="text-gray-500 dark:text-gray-400">اتاق:</strong> {res.numberOfRooms}</div>
                            <div><strong className="text-gray-500 dark:text-gray-400">مسافران:</strong> {res.numberOfTravelers}</div>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-3">
                            <PaymentStatusBadge status={res.status} />
                            <div className="flex items-center gap-2">
                                <button className="bg-[#353535] dark:bg-gray-600 text-white font-semibold py-1.5 px-5 rounded-md text-xs">
                                    مشاهده
                                </button>
                                <button className="p-2 text-gray-500 dark:text-gray-400">
                                    <DotsVerticalIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    </div>
                 ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-auto pt-6">
                  <Pagination
                      currentPage={reservationsCurrentPage}
                      totalPages={totalPages}
                      onPageChange={setReservationsCurrentPage}
                  />
              </div>
            )}
          </div>
      );
    }
    case 'لیست مسافران':
      return <TravelerList travelers={travelers} onEdit={handleOpenEditTravelerModal} onDelete={handleOpenDeleteModal} />;
    case 'چت های کاربر':
      return <UserTicketTab user={user} theme={theme} />;
    case 'لیست علاقه مندی کاربر':
      return <UserWishlistTab user={user} onShowToast={onShowToast} />;
    default:
    // محتوای جایگزین برای تب‌های دیگر
    return <div className="flex-1 flex items-center justify-center text-center text-gray-500 dark:text-gray-400">محتوای این بخش در حال آماده سازی است.</div>;
    }
  };
  
  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  return (
    <>
      <div className="flex-1 min-h-0 flex flex-col gap-6">
        {/* کارت هدر پروفایل */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          {/* User Info */}
          <div className="flex items-center">
              {profileAvatar ? (
                  <img
                  src={profileAvatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg z-10"
                  />
              ) : (
                  <DefaultAvatarIcon className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg z-10" />
              )}
              <div className="bg-[#353535] dark:bg-gray-900 text-white pr-12 pl-6 py-3 rounded-2xl font-bold text-lg shadow-lg flex items-center h-14 -mr-10">
              <span>{user.name}</span>
              </div>
          </div>

          {/* Delete Button */}
          <button className="flex items-center gap-3 text-sm font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 w-full sm:w-auto justify-center text-gray-500 dark:text-gray-400">
              <span>حذف پروفایل کاربر</span>
              <TrashIcon className="w-5 h-5" />
          </button>
        </div>


        {/* کارت محتوای پروفایل */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex-1 flex flex-col min-h-0">
          <div className="p-6 flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* تب‌ها و دکمه شرطی */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center overflow-x-auto hide-scrollbar gap-6 whitespace-nowrap w-full sm:w-auto">
                    {tabs.map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => handleTabChange(tab)}
                            className="relative pb-4 pt-1 text-sm font-semibold transition-colors group"
                        >
                            <span className={activeTab === tab 
                                ? 'text-gray-800 dark:text-gray-100 font-bold' 
                                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                            }>
                                {tab}
                            </span>
                            {activeTab === tab && (
                                <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#353535] dark:bg-gray-300"></div>
                            )}
                        </button>
                    ))}
                </div>
                {(activeTab === 'لیست رزرو ها' || activeTab === 'لیست مسافران') && (
                    <div className="w-full sm:w-auto sm:pb-3">
                        <button
                            onClick={activeTab === 'لیست مسافران' ? handleOpenAddTravelerModal : undefined}
                            className="flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-violet-700 transition-colors w-full"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span>{activeTab === 'لیست رزرو ها' ? 'ثبت رزرو جدید' : 'افزودن مسافر'}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* محتوای تب فعال */}
            <div className="pt-8 flex-1 flex flex-col min-h-0">
              {renderContent()}
            </div>

            {/* فوتر و دکمه ذخیره */}
            {(activeTab === 'اطلاعات پروفایل حقیقی' || activeTab === 'آمار و ارقام' || activeTab === 'امنیت و دسترسی' || activeTab === 'پروفایل حقوقی') && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-left">
                    <button className="bg-[#353535] dark:bg-gray-700 text-white font-bold py-3 px-10 rounded-lg hover:bg-opacity-90 transition-colors">
                        ذخیره
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
      <ProfileImageUploadModal
        isOpen={!!uploadModalContext}
        onClose={handleCloseUploadModal}
        onSave={handleSaveProfileImage}
        title={
            uploadModalContext === 'admin' ? 'آپلود عکس پروفایل ادمین' 
            : uploadModalContext === 'companyLogo' ? 'آپلود لوگوی شرکت'
            : 'آپلود عکس پروفایل حقیقی'
        }
      />
       <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={handleCloseAddCardModal}
        onSave={handleSaveCard}
        cardToEdit={editingCard}
      />
      <AddTravelerModal
        isOpen={isTravelerModalOpen}
        onClose={() => setIsTravelerModalOpen(false)}
        onSave={handleSaveTraveler}
        travelerToEdit={editingTraveler}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="آیا از حذف این مسافر مطمئن هستید؟"
        message={
            <>
            آیا از حذف مسافر <strong className="font-bold text-gray-700 dark:text-gray-300">{travelerToDelete?.name} {travelerToDelete?.familyName}</strong> مطمئن هستید؟
            </>
        }
      />
    </>
  );
};

export default UserProfile;