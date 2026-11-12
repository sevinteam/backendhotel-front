
import React, { useState, useEffect } from 'react';
import { XIcon, CheckIcon, WhatsAppIcon, TelegramIcon, InstagramIcon, LinkedInIcon, SoroushIcon, SpinnerIcon, PlusIcon } from './icons';
import IconSelectionModal, { IconOption } from './IconSelectionModal';

export interface SocialNetwork {
    id: number;
    title: string;
    persianTitle: string;
    link: string;
    inFooter: boolean;
    icon: 'whatsapp' | 'telegram' | 'instagram' | 'linkedin' | 'soroush';
}

interface AddSocialNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SocialNetwork, 'id'>) => void;
  networkToEdit: SocialNetwork | null;
}

const socialIcons: IconOption[] = [
    { key: 'whatsapp', name: 'WhatsApp', component: WhatsAppIcon },
    { key: 'telegram', name: 'Telegram', component: TelegramIcon },
    { key: 'instagram', name: 'Instagram', component: InstagramIcon },
    { key: 'linkedin', name: 'LinkedIn', component: LinkedInIcon },
    { key: 'soroush', name: 'Soroush', component: SoroushIcon },
];

const AddSocialNetworkModal: React.FC<AddSocialNetworkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  networkToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [persianTitle, setPersianTitle] = useState('');
  const [link, setLink] = useState('');
  const [inFooter, setInFooter] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState<'whatsapp' | 'telegram' | 'instagram' | 'linkedin' | 'soroush'>('whatsapp');
  const [isLoading, setIsLoading] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  
  const isEditing = !!networkToEdit;

  useEffect(() => {
    if (isOpen) {
      if (networkToEdit) {
        setTitle(networkToEdit.title);
        setPersianTitle(networkToEdit.persianTitle);
        setLink(networkToEdit.link);
        setInFooter(networkToEdit.inFooter);
        setSelectedIcon(networkToEdit.icon);
      } else {
        // Reset form
        setTitle('');
        setPersianTitle('');
        setLink('');
        setInFooter(true);
        setSelectedIcon('whatsapp');
      }
      setIsLoading(false);
    }
  }, [isOpen, networkToEdit]);

  const handleSave = () => {
    if (!title.trim() || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
        onSave({
          title,
          persianTitle,
          link,
          inFooter,
          icon: selectedIcon
        });
        setIsLoading(false);
    }, 1000);
  };

  const SelectedIconComponent = socialIcons.find(i => i.key === selectedIcon)?.component || WhatsAppIcon;

  if (!isOpen) return null;

  return (
    <>
    <div
        className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[60] transition-opacity duration-300"
        onClick={onClose}
    >
    <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 mx-4 max-w-2xl w-full transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
    >
        <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {isEditing ? 'ویرایش شبکه اجتماعی' : 'افزودن شبکه اجتماعی'}
        </h3>
        <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
        </button>
        </div>
        
        <div className="py-6 space-y-6 text-right">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان را وارد نمایید..."
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان به فارسی</label>
                <input
                    type="text"
                    value={persianTitle}
                    onChange={(e) => setPersianTitle(e.target.value)}
                    placeholder="عنوان فارسی را وارد نمایید..."
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                />
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">لینک</label>
                <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="لینک را وارد نمایید..."
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                />
            </div>

            <div className="flex items-center justify-end gap-3">
                <label onClick={() => setInFooter(!inFooter)} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">نمایش در فوتر</label>
                <button onClick={() => setInFooter(!inFooter)} className={`w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${inFooter ? 'bg-violet-600 border-violet-600' : 'border-gray-300 dark:border-gray-500'}`}>
                    {inFooter && <CheckIcon className="w-3.5 h-3.5 text-white"/>}
                </button>
            </div>
            
            <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">آیکون</label>
                <div className="flex gap-3 flex-wrap items-center">
                     <div 
                        className="w-12 h-12 rounded-lg border flex items-center justify-center transition-all border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 ring-2 ring-violet-200 dark:ring-violet-800"
                    >
                        <SelectedIconComponent className="w-6 h-6" />
                    </div>
                     <button 
                        onClick={() => setIsIconModalOpen(true)}
                        className="w-12 h-12 rounded-lg bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition-colors shadow-md"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

        </div>
        
        <div className="mt-6 pt-4 border-t dark:border-gray-700">
            <button 
                onClick={handleSave} 
                disabled={isLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-12 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? <SpinnerIcon className="w-6 h-6 text-white" /> : 'ذخیره'}
            </button>
        </div>
    </div>
    </div>
    <IconSelectionModal 
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onConfirm={(key) => setSelectedIcon(key as any)}
        selectedIconKey={selectedIcon}
        iconOptions={socialIcons}
    />
    </>
  );
};

export default AddSocialNetworkModal;
