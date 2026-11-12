
import React, { useState, useRef, useEffect } from 'react';
import { XIcon, UploadIcon, SpinnerIcon } from './icons';
import CustomSelect from './CustomSelect';
import { pageOptions } from './AddPageModal';

export interface BannerItem {
    id: number;
    title: string;
    page: string;
    link: string;
    sortOrder: number;
    image: string | null;
}

interface AddBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<BannerItem, 'id'>) => void;
  bannerToEdit: BannerItem | null;
}

const AddBannerModal: React.FC<AddBannerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  bannerToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [page, setPage] = useState('---------');
  const [link, setLink] = useState('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEditing = !!bannerToEdit;

  useEffect(() => {
    if (isOpen) {
      if (bannerToEdit) {
        setTitle(bannerToEdit.title);
        setPage(bannerToEdit.page || '---------');
        setLink(bannerToEdit.link);
        setSortOrder(String(bannerToEdit.sortOrder));
        setImage(bannerToEdit.image);
      } else {
        // Reset form
        setTitle('');
        setPage('---------');
        setLink('');
        setSortOrder('');
        setImage(null);
      }
      setIsLoading(false);
    }
  }, [isOpen, bannerToEdit]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !sortOrder || !image || page === '---------' || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
        onSave({
          title,
          page,
          link,
          sortOrder: parseInt(sortOrder) || 0,
          image
        });
        setIsLoading(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
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
            {isEditing ? 'ویرایش بنر' : 'افزودن بنر'}
        </h3>
        <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
        </button>
        </div>
        
        <div className="py-6 space-y-6 text-right">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان بنر</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان را وارد نمایید..."
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                />
            </div>

            <CustomSelect
                label="صفحه:"
                options={pageOptions}
                value={page}
                onChange={setPage}
            />
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ترتیب</label>
                    <input
                        type="number"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        placeholder="شماره"
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200 text-center"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">لینک (اختیاری)</label>
                    <input
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="لینک مقصد"
                        dir="ltr"
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200 text-left"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تصویر بنر</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-violet-500 dark:hover:border-violet-400 transition-colors bg-gray-50 dark:bg-gray-700/30"
                >
                    {image ? (
                        <div className="relative w-full">
                            <img src={image} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                            <button 
                                onClick={(e) => { e.stopPropagation(); setImage(null); }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <XIcon className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">برای آپلود تصویر کلیک کنید</span>
                        </>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                </div>
            </div>
        </div>
        
        <div className="mt-6 pt-4 border-t dark:border-gray-700">
            <button 
                onClick={handleSave} 
                disabled={isLoading || !title.trim() || !sortOrder || !image || page === '---------'}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-12 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? <SpinnerIcon className="w-6 h-6 text-white" /> : 'ذخیره'}
            </button>
        </div>
    </div>
    </div>
  );
};

export default AddBannerModal;
