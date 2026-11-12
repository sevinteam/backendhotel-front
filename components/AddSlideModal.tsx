
import React, { useState, useRef, useEffect } from 'react';
import { XIcon, UploadIcon, SpinnerIcon } from './icons';

export interface SlideItem {
    id: number;
    title: string;
    sortOrder: number;
    image: string | null;
}

interface AddSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SlideItem, 'id'>) => void;
  slideToEdit: SlideItem | null;
}

const AddSlideModal: React.FC<AddSlideModalProps> = ({
  isOpen,
  onClose,
  onSave,
  slideToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEditing = !!slideToEdit;

  useEffect(() => {
    if (isOpen) {
      if (slideToEdit) {
        setTitle(slideToEdit.title);
        setSortOrder(String(slideToEdit.sortOrder));
        setImage(slideToEdit.image);
      } else {
        // Reset form
        setTitle('');
        setSortOrder('');
        setImage(null);
      }
      setIsLoading(false);
    }
  }, [isOpen, slideToEdit]);

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
    if (!title.trim() || !sortOrder || !image || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
        onSave({
          title,
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
            {isEditing ? 'ویرایش اسلاید' : 'افزودن اسلاید'}
        </h3>
        <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
        </button>
        </div>
        
        <div className="py-6 space-y-6 text-right">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان اسلاید</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان را وارد نمایید..."
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ترتیب نمایش</label>
                <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    placeholder="شماره ترتیب"
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200 text-center"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تصویر اسلاید</label>
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
                disabled={isLoading || !title.trim() || !sortOrder || !image}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-12 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? <SpinnerIcon className="w-6 h-6 text-white" /> : 'ذخیره'}
            </button>
        </div>
    </div>
    </div>
  );
};

export default AddSlideModal;
