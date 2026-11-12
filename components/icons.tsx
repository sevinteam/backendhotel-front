'use client';

import React from 'react';
import {
  Setting2,
  TaskSquare,
  ShieldTick,
  ShieldCross,
  Refresh,
  Home,
  Home2,
  Bank,
  ClipboardText,
  Profile2User,
  Element3,
  Ticket,
  Notification,
  Tag,
  WalletMoney,
  Card,
  ColorSwatch,
  DocumentText,
  Setting,
  ArrowDown,
  ArrowUp,
  Calendar,
  SearchNormal,
  ArrowLeft,
  ArrowRight,
  Chart,
  DollarCircle,
  TrendUp,
  CloseCircle,
  CloseSquare,
  Menu,
  Trash as TrashIconBase,
  TrushSquare as TrushSquareBase,
  Add,
  Import,
  Paperclip,
  Sun1,
  Moon,
  Microphone,
  Play,
  Pause,
  Send,
  Stop,
  TickCircle,
  TickSquare,
  More,
  Document,
  Edit,
  User,
  Wallet,
  Eye,
  EyeSlash,
  Lock,
  Unlock,
  Box,
  Star,
  Heart,
  Location,
  Call,
  Sms,
  Instagram,
  Global,
  Messages
} from 'iconsax-reactjs';

const createIcon = (IconComponent: any, defaultVariant = 'Linear') => {
  return ({ className = "w-6 h-6", isActive, ...props }: { className?: string; isActive?: boolean; [key: string]: any }) => {
    const variant = isActive ? "Bold" : defaultVariant;
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        <IconComponent size="100%" variant={variant} {...props} />
      </span>
    );
  };
};

export const Setting2Icon = createIcon(Setting2);
export const TaskSquareIcon = createIcon(TaskSquare);

export const ShieldTickIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <span className={`inline-flex items-center justify-center text-emerald-500 ${className}`}>
        <ShieldTick size="100%" variant="Linear" color="#10B981" />
    </span>
);

export const ShieldCrossIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <span className={`inline-flex items-center justify-center text-red-500 ${className}`}>
        <ShieldCross size="100%" variant="Linear" color="#EF4444" />
    </span>
);

export const RefreshIcon = createIcon(Refresh);
export const HomeIcon = createIcon(Home);
export const ChatAltIcon = createIcon(Messages);
export const Home2Icon = createIcon(Home2);
export const BankIcon = createIcon(Bank);
export const ClipboardTextIcon = createIcon(ClipboardText);
export const Profile2UserIcon = createIcon(Profile2User);
export const DashboardIcon = createIcon(Element3);
export const UserGroupIcon = createIcon(Profile2User);
export const TicketIcon = createIcon(Ticket);
export const BellIcon = createIcon(Notification);
export const TagIcon = createIcon(Tag);
export const WalletMoneyIcon = createIcon(WalletMoney);
export const CreditCardIcon = createIcon(Card);
export const ColorSwatchIcon = createIcon(ColorSwatch);
export const DocumentTextIcon = createIcon(DocumentText);
export const CogIcon = createIcon(Setting);
export const ClipboardListIcon = createIcon(ClipboardText);
export const QuestionMarkCircleIcon = createIcon(CloseCircle);
export const ChevronDownIcon = createIcon(ArrowDown);
export const ChevronUpIcon = createIcon(ArrowUp);
export const CalendarIcon = createIcon(Calendar);
export const SearchIcon = createIcon(SearchNormal);
export const ChevronLeftIcon = createIcon(ArrowLeft);
export const ChevronRightIcon = createIcon(ArrowRight);
export const ArrowRightIcon = createIcon(ArrowRight);
export const ArrowLeftIcon = createIcon(ArrowLeft);
export const ChartBarIcon = createIcon(Chart);
export const CurrencyDollarIcon = createIcon(DollarCircle);
export const TrendingUpIcon = createIcon(TrendUp);
export const ChevronDoubleLeftIcon = createIcon(ArrowLeft);
export const ChevronDoubleRightIcon = createIcon(ArrowRight);
export const XIcon = createIcon(CloseSquare);
export const MenuIcon = createIcon(Menu);
export const TrashIcon = createIcon(TrushSquareBase);
export const TrushSquare = createIcon(TrushSquareBase);
export const PlusIcon = createIcon(Add);
export const UploadIcon = createIcon(Import);
export const PaperclipIcon = createIcon(Paperclip);
export const SpinnerIcon = createIcon(Refresh);
export const SunIcon = createIcon(Sun1);
export const MoonIcon = createIcon(Moon);
export const MicrophoneIcon = createIcon(Microphone);
export const PlayIcon = createIcon(Play);
export const PauseIcon = createIcon(Pause);
export const SendIcon = createIcon(Send);
export const StopIcon = createIcon(Stop);
export const CheckCircleIcon = createIcon(TickCircle);
export const XCircleIcon = createIcon(CloseCircle);
export const CheckIcon = createIcon(TickSquare);
export const DotsVerticalIcon = createIcon(More);
export const DownloadIcon = createIcon(Import);

export const FileIcon: React.FC<{ className?: string; type: 'image' | 'pdf' | 'excel' | 'word' | 'other' }> = ({ className = "w-6 h-6", type }) => {
    return (
        <span className={`inline-flex items-center justify-center ${className}`}>
            <Document size="100%" variant="Linear" />
        </span>
    );
};

export const PencilIcon = createIcon(Edit);
export const AtSymbolIcon = createIcon(Global);
export const UserIcon = createIcon(User);
export const WalletIcon = createIcon(Wallet);
export const EyeIcon = createIcon(Eye);
export const EyeOffIcon = createIcon(EyeSlash);

export const BankLogoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <span className={`inline-flex items-center justify-center text-blue-600 ${className}`}>
        <Bank size="100%" variant="Bold" />
    </span>
);

export const DefaultAvatarIcon: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
    <span className={`inline-flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`}>
        <User size="60%" variant="Bold" color="#6B7280" />
    </span>
);

export const LevelBadgeIcon = createIcon(Star);

export const LoginIllustrationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center justify-center text-white/80 ${className}`}>
      <Element3 size="80%" variant="Bulk" />
  </div>
);

export const LogoutIcon = createIcon(CloseCircle);
export const PhotoIcon = createIcon(Document);
export const VideoIcon = createIcon(Document);
export const AudioIcon = createIcon(Microphone);
export const EmojiIcon = createIcon(Star);
export const LockClosedIcon = createIcon(Lock);
export const LockOpenIcon = createIcon(Unlock);
export const SquareIcon = createIcon(Box);
export const StarIcon = createIcon(Star);
export const HeartIcon = createIcon(Heart);
export const LocationMarkerIcon = createIcon(Location);
export const PhoneIcon = createIcon(Call);
export const MailIcon = createIcon(Sms);
export const WhatsAppIcon = createIcon(Instagram);
export const TelegramIcon = createIcon(Global);
export const InstagramIcon = createIcon(Instagram);
export const LinkedInIcon = createIcon(Global);
export const SoroushIcon = createIcon(Global);
export const EitaaIcon = createIcon(Global);
export const RubikaIcon = createIcon(Global);

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <span className={`inline-flex items-center justify-center ${className}`}>
        <Home size="100%" variant="Bold" />
    </span>
);

export const BrandLogoIcon: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
    <img 
        src="/logo.png" 
        alt="Logo" 
        className={`${className} object-cover rounded-xl shadow-md`} 
    />
);