
import React, { useState, useRef } from 'react';
import { UploadIcon, DefaultAvatarIcon, SpinnerIcon } from './icons';

interface SiteConfigProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

// Define the type for the config state
interface ConfigState {
    headerTitle: string;
    headerSubtitle: string;
    headerLogo: string;
    footerTitle: string;
    footerDescription: string;
    footerLogo: string;
    footerCopyright: string;
}

const FormField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string; }> = ({ label, value, onChange, name }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</label>
        <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 min-h-[52px] border border-transparent focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-gray-800 dark:text-gray-200 font-semibold"
        />
    </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; name:string; rows?: number }> = ({ label, value, onChange, name, rows=5 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border-transparent focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-gray-800 dark:text-gray-200 font-semibold resize-none"
        />
    </div>
);

const ImageUpload: React.FC<{ label: string, imagePreview: string | null, onImageSelect: (file: File) => void }> = ({ label, imagePreview, onImageSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</label>
            <div className="flex items-center gap-4">
                {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-14 h-14 rounded-lg object-cover" />
                ) : (
                    <DefaultAvatarIcon className="w-14 h-14" />
                )}
                <div>
                     <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-violet-200 dark:hover:bg-violet-900 transition-colors"
                    >
                        <UploadIcon className="w-5 h-5" />
                        <span>آپلود عکس</span>
                    </button>
                    <p className="text-xs text-gray-400 mt-2">* حداکثر حجم ۱۰ مگابایت می باشد.</p>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
        </div>
    );
};


const SiteConfig: React.FC<SiteConfigProps> = ({ onShowToast }) => {
    const defaultState: ConfigState = {
        headerTitle: 'سفرنامه 24',
        headerSubtitle: 'Agency Zarvan Trip Hotel',
        headerLogo: 'https://randomuser.me/api/portraits/men/11.jpg',
        footerTitle: 'سفرنامه 24',
        footerDescription: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.',
        footerLogo: 'https://randomuser.me/api/portraits/men/12.jpg',
        footerCopyright: 'Agency Zarvan Trip Hotel',
    };

    const [config, setConfig] = useState<ConfigState>(() => {
        try {
            const saved = localStorage.getItem('siteConfig');
            return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
        } catch {
            return defaultState;
        }
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setConfig((prev: ConfigState) => ({ ...prev, [name]: value }));
    };

    const handleImageSelect = (file: File, fieldName: 'headerLogo' | 'footerLogo') => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setConfig((prev: ConfigState) => ({ ...prev, [fieldName]: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            try {
                localStorage.setItem('siteConfig', JSON.stringify(config));
                if (onShowToast) onShowToast('تنظیمات با موفقیت ذخیره شد', 'success');
            } catch (error) {
                console.error(error);
                if (onShowToast) onShowToast('خطا در ذخیره سازی. ممکن است حجم تصاویر زیاد باشد.', 'error');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">کانفیگ سایت</h2>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <FormField label="عنوان هدر" name="headerTitle" value={config.headerTitle} onChange={handleChange} />
                    <FormField label="زیر عنوان هدر" name="headerSubtitle" value={config.headerSubtitle} onChange={handleChange} />
                </div>
                <ImageUpload label="لوگوی هدر" imagePreview={config.headerLogo} onImageSelect={(file) => handleImageSelect(file, 'headerLogo')} />
            </div>

            <hr className="border-gray-200 dark:border-gray-700 !my-8" />
            
            <div className="space-y-6">
                <FormField label="عنوان فوتر" name="footerTitle" value={config.footerTitle} onChange={handleChange} />
                <TextAreaField label="توضیحات فوتر" name="footerDescription" value={config.footerDescription} onChange={handleChange} rows={4}/>
                <ImageUpload label="لوگوی فوتر" imagePreview={config.footerLogo} onImageSelect={(file) => handleImageSelect(file, 'footerLogo')} />
                <FormField label="کپی رایت فوتر" name="footerCopyright" value={config.footerCopyright} onChange={handleChange} />
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4">* متن کپی‌رایت که در پایین فوتر نمایش داده می‌شود.</p>
            </div>
            
            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                 <button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-violet-600 dark:bg-violet-700 text-white font-bold py-3 px-10 rounded-lg hover:bg-violet-700 dark:hover:bg-violet-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isLoading && <SpinnerIcon className="w-5 h-5" />}
                    <span>ذخیره تغییرات</span>
                </button>
            </div>
        </div>
    );
};

export default SiteConfig;
