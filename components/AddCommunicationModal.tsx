
import React, { useState, useEffect } from 'react';
import { XIcon, PlusIcon, CheckIcon, LocationMarkerIcon, PhoneIcon, MailIcon, SpinnerIcon } from './icons';
import IconSelectionModal, { IconOption } from './IconSelectionModal';

export interface CommunicationChannel {
    id: number;
    title: string;
    subtitle: string;
    value: string;
    link: string;
    inFooter: boolean;
    icon?: 'location' | 'phone' | 'mail';
}

interface AddCommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<CommunicationChannel, 'id'>) => void;
  channelToEdit: CommunicationChannel | null;
}

const communicationIcons: IconOption[] = [
    { key: 'location', name: 'Location', component: LocationMarkerIcon },
    { key: 'phone', name: 'Phone', component: PhoneIcon },
    { key: 'mail', name: 'Mail', component: MailIcon },
];

const AddCommunicationModal: React.FC<AddCommunicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  channelToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [value, setValue] = useState('');
  const [link, setLink] = useState('');
  const [inFooter, setInFooter] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState<'location' | 'phone' | 'mail'>('location');
  const [isLoading, setIsLoading] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  
  const isEditing = !!channelToEdit;

  useEffect(() => {
    if (isOpen) {
      if (channelToEdit) {
        setTitle(channelToEdit.title);
        setSubtitle(channelToEdit.subtitle);
        setValue(channelToEdit.value);
        setLink(channelToEdit.link);
        setInFooter(channelToEdit.inFooter);
        setSelectedIcon(channelToEdit.icon || 'location');
      } else {
        // Reset form
        setTitle('');
        setSubtitle('');
        setValue('');
        setLink('');
        setInFooter(true);
        setSelectedIcon('location');
      }
      setIsLoading(false);
    }
  }, [isOpen, channelToEdit]);

  const handleSave = () => {
    if (!title.trim() || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
        onSave({
          title,
          subtitle,
          value,
          link,
          inFooter,
          icon: selectedIcon
        });
        setIsLoading(false);
    }, 1000);
  };
  
  const SelectedIconComponent = communicationIcons.find(i => i.key === selectedIcon)?.component || LocationMarkerIcon;

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
                {isEditing ? 'ویرایش راه ارتباطی' : 'افزودن راه ارتباطی'}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان تک</label>
                    <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="زیر عنوان را وارد نمایید..."
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                    />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">مقدار</label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="مقدار را وارد نمایید..."
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                    />
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
            iconOptions={communicationIcons}
        />
    </>
  );
};

export default AddCommunicationModal;
