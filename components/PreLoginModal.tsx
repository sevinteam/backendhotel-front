import React, { useState, useRef } from 'react';
import { UploadIcon, DefaultAvatarIcon, SpinnerIcon } from './icons';

interface PreLoginModalProps {
  isOpen: boolean;
  onComplete: (data: { avatar: string }) => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

const PreLoginModal: React.FC<PreLoginModalProps> = ({ isOpen, onComplete, onShowToast }) => {
  const [name, setName] = useState('ابوالفضل آبیاری');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!name.trim() || !avatarFile) {
      onShowToast('لطفاً نام و تصویر پروفایل خود را تکمیل کنید.', 'error');
      return;
    }
    setIsLoading(true);
    
    // Simulate saving data and then completing the login
    setTimeout(() => {
      // In a real app, you might upload the file and get back a URL.
      // Here, we just create a local URL for the session.
      onComplete({ avatar: URL.createObjectURL(avatarFile) });
      setIsLoading(false);
    }, 1500);
  };

  if (!isOpen) return null;

  const isFormValid = name.trim() !== '' && avatarFile !== null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[999] transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 m-4 max-w-md w-full text-center transform transition-all duration-300">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">تکمیل اطلاعات پروفایل</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">برای ورود به پنل، لطفا اطلاعات زیر را تکمیل نمایید.</p>
        
        <div className="space-y-6 text-right">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نام و نام خانوادگی</label>
            <input
              id="fullName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عکس پروفایل</label>
            <div 
              onClick={triggerFileInput} 
              className="cursor-pointer flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-violet-500 dark:hover:border-violet-400 transition-colors"
            >
              {avatar ? (
                <img src={avatar} alt="Avatar Preview" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                   <DefaultAvatarIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
              )}
              <div className="text-center flex-grow">
                 <UploadIcon className="mx-auto w-6 h-6 text-gray-400 dark:text-gray-500" />
                 <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                   {avatar ? 'تغییر عکس' : 'آپلود عکس'}
                 </p>
                 <p className="text-xs text-gray-400 dark:text-gray-500">JPG, PNG</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="w-full bg-[#6D28D9] hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px]"
          >
            {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'ورود به پنل'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreLoginModal;
