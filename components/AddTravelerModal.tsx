
import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';
import type { Traveler } from '../types';

interface AddTravelerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (traveler: Omit<Traveler, 'id'>) => void;
  travelerToEdit?: Traveler | null;
}

// --- Validation Functions ---
const validateNationalCode = (value: string): boolean => {
  if (!/^\d{10}$/.test(value)) {
    return false;
  }

  const checkDigit = parseInt(value[9], 10);
  const sum = Array.from({ length: 9 }, (_, i) => parseInt(value[i], 10) * (10 - i))
    .reduce((acc, curr) => acc + curr, 0);
  
  const remainder = sum % 11;

  if (remainder < 2) {
    return checkDigit === remainder;
  }
  return checkDigit === 11 - remainder;
};

const validateNationalIdOrPassport = (value: string): string => {
    if (!value) {
        return 'این فیلد الزامی است';
    }
    if (/^\d{10}$/.test(value)) {
        if (validateNationalCode(value)) {
            return '';
        }
        return 'کد ملی معتبر نیست';
    } else if (/^[A-Za-z0-9]{6,9}$/.test(value)) {
        return '';
    }
    return 'شماره ملی یا پاسپورت وارد شده معتبر نیست';
};

const AddTravelerModal: React.FC<AddTravelerModalProps> = ({ isOpen, onClose, onSave, travelerToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        familyName: '',
        phone: '',
        nationalId: '',
    });

    const [errors, setErrors] = useState({ nationalId: '' });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (travelerToEdit) {
                setFormData({
                    name: travelerToEdit.name,
                    familyName: travelerToEdit.familyName,
                    phone: travelerToEdit.phone,
                    nationalId: travelerToEdit.nationalId,
                });
            } else {
                setFormData({ name: '', familyName: '', phone: '', nationalId: '' });
            }
            setErrors({ nationalId: '' }); // Reset errors on open
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen, travelerToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'nationalId') {
            setErrors(prev => ({ ...prev, nationalId: validateNationalIdOrPassport(value) }));
        }
    };

    const handleSave = () => {
        const nationalIdError = validateNationalIdOrPassport(formData.nationalId);
        if (nationalIdError) {
            setErrors({ nationalId: nationalIdError });
            return;
        }
        
        if (formData.name && formData.familyName && formData.phone) {
            onSave(formData);
        }
    };

    const isFormValid = formData.name && formData.familyName && formData.phone && formData.nationalId && !errors.nationalId;
    
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[70] transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 my-8 mx-4 max-w-md w-full transform transition-all duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center pb-4">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {travelerToEdit ? 'ویرایش مسافر' : 'افزودن مسافر'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />
                
                {/* Body */}
                <div className="py-8 space-y-6 text-right">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">نام مسافر:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                            placeholder="نام مسافر را وارد کنید..."
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">نام خانوادگی:</label>
                        <input type="text" name="familyName" value={formData.familyName} onChange={handleChange}
                            placeholder="نام خانوادگی مسافر را وارد کنید..."
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">شماره همراه:</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                            placeholder="شماره همراه مسافر را وارد کنید..."
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">شماره ملی / شماره پاسپورت:</label>
                        <input type="text" name="nationalId" value={formData.nationalId} onChange={handleChange}
                            placeholder="شماره ملی مسافر را وارد کنید..."
                            className={`w-full p-3 bg-gray-100 dark:bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 dark:text-gray-200 ${
                                errors.nationalId ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-violet-500 dark:focus:ring-violet-400'
                            }`}
                        />
                        {errors.nationalId && <p className="text-red-500 text-xs mt-2">{errors.nationalId}</p>}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="mt-2">
                    <button
                        onClick={handleSave}
                        className="w-full bg-[#6D28D9] hover:bg-opacity-90 text-white font-bold py-4 px-8 rounded-lg transition-colors disabled:opacity-50"
                        disabled={!isFormValid}
                    >
                        {travelerToEdit ? 'ویرایش مسافر' : 'ذخیره مسافر'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTravelerModal;