
import React, { useState } from 'react';
import { ChevronLeftIcon, DocumentTextIcon, ArrowRightIcon } from './icons';
import SiteConfig from './SiteConfig';
import CommunicationSettings from './CommunicationSettings';
import SocialNetworksSettings from './SocialNetworksSettings';
import LicensesSettings from './LicensesSettings';
import EnamadSettings from './EnamadSettings';
import PagesSettings from './PagesSettings';
import FastAccessSettings from './FastAccessSettings';
import HeaderMenuSettings from './HeaderMenuSettings';
import MainPageSlidesSettings from './MainPageSlidesSettings';
import BannersSettings from './BannersSettings';
import CustomerReviewsSettings from './CustomerReviewsSettings';
import AdvantagesSettings from './AdvantagesSettings';
import AboutUsConfig from './AboutUsConfig';

const SettingsCard = ({ title, description, onClick }: { title: string; description: string; onClick?: () => void }) => (
    <div 
        onClick={onClick}
        className={`bg-white dark:bg-gray-700/50 p-6 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 ${onClick ? 'cursor-pointer' : ''}`}
    >
        <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{description}</p>
        </div>
        <ChevronLeftIcon className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />
    </div>
);

interface WebsiteSettingsProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const WebsiteSettings: React.FC<WebsiteSettingsProps> = ({ onShowToast }) => {
    const [activeTab, setActiveTab] = useState('تنظیمات عمومی');
    const [view, setView] = useState<'list' | 'config' | 'communication' | 'social' | 'pages' | 'fast-access' | 'header-menu' | 'licenses' | 'enamad' | 'main-slides' | 'banners' | 'advantages' | 'reviews' | 'about-us-config' | 'about-us-services' | 'contact-us-config' | 'about-us-reasons' | 'coming-soon' | 'pages-faq'>('list');
    const tabs = ['تنظیمات عمومی', 'صفحه اصلی', 'صفحات داخلی', 'قوانین و مقررات'];

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setView('list');
    };

    const renderContent = () => {
        const defaultDescription = "تنظیمات کلی و پایه‌ای سایت مثل عناوین، توضیحات و تنظیمات عمومی هدر و فوتر";

        switch (activeTab) {
            case 'تنظیمات عمومی':
                if (view === 'config') {
                    return <SiteConfig onShowToast={onShowToast} />;
                }
                if (view === 'communication') {
                    return <CommunicationSettings onShowToast={onShowToast} />;
                }
                if (view === 'social') {
                    return <SocialNetworksSettings onShowToast={onShowToast} />;
                }
                if (view === 'licenses') {
                    return <LicensesSettings onShowToast={onShowToast} />;
                }
                if (view === 'enamad') {
                    return <EnamadSettings onShowToast={onShowToast} />;
                }
                if (view === 'pages') {
                    return <PagesSettings onShowToast={onShowToast} />;
                }
                if (view === 'fast-access') {
                    return <FastAccessSettings onShowToast={onShowToast} />;
                }
                if (view === 'header-menu') {
                    return <HeaderMenuSettings onShowToast={onShowToast} />;
                }
                
                // Main list view for General Settings
                if (view === 'list') {
                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Row 1 */}
                            <SettingsCard 
                                title="کانفیگ سایت"
                                description={defaultDescription}
                                onClick={() => setView('config')}
                            />
                            <SettingsCard 
                                title="صفحات"
                                description={defaultDescription}
                                onClick={() => setView('pages')}
                            />
                            
                            {/* Row 2 */}
                            <SettingsCard 
                                title="دسترسی‌های سریع"
                                description={defaultDescription}
                                onClick={() => setView('fast-access')}
                            />
                            <SettingsCard 
                                title="منوی هدر"
                                description={defaultDescription}
                                onClick={() => setView('header-menu')}
                            />

                            {/* Row 3 */}
                            <SettingsCard 
                                title="راه‌های ارتباطی"
                                description={defaultDescription}
                                onClick={() => setView('communication')}
                            />
                            <SettingsCard 
                                title="شبکه‌های اجتماعی"
                                description={defaultDescription}
                                onClick={() => setView('social')}
                            />

                            {/* Row 4 */}
                             <SettingsCard 
                                title="مجوزها"
                                description={defaultDescription}
                                onClick={() => setView('licenses')}
                            />
                             <SettingsCard 
                                title="اینماد"
                                description={defaultDescription}
                                onClick={() => setView('enamad')}
                            />
                        </div>
                    );
                }
                break;

            case 'صفحه اصلی':
                if (view === 'main-slides') {
                    return <MainPageSlidesSettings onShowToast={onShowToast} />;
                }
                if (view === 'banners') {
                    return <BannersSettings onShowToast={onShowToast} />;
                }
                if (view === 'advantages') {
                    return <AdvantagesSettings onShowToast={onShowToast} />;
                }
                if (view === 'reviews') {
                    return <CustomerReviewsSettings onShowToast={onShowToast} />;
                }
                
                if (view === 'list') {
                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SettingsCard 
                                title="اسلایدهای صفحه اصلی"
                                description={defaultDescription}
                                onClick={() => setView('main-slides')}
                            />
                            <SettingsCard 
                                title="بنرها"
                                description={defaultDescription}
                                onClick={() => setView('banners')}
                            />
                            <SettingsCard 
                                title="سکشن مزیت‌های سایت"
                                description={defaultDescription}
                                onClick={() => setView('advantages')}
                            />
                            <SettingsCard 
                                title="نظرات مشتریان"
                                description={defaultDescription}
                                onClick={() => setView('reviews')}
                            />
                        </div>
                    );
                }
                break;

            case 'صفحات داخلی':
                if (view === 'about-us-config') {
                    return <AboutUsConfig onShowToast={onShowToast} />;
                }
                // Placeholder views for Internal Pages sub-sections
                if (view === 'list') {
                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SettingsCard 
                                title="کانفیگ درباره ما"
                                description={defaultDescription}
                                onClick={() => setView('about-us-config')}
                            />
                            <SettingsCard 
                                title="سکشن خدمات درباره ما"
                                description={defaultDescription}
                                onClick={() => setView('about-us-services')}
                            />
                            <SettingsCard 
                                title="کانفیگ تماس با ما"
                                description={defaultDescription}
                                onClick={() => setView('contact-us-config')}
                            />
                            <SettingsCard 
                                title="سکشن دلایل انتخاب درباره ما"
                                description={defaultDescription}
                                onClick={() => setView('about-us-reasons')}
                            />
                            <SettingsCard 
                                title="کامینگ سون"
                                description={defaultDescription}
                                onClick={() => setView('coming-soon')}
                            />
                            <SettingsCard 
                                title="سوالات متداول صفحات"
                                description={defaultDescription}
                                onClick={() => setView('pages-faq')}
                            />
                        </div>
                    );
                }
                break;

            default:
                return (
                    <div className="flex-1 flex items-center justify-center flex-col text-center h-full py-20">
                        <DocumentTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300">صفحه {activeTab}</h2>
                        <p className="text-gray-400 dark:text-gray-500 mt-2 max-w-md">
                        محتوای این صفحه در حال آماده سازی می باشد.
                        </p>
                  </div>
                );
        }

        // Placeholder for sub-views that are not yet implemented
        return (
            <div className="flex-1 flex items-center justify-center flex-col text-center h-full py-20">
                <DocumentTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                    بخش {
                        view === 'main-slides' ? 'اسلایدهای صفحه اصلی' :
                        view === 'banners' ? 'بنرها' :
                        view === 'advantages' ? 'مزیت‌های سایت' :
                        view === 'reviews' ? 'نظرات مشتریان' :
                        view === 'about-us-services' ? 'سکشن خدمات درباره ما' :
                        view === 'contact-us-config' ? 'کانفیگ تماس با ما' :
                        view === 'about-us-reasons' ? 'سکشن دلایل انتخاب درباره ما' :
                        view === 'coming-soon' ? 'کامینگ سون' :
                        view === 'pages-faq' ? 'سوالات متداول صفحات' :
                        view
                    }
                </h2>
                <p className="text-gray-400 dark:text-gray-500 mt-2 max-w-md">
                محتوای این صفحه در حال آماده سازی می باشد.
                </p>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex flex-col h-full min-h-0">
            <div className="p-6 flex flex-col h-full min-h-0">
                {/* Header with Tabs and Back Button */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-gray-200 dark:border-gray-700 pb-0 mb-0 flex-shrink-0">
                     <div className="flex items-center overflow-x-auto hide-scrollbar gap-6 whitespace-nowrap w-full sm:w-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className="relative pb-4 pt-2 text-sm font-semibold transition-colors group"
                            >
                                <span className={activeTab === tab 
                                    ? 'text-gray-800 dark:text-gray-100 font-bold' 
                                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                }>
                                    {tab}
                                </span>
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#353535] dark:bg-gray-300"></div>
                                )}
                            </button>
                        ))}
                    </div>
                    
                    {view !== 'list' && (activeTab === 'تنظیمات عمومی' || activeTab === 'صفحه اصلی' || activeTab === 'صفحات داخلی') && (
                        <div className="w-full sm:w-auto pb-4 sm:pb-3">
                             <button 
                                onClick={() => setView('list')} 
                                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl transition-colors duration-200 hover:bg-[#353535] dark:hover:bg-gray-600 hover:text-white"
                            >
                                <ArrowRightIcon className="w-5 h-5" />
                                <span>بازگشت به صفحه</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Content Area - No internal scroll */}
                <div className="pt-8 flex flex-col flex-1 min-h-0">
                     {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default WebsiteSettings;
