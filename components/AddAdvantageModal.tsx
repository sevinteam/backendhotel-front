
import React, { useState, useEffect } from 'react';
import { XIcon, PlusIcon, PhoneIcon, CreditCardIcon, LockClosedIcon, StarIcon, CheckCircleIcon, SpinnerIcon } from './icons';
import IconSelectionModal, { IconOption } from './IconSelectionModal';

export interface AdvantageItem {
    id: number;
    title: string;
    subtitle: string;
    icon: 'support' | 'payment' | 'security' | 'quality' | 'guarantee';
}

interface AddAdvantageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AdvantageItem, 'id'>) => void;
  itemToEdit: AdvantageItem | null;
}

const advantageIcons: IconOption[] = [
    { key: 'support', name: 'Support', component: PhoneIcon },
    { key: 'payment', name: 'Payment', component: CreditCardIcon },
    { key: 'security', name: 'Security', component: LockClosedIcon },
    { key: 'quality', name: 'Quality', component: StarIcon },
    { key: 'guarantee', name: 'Guarantee', component: CheckCircleIcon },
];

const AddAdvantageModal: React.FC<AddAdvantageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<'support' | 'payment' | 'security' | 'quality' | 'guarantee'>('quality');
  const [isLoading, setIsLoading] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  
  const isEditing = !!itemToEdit;

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setTitle(itemToEdit.title);
        setSubtitle(itemToEdit.subtitle);
        setSelectedIcon(itemToEdit.icon);
      } else {
        // Reset form
        setTitle('');
        setSubtitle('');
        setSelectedIcon('quality');
      }
      setIsLoading(false);
    }
  }, [isOpen, itemToEdit]);

  const handleSave = () => {
    if (!title.trim() || !subtitle.trim() || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
        onSave({
          title,
          subtitle,
          icon: selectedIcon
        });
        setIsLoading(false);
    }, 1000);
  };

  const SelectedIconComponent = advantageIcons.find(i => i.key === selectedIcon)?.component || StarIcon;

  if (!isOpen) return null;

  return (
    <>
        <div
            className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[60] transition-opacity duration-300"
            onClick={onClose}
        >
        <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 mx-4 max-w-lg w-full transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {isEditing ? 'ویرایش مزیت' : 'افزودن مزیت'}
            </h3>
            <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <XIcon className="w-6 h-6" />
            </button>
            </div>
            
            <div className="py-6 space-y-6 text-right">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="عنوان مزیت را وارد نمایید..."
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">زیر عنوان</label>
                    <textarea
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="توضیحات کوتاه مزیت را وارد نمایید..."
                        rows={4}
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200 resize-none"
                    />
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
                    disabled={isLoading || !title.trim() || !subtitle.trim()}
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
            iconOptions={advantageIcons}
        />
    </>
  );
};

export default AddAdvantageModal;
