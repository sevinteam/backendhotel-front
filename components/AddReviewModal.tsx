
import React, { useState, useEffect, useRef } from 'react';
import { XIcon, SpinnerIcon, UploadIcon } from './icons';

export interface ReviewItem {
    id: number;
    name: string;
    review: string;
    rating: number;
    image: string | null;
    assessment: string;
}

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ReviewItem, 'id'>) => void;
  reviewToEdit: ReviewItem | null;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  onSave,
  reviewToEdit,
}) => {
  const [name, setName] = useState('');
  const [assessment, setAssessment] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEditing = !!reviewToEdit;

  useEffect(() => {
    if (isOpen) {
      if (reviewToEdit) {
        setName(reviewToEdit.name);
        setAssessment(reviewToEdit.assessment);
        setReview(reviewToEdit.review);
        setRating(String(reviewToEdit.rating));
        setImage(reviewToEdit.image);
      } else {
        // Reset form
        setName('');
        setAssessment('');
        setReview('');
        setRating('');
        setImage(null);
      }
      setIsLoading(false);
    }
  }, [isOpen, reviewToEdit]);

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
    const ratingNum = parseFloat(rating);
    if (!name.trim() || !assessment.trim() || !review.trim() || isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5 || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
        onSave({
          name,
          assessment,
          review,
          rating: ratingNum,
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
            {isEditing ? 'ویرایش نظر' : 'افزودن نظر'}
        </h3>
        <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
        </button>
        </div>
        
        <div className="py-6 space-y-6 text-right max-h-[60vh] overflow-y-auto pr-2 scrollbar-right">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نام و نام خانوادگی</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="نام کاربر را وارد نمایید..."
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ارزیابی</label>
                <input
                    type="text"
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    placeholder="مثلا: عالی، متوسط، ضعیف"
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">امتیاز (۰ تا ۵)</label>
                <input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="مثلا ۴.۵"
                    step="0.1"
                    min="0"
                    max="5"
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200 text-center"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تصویر کاربر</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-violet-500 dark:hover:border-violet-400 transition-colors bg-gray-50 dark:bg-gray-700/30"
                >
                    {image ? (
                        <div className="relative">
                            <img src={image} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" />
                            <button 
                                onClick={(e) => { e.stopPropagation(); setImage(null); }}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">متن نظر</label>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="نظر کاربر را وارد نمایید..."
                    rows={4}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200 resize-none"
                />
            </div>
        </div>
        
        <div className="mt-6 pt-4 border-t dark:border-gray-700">
            <button 
                onClick={handleSave} 
                disabled={isLoading || !name.trim() || !assessment.trim() || !review.trim() || !rating}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-12 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? <SpinnerIcon className="w-6 h-6 text-white" /> : 'ذخیره'}
            </button>
        </div>
    </div>
    </div>
  );
};

export default AddReviewModal;
