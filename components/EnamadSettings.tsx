
import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from './icons';

interface EnamadSettingsProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const EnamadSettings: React.FC<EnamadSettingsProps> = ({ onShowToast }) => {
    const [enamadCode, setEnamadCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedCode = localStorage.getItem('enamadCode');
        if (savedCode) {
            setEnamadCode(savedCode);
        } else {
            // Default mock data based on the image
            setEnamadCode(`<A Referrerpolicy='origin' Target='_blank' Href='https://Trustseal.Enamad.Ir/?Id=638303&Code=Wm90ClZoIKTdisrKcGFleY2y5sUqIlc'><Img Referrerpolicy='origin' Src='https://Trustseal.Enamad.Ir/Logo.Aspx?Id=638303&Code=Wm90ClZoIKTdisrKcGFleY2y5sUqIlc' Alt='' Style='cursor:Pointer' Code='wm90ClZoIKTdisrKcGFleY2y5sUqIlc'></A>`);
        }
    }, []);

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            localStorage.setItem('enamadCode', enamadCode);
            if (onShowToast) onShowToast('کد اینماد با موفقیت ذخیره شد', 'success');
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex justify-start">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">اینماد</h2>
            </div>

            <div className="space-y-4 flex-1">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">کد اینماد</label>
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 h-full max-h-[400px] flex flex-col">
                    <textarea
                        value={enamadCode}
                        onChange={(e) => setEnamadCode(e.target.value)}
                        className="w-full h-full bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-300 font-mono text-sm leading-relaxed resize-none text-left focus:outline-none"
                        dir="ltr"
                        placeholder="کد اینماد را اینجا وارد کنید..."
                        spellCheck={false}
                    />
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button 
                    onClick={handleSave} 
                    disabled={isLoading}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-12 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                    {isLoading ? <SpinnerIcon className="w-6 h-6 text-white" /> : 'ذخیره تغییرات'}
                </button>
            </div>
        </div>
    );
};

export default EnamadSettings;
