export interface FacilityOption {
  id: string;
  label: string;
  iconKey?: string;
}

export interface LogoOption {
  id: string;
  label: string;
  imageUrl?: string;
}

export interface PublicTagItem {
  id: string;
  title: string;
}

export interface HotelFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface NearbyPlaceItem {
  id: string;
  title: string;
  distanceMeters: number;
  driveMinutes: number;
  walkMinutes: number;
  lat: string;
  lng: string;
  image?: string;
}

export interface CancellationPenaltyItem {
  id: string;
  percent: number;
  title?: string;
}

export interface RoomPriceRangeItem {
  id: string;
  userLevel: string;
  startDate: string;
  endDate: string;
  buyPrice: number;
  nightlyPrice: number;
  extraPersonPrice: number;
  discountType: 'بدون تخفیف' | 'درصدی' | 'مبلغ ثابت';
  discountValue: number;
  discountExpiry: string;
  discountOnPurchase: boolean;
}

export interface HotelRoomItem {
  id: string;
  name: string;
  boardType: string;
  capacity: number;
  extraCapacity: number;
  currentStock: number;
  capacityNeedsAdmin: number;
  capacityNoAdmin: number;
  loyaltyPoints: number;
  selectedServices: string[];
  description: string;
  rules: string;
  snappRoomId: string;
  isSnappRoom: boolean;
  priceRanges: RoomPriceRangeItem[];
}

export interface HotelSeoData {
  focusKeyphrase: string;
  metaTitle: string;
  keywords: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  noIndex: boolean;
}

export interface HotelItem {
  id: number;
  name: string;
  slug: string;
  city: string;
  logoId: string;
  status: 'منتشر شده' | 'پیش‌نویس';
  isSpecialOffer: boolean;
  isAmazingOffer: boolean;
  isBestSeller: boolean;
  latitude: string;
  longitude: string;
  stars: number;
  rating: number;
  bookingsCount: number;
  type: string;
  floorsCount: number;
  roomsCount: number;
  checkInTime: string;
  checkOutTime: string;
  halfChargeCheckIn: boolean;
  halfChargeCheckOut: boolean;
  tags: string[];
  hotelFacilities: string[];
  roomFacilities: string[];
  mainImage: string;
  galleryImages: string[];
  address: string;
  description: string;
  extraDescription: string;
  rules: string;
  essentialNotes: string;
  isSnapp: boolean;
  syncFromSnapp: boolean;
  snappId: string;
  publicTags: PublicTagItem[];
  seo: HotelSeoData;
  faqs: HotelFaqItem[];
  nearbyPlaces: NearbyPlaceItem[];
  cancellationPenalties: CancellationPenaltyItem[];
  rooms: HotelRoomItem[];
}
