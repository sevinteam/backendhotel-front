'use client';

import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  Search,
  Eye,
  Monitor,
  Smartphone,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Tag,
  Globe,
} from 'lucide-react';
import { HotelItem, HotelSeoData } from './hotelTypes';

interface YoastSeoPanelProps {
  hotel: HotelItem;
  onChangeSeo: (seo: HotelSeoData) => void;
}

type CheckStatus = 'green' | 'amber' | 'red';

interface SeoFactor {
  id: string;
  title: string;
  description: string;
  status: CheckStatus;
  points: number;
  maxPoints: number;
}

const YoastSeoPanel: React.FC<YoastSeoPanelProps> = ({ hotel, onChangeSeo }) => {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [filterStatus, setFilterStatus] = useState<'all' | CheckStatus>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const seo = hotel.seo;
  const effectiveTitle = seo.metaTitle.trim() || hotel.name.trim() || 'عنوان صفحه هتل';
  const effectiveDescription =
    seo.metaDescription.trim() ||
    hotel.description.trim().slice(0, 155) ||
    'توضیحات متای هتل جهت نمایش در نتایج جستجوی گوگل در این بخش قرار می‌گیرد.';
  const effectiveSlug = hotel.slug.trim() || 'hotel-slug';

  const updateField = <K extends keyof HotelSeoData>(key: K, value: HotelSeoData[K]) => {
    onChangeSeo({ ...seo, [key]: value });
  };

  const analysis = useMemo(() => {
    const keyphrase = seo.focusKeyphrase.trim();
    const keyphraseWords = keyphrase ? keyphrase.split(/\s+/).filter(Boolean) : [];
    const titleText = effectiveTitle;
    const descText = effectiveDescription;
    const bodyText = `${hotel.description} ${hotel.extraDescription}`.trim();
    const wordCount = bodyText ? bodyText.split(/\s+/).filter(Boolean).length : 0;
    const titleLen = seo.metaTitle.trim().length;
    const descLen = seo.metaDescription.trim().length;

    const containsKeyphrase = (text: string) => {
      if (!keyphrase) return false;
      const normalizedText = text.toLowerCase();
      if (normalizedText.includes(keyphrase.toLowerCase())) return true;
      if (keyphraseWords.length > 1) {
        const matched = keyphraseWords.filter(w => normalizedText.includes(w.toLowerCase()));
        return matched.length >= Math.ceil(keyphraseWords.length * 0.6);
      }
      return false;
    };

    const factors: SeoFactor[] = [
      {
        id: 'keyphrase-set',
        title: 'کلمه کلیدی کانونی هتل (Focus Keyphrase)',
        description: keyphrase
          ? `کلمه کلیدی «${keyphrase}» به‌درستی تنظیم شده و آماده ارزیابی در تمامی بخش‌هاست.`
          : 'هنوز کلمه کلیدی کانونی تعیین نشده است. یک عبارت جستجوی اصلی برای این هتل وارد کنید.',
        status: keyphrase.length >= 3 ? 'green' : 'red',
        points: keyphrase.length >= 3 ? 10 : 0,
        maxPoints: 10,
      },
      {
        id: 'keyphrase-title',
        title: 'کلمه کلیدی در عنوان سئو هتل',
        description: !keyphrase
          ? 'پس از تعیین کلمه کلیدی کانونی، وجود آن در عنوان سئو بررسی می‌شود.'
          : containsKeyphrase(titleText)
          ? 'کلمه کلیدی کانونی یا بخش اصلی آن در عنوان سئو درج شده است.'
          : 'کلمه کلیدی کانونی در عنوان متای سئو وجود ندارد. افزودن آن نرخ کلیک (CTR) را افزایش می‌دهد.',
        status: !keyphrase ? 'amber' : containsKeyphrase(titleText) ? 'green' : 'red',
        points: !keyphrase ? 0 : containsKeyphrase(titleText) ? 10 : 0,
        maxPoints: 10,
      },
      {
        id: 'keyphrase-title-start',
        title: 'موقعیت کلمه کلیدی در ابتدای عنوان',
        description: !keyphrase
          ? 'کلمه کلیدی کانونی برای بررسی موقعیت در عنوان وارد نشده است.'
          : titleText.toLowerCase().indexOf(keyphrase.toLowerCase()) >= 0 &&
            titleText.toLowerCase().indexOf(keyphrase.toLowerCase()) <= 18
          ? 'کلمه کلیدی در ابتدای عنوان قرار دارد که بیشترین تاثیر را در رتبه‌بندی گوگل دارد.'
          : containsKeyphrase(titleText)
          ? 'کلمه کلیدی در عنوان وجود دارد؛ قرار دادن آن در ابتدای عنوان اثرگذاری بیشتری دارد.'
          : 'عبارت کانونی در نیمه اول عنوان سئو دیده نمی‌شود.',
        status:
          !keyphrase
            ? 'amber'
            : titleText.toLowerCase().indexOf(keyphrase.toLowerCase()) >= 0 &&
              titleText.toLowerCase().indexOf(keyphrase.toLowerCase()) <= 18
            ? 'green'
            : 'amber',
        points:
          keyphrase &&
          titleText.toLowerCase().indexOf(keyphrase.toLowerCase()) >= 0 &&
          titleText.toLowerCase().indexOf(keyphrase.toLowerCase()) <= 18
            ? 8
            : containsKeyphrase(titleText)
            ? 4
            : 0,
        maxPoints: 8,
      },
      {
        id: 'title-length',
        title: 'طول عنوان سئو (SEO Title Length)',
        description:
          titleLen >= 35 && titleLen <= 65
            ? `طول عنوان (${titleLen} کاراکتر) در بازه بهینه گوگل (۳۵ تا ۶۵ کاراکتر) است.`
            : titleLen === 0
            ? 'عنوان متای سئو خالی است و به‌طور خودکار از نام هتل استفاده می‌شود.'
            : titleLen < 35
            ? `طول عنوان (${titleLen} کاراکتر) کوتاه است. پیشنهاد می‌شود بین ۳۵ تا ۶۵ کاراکتر باشد.`
            : `طول عنوان (${titleLen} کاراکتر) طولانی است و ممکن است در نتایج گوگل بریده شود.`,
        status: titleLen >= 35 && titleLen <= 65 ? 'green' : titleLen > 0 ? 'amber' : 'red',
        points: titleLen >= 35 && titleLen <= 65 ? 10 : titleLen > 0 ? 5 : 0,
        maxPoints: 10,
      },
      {
        id: 'slug-quality',
        title: 'بهینه‌سازی پیوند یکتا (Slug)',
        description:
          /^[a-z0-9-]+$/i.test(effectiveSlug) && effectiveSlug.length >= 3
            ? `پیوند یکتای «${effectiveSlug}» استاندارد، کوتاه و خوانا برای موتورهای جستجو است.`
            : 'اسلاگ هتل باید کوتاه، لاتین و با خط تیره (-) جدا شده باشد (مثال: mehregan-hotel).',
        status: /^[a-z0-9-]+$/i.test(effectiveSlug) && effectiveSlug.length >= 3 ? 'green' : 'amber',
        points: /^[a-z0-9-]+$/i.test(effectiveSlug) && effectiveSlug.length >= 3 ? 6 : 3,
        maxPoints: 6,
      },
      {
        id: 'meta-desc-length',
        title: 'طول توضیحات متا (Meta Description)',
        description:
          descLen >= 110 && descLen <= 160
            ? `طول توضیحات متا (${descLen} کاراکتر) در محدوده استاندارد (۱۱۰ تا ۱۶۰ کاراکتر) قرار دارد.`
            : descLen === 0
            ? 'توضیحات متا وارد نشده است. نوشتن یک توضیح جذاب نرخ کلیک کاربران را بالا می‌برد.'
            : descLen < 110
            ? `طول توضیحات متا (${descLen} کاراکتر) کمی کوتاه است (ایده‌آل: ۱۱۰ تا ۱۶۰ کاراکتر).`
            : `طول توضیحات متا (${descLen} کاراکتر) بیش از ۱۶۰ کاراکتر است و در موبایل خلاصه می‌شود.`,
        status: descLen >= 110 && descLen <= 160 ? 'green' : descLen > 0 ? 'amber' : 'red',
        points: descLen >= 110 && descLen <= 160 ? 10 : descLen > 0 ? 5 : 0,
        maxPoints: 10,
      },
      {
        id: 'keyphrase-desc',
        title: 'کلمه کلیدی در توضیحات متا',
        description: !keyphrase
          ? 'کلمه کلیدی کانونی برای بررسی در توضیحات متا وارد نشده است.'
          : containsKeyphrase(descText)
          ? 'عبارت کانونی در توضیحات متا به‌صورت طبیعی به‌کار رفته و در گوگل بولد می‌شود.'
          : 'کلمه کلیدی در توضیحات متا یافت نشد؛ بهتر است حداقل یک بار در توضیحات متا ذکر شود.',
        status: !keyphrase ? 'amber' : containsKeyphrase(descText) ? 'green' : 'amber',
        points: keyphrase && containsKeyphrase(descText) ? 8 : 2,
        maxPoints: 8,
      },
      {
        id: 'content-length',
        title: 'غنای محتوا و توضیحات هتل (Content Depth)',
        description:
          wordCount >= 80
            ? `توضیحات هتل دارای ${wordCount} کلمه است که محتوای غنی و کاملی برای ایندکس محسوب می‌شود.`
            : wordCount >= 30
            ? `توضیحات هتل ${wordCount} کلمه دارد؛ برای رتبه بهتر پیشنهاد می‌شود حداقل ۸۰ کلمه بنویسید.`
            : `توضیحات هتل بسیار کوتاه (${wordCount} کلمه) است و نیاز به تکمیل دارد.`,
        status: wordCount >= 80 ? 'green' : wordCount >= 30 ? 'amber' : 'red',
        points: wordCount >= 80 ? 10 : wordCount >= 30 ? 5 : 0,
        maxPoints: 10,
      },
      {
        id: 'keyphrase-body',
        title: 'تکرار کلمه کلیدی در متن معرفی هتل',
        description: !keyphrase
          ? 'ابتدا کلمه کلیدی کانونی را مشخص کنید.'
          : containsKeyphrase(bodyText)
          ? 'کلمه کلیدی کانونی در متن توضیحات هتل به شکل طبیعی تکرار شده است.'
          : 'کلمه کلیدی کانونی در متن توضیحات هتل دیده نمی‌شود.',
        status: !keyphrase ? 'amber' : containsKeyphrase(bodyText) ? 'green' : 'red',
        points: keyphrase && containsKeyphrase(bodyText) ? 8 : 0,
        maxPoints: 8,
      },
      {
        id: 'images-check',
        title: 'تصویر شاخص و گالری تصاویر هتل',
        description:
          hotel.mainImage
            ? 'تصویر اصلی هتل ثبت شده و برای نمایش در کارت نتایج و اسکیما هتل آماده است.'
            : 'تصویر اصلی هتل هنوز انتخاب نشده است؛ وجود تصویر واقعی اعتماد کاربران را افزایش می‌دهد.',
        status: hotel.mainImage ? 'green' : 'amber',
        points: hotel.mainImage ? 6 : 2,
        maxPoints: 6,
      },
      {
        id: 'faq-schema',
        title: 'سوالات متداول و اسکیما FAQPage',
        description:
          hotel.faqs.length >= 2
            ? `${hotel.faqs.length} سوال متداول ثبت شده است که باعث نمایش ریچ‌اسنیپت در نتایج گوگل می‌شود.`
            : 'حداقل ۲ سوال متداول درباره موقعیت، ساعت تحویل یا امکانات هتل اضافه کنید.',
        status: hotel.faqs.length >= 2 ? 'green' : hotel.faqs.length === 1 ? 'amber' : 'red',
        points: hotel.faqs.length >= 2 ? 6 : hotel.faqs.length === 1 ? 3 : 0,
        maxPoints: 6,
      },
      {
        id: 'geo-facilities',
        title: 'مختصات مکانی و امکانات رفاهی (Hotel Schema)',
        description:
          hotel.latitude && hotel.longitude && hotel.hotelFacilities.length >= 5
            ? 'مختصات جغرافیایی و امکانات رفاهی به‌طور کامل جهت اسکیما Hotel در گوگل ثبت شده است.'
            : 'برای تکمیل اسکیمای هتل، مختصات مکانی و حداقل ۵ مورد امکانات رفاهی را ثبت کنید.',
        status:
          hotel.latitude && hotel.longitude && hotel.hotelFacilities.length >= 5
            ? 'green'
            : 'amber',
        points:
          hotel.latitude && hotel.longitude && hotel.hotelFacilities.length >= 5 ? 4 : 2,
        maxPoints: 4,
      },
      {
        id: 'indexability',
        title: 'وضعیت ایندکس موتورهای جستجو (Indexability)',
        description: !seo.noIndex
          ? 'صفحه هتل برای خزنده‌های گوگل قابل ایندکس (Index) است.'
          : 'تیک جلوگیری از ایندکس (NoIndex) فعال است؛ این هتل در نتایج گوگل نمایش داده نخواهد شد.',
        status: !seo.noIndex ? 'green' : 'red',
        points: !seo.noIndex ? 4 : 0,
        maxPoints: 4,
      },
    ];

    const totalEarned = factors.reduce((sum, f) => sum + f.points, 0);
    const totalPossible = factors.reduce((sum, f) => sum + f.maxPoints, 0);
    const score = Math.round((totalEarned / totalPossible) * 100);

    const counts = {
      all: factors.length,
      green: factors.filter(f => f.status === 'green').length,
      amber: factors.filter(f => f.status === 'amber').length,
      red: factors.filter(f => f.status === 'red').length,
    };

    return { factors, score, counts };
  }, [hotel, seo, effectiveTitle, effectiveDescription, effectiveSlug]);

  const filteredFactors = useMemo(() => {
    if (filterStatus === 'all') return analysis.factors;
    return analysis.factors.filter(f => f.status === filterStatus);
  }, [analysis.factors, filterStatus]);

  const scoreLevel =
    analysis.score >= 75
      ? { label: 'عالی (سبز)', colorClass: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60', dotClass: 'bg-emerald-500' }
      : analysis.score >= 45
      ? { label: 'نیاز به بهبود (نارنجی)', colorClass: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60', dotClass: 'bg-amber-500' }
      : { label: 'ضعیف (قرمز)', colorClass: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60', dotClass: 'bg-red-500' };

  const titleLength = seo.metaTitle.trim().length;
  const titleBarPercent = Math.min(100, Math.round((titleLength / 65) * 100));
  const titleBarColor =
    titleLength >= 35 && titleLength <= 65
      ? 'bg-emerald-500'
      : titleLength > 0
      ? 'bg-amber-500'
      : 'bg-gray-300 dark:bg-gray-600';

  const descLength = seo.metaDescription.trim().length;
  const descBarPercent = Math.min(100, Math.round((descLength / 160) * 100));
  const descBarColor =
    descLength >= 110 && descLength <= 160
      ? 'bg-emerald-500'
      : descLength > 0
      ? 'bg-amber-500'
      : 'bg-gray-300 dark:bg-gray-600';

  return (
    <div className="space-y-6">
      {/* هدر آنالیز هوشمند Yoast SEO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
                آنالیز هوشمند سئو و پیش‌نمایش گوگل (Yoast SEO)
              </h2>
              <span className="text-xs font-medium text-sky-600 dark:text-sky-400">
                · استاندارد سئو هتل
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              بررسی فاکتورهای سرچ کاربران و آمادگی ایندکس اسکیما هتل (Google Hotel Schema)
            </p>
          </div>
        </div>

        {/* باکس امتیاز سئو */}
        <div className={`flex items-center gap-4 px-4 py-2.5 rounded-xl border shrink-0 ${scoreLevel.bgClass}`}>
          <div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">درجه سئو هتل</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-2.5 h-2.5 rounded-full ${scoreLevel.dotClass}`} />
              <span className={`text-xs font-bold ${scoreLevel.colorClass}`}>{scoreLevel.label}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="text-left tabular-nums font-bold text-xl text-gray-800 dark:text-gray-100" dir="ltr">
            {analysis.score}
            <span className="text-xs font-normal text-gray-400">/100</span>
          </div>
        </div>
      </div>

      {/* کلمه کلیدی کانونی */}
      <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-100">
            <Tag className="w-4 h-4 text-[#6644F0]" />
            <span>کلمه کلیدی کانونی هتل (Focus Keyphrase):</span>
          </label>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            واژه‌ای که می‌خواهید هتل در سرچ کاربران رتبه ۱ باشد
          </span>
        </div>
        <input
          type="text"
          value={seo.focusKeyphrase}
          onChange={e => updateField('focusKeyphrase', e.target.value)}
          placeholder="مثال: رزرو هتل آپارتمان مهرگان تهران"
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-medium text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0] transition-all"
        />
      </div>

      {/* پیش‌نمایش در صفحه اول نتایج گوگل (Google Snippet) */}
      <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#6644F0]" />
            <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100">
              پیش‌نمایش در صفحه اول نتایج گوگل (Google Snippet)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              دامنه قرائت: <span className="font-mono text-gray-700 dark:text-gray-200">zarvantrip.com</span>
            </span>
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700/60 rounded-lg">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap ${
                  previewDevice === 'desktop'
                    ? 'bg-white dark:bg-gray-800 text-[#6644F0] shadow-2xs'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>دسکتاپ</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap ${
                  previewDevice === 'mobile'
                    ? 'bg-white dark:bg-gray-800 text-[#6644F0] shadow-2xs'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>موبایل</span>
              </button>
            </div>
          </div>
        </div>

        {/* باکس شبیه‌ساز گوگل */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700/80">
          <div className={previewDevice === 'mobile' ? 'max-w-sm mx-auto bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700' : 'max-w-2xl'}>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1.5" dir="ltr">
              <span className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-950 text-[#6644F0] dark:text-violet-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                Z
              </span>
              <span className="truncate font-mono text-[11px]">
                zarvantrip.com › hotel › {effectiveSlug}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#1a0dab] dark:text-blue-400 leading-snug line-clamp-1">
              {effectiveTitle}
            </h4>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
              {hotel.stars} ستاره · امتیاز {hotel.rating || '—'} · شهر {hotel.city || 'تهران'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1.5 leading-relaxed line-clamp-2">
              {effectiveDescription}
            </p>
          </div>
        </div>
      </div>

      {/* عنوان متا و توضیحات متا با نوار طول بهینه */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-bold text-gray-800 dark:text-gray-100">
              عنوان متای سئو (Meta Title)
            </label>
            <span
              className={`text-[11px] font-bold tabular-nums ${
                titleLength >= 35 && titleLength <= 65
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {titleLength} / 65 کاراکتر
            </span>
          </div>
          <input
            type="text"
            value={seo.metaTitle}
            onChange={e => updateField('metaTitle', e.target.value)}
            placeholder="مثال: رزرو هتل آپارتمان مهرگان تهران | میدان فردوسی | زروان تریپ"
            className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
          />
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-200 ${titleBarColor}`} style={{ width: `${titleBarPercent}%` }} />
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            در صورت خالی بودن، از نام هتل استفاده می‌شود. (طول ایده‌آل: ۳۵ تا ۶۵ کاراکتر)
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-bold text-gray-800 dark:text-gray-100">
              توضیحات متای سئو (Meta Description)
            </label>
            <span
              className={`text-[11px] font-bold tabular-nums ${
                descLength >= 110 && descLength <= 160
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {descLength} / 160 کاراکتر
            </span>
          </div>
          <textarea
            rows={3}
            value={seo.metaDescription}
            onChange={e => updateField('metaDescription', e.target.value)}
            placeholder="توضیحات جذاب و خلاصه درباره امکانات، موقعیت مکانی و نرخ هتل..."
            className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0] resize-y"
          />
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-200 ${descBarColor}`} style={{ width: `${descBarPercent}%` }} />
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            در صورت خالی بودن، از خلاصه توضیحات هتل استفاده خواهد شد. (طول ایده‌آل: ۱۱۰ تا ۱۶۰ کاراکتر)
          </p>
        </div>
      </div>

      {/* کلمات کلیدی و تنظیمات پیشرفته Open Graph / Canonical */}
      <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-800 dark:text-gray-100 block">
            کلمات کلیدی (Keywords)
          </label>
          <input
            type="text"
            value={seo.keywords}
            onChange={e => updateField('keywords', e.target.value)}
            placeholder="هتل آپارتمان مهرگان تهران, رزرو هتل آپارتمان مهرگان, هتل خیابان قرنی تهران..."
            className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
          />
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            کلمات کلیدی را با کاما (،) یا (,) جدا کنید، مثل: هتل، رزرو هتل، هتل‌های تهران
          </p>
        </div>

        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setShowAdvanced(prev => !prev)}
            className="flex items-center justify-between w-full text-xs font-bold text-gray-700 dark:text-gray-200 py-1 hover:text-[#6644F0] transition-colors"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#6644F0]" />
              <span>تنظیمات پیشرفته سئو، Canonical و Open Graph</span>
            </span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                  لینک کانونیکال (Canonical URL)
                </label>
                <input
                  type="url"
                  dir="ltr"
                  value={seo.canonicalUrl}
                  onChange={e => updateField('canonicalUrl', e.target.value)}
                  placeholder="https://zarvantrip.com/hotel/mehregan"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                  عنوان Open Graph (شبکه‌های اجتماعی)
                </label>
                <input
                  type="text"
                  value={seo.ogTitle}
                  onChange={e => updateField('ogTitle', e.target.value)}
                  placeholder="عنوان نمایش هنگام اشتراک‌گذاری در تلگرام و شبکه‌های اجتماعی"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                  توضیحات Open Graph
                </label>
                <textarea
                  rows={2}
                  value={seo.ogDescription}
                  onChange={e => updateField('ogDescription', e.target.value)}
                  placeholder="توضیحات اختصاصی اشتراک‌گذاری صفحه هتل..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                  تصویر پیش‌نمایش (OG Image URL)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={seo.ogImage}
                  onChange={e => updateField('ogImage', e.target.value)}
                  placeholder="/images/hotels/mehregan-og.jpg"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6644F0]"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={seo.noIndex}
                    onChange={e => updateField('noIndex', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#6644F0] focus:ring-[#6644F0]"
                  />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    جلوگیری از ایندکس شدن توسط موتورهای جستجو (NoIndex)
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* چک‌لیست تحلیلی سئو به سبک Yoast SEO */}
      <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#6644F0]" />
            <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100 tabular-nums">
              چک‌لیست تحلیلی سئو به سبک Yoast SEO ({analysis.counts.all} فاکتور)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap tabular-nums ${
                filterStatus === 'all'
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700'
              }`}
            >
              همه ({analysis.counts.all})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('green')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap tabular-nums flex items-center gap-1.5 ${
                filterStatus === 'green'
                  ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-white/70 dark:hover:bg-gray-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              سبز ({analysis.counts.green})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('amber')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap tabular-nums flex items-center gap-1.5 ${
                filterStatus === 'amber'
                  ? 'bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-2xs'
                  : 'text-amber-600 dark:text-amber-400 hover:bg-white/70 dark:hover:bg-gray-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              نارنجی ({analysis.counts.amber})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('red')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap tabular-nums flex items-center gap-1.5 ${
                filterStatus === 'red'
                  ? 'bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 shadow-2xs'
                  : 'text-red-600 dark:text-red-400 hover:bg-white/70 dark:hover:bg-gray-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              قرمز ({analysis.counts.red})
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredFactors.map(factor => {
            const rowStyle =
              factor.status === 'green'
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/50'
                : factor.status === 'amber'
                ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-800/50'
                : 'bg-red-50/40 dark:bg-red-950/20 border-red-200/70 dark:border-red-800/50';

            const pointBadge =
              factor.status === 'green'
                ? 'text-emerald-700 dark:text-emerald-400'
                : factor.status === 'amber'
                ? 'text-amber-700 dark:text-amber-400'
                : 'text-red-700 dark:text-red-400';

            return (
              <div
                key={factor.id}
                className={`flex items-start justify-between gap-4 p-3.5 rounded-xl border ${rowStyle}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {factor.status === 'green' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {factor.status === 'amber' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    {factor.status === 'red' && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100">{factor.title}</h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      {factor.description}
                    </p>
                  </div>
                </div>
                <div className={`text-[11px] font-bold whitespace-nowrap tabular-nums shrink-0 ${pointBadge}`}>
                  +{factor.points} امتیاز
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default YoastSeoPanel;
