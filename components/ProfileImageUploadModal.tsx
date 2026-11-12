import React, { useState, useRef, useCallback, useEffect } from 'react';
import { XIcon, UploadIcon, TrashIcon } from './icons';

interface ProfileImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
  title: string;
}

const ProfileImageUploadModal: React.FC<ProfileImageUploadModalProps> = ({ isOpen, onClose, onSave, title }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      console.error("Invalid file type provided.");
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveClick = () => {
    if (imageFile) {
      onSave(imageFile);
      onClose();
    }
  };
  
  // Reset state when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow closing animation to finish
      const timer = setTimeout(() => {
        handleRemoveImage();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[70] transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 my-8 mx-4 max-w-lg w-full transform transition-all duration-300 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="py-6 flex-1 text-right space-y-6">
          {!imagePreview ? (
            <div
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}
            >
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                <UploadIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                فایل مورد نظر را انتخاب و آپلود نمایید
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                و یا داخل کادر رها کنید
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />
            </div>
          ) : (
            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="relative group">
                    <img src={imagePreview} alt="Profile preview" className="w-full h-auto max-h-72 object-contain rounded-lg" />
                    <button
                        onClick={handleRemoveImage}
                        className="absolute top-4 left-4 flex items-center gap-2 bg-gray-200/50 dark:bg-gray-900/50 backdrop-blur-sm text-red-500 py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                    >
                        <TrashIcon className="w-5 h-5" />
                        <span>حذف عکس</span>
                    </button>
                </div>
            </div>
          )}
          <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500">
            <span>حداکثر حجم فایل 20MB</span>
            <span>JPG, PNG, JPEG</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t dark:border-gray-700 flex justify-end flex-shrink-0">
          <button
            onClick={handleSaveClick}
            disabled={!imageFile}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUploadModal;