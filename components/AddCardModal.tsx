import React, { useState, useRef, useEffect } from 'react';
import { XIcon, BankLogoIcon } from './icons';
import type { CardInfo } from '../types';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newCard: Omit<CardInfo, 'id' | 'logo'>) => void;
  cardToEdit?: CardInfo | null;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onSave, cardToEdit }) => {
  const [cardParts, setCardParts] = useState(['', '', '', '']);
  const [iban, setIban] = useState('');
  const ref0 = useRef<HTMLInputElement>(null);
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const inputRefs = React.useMemo(() => [ref0, ref1, ref2, ref3], []);
  const ibanInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (cardToEdit) {
        setCardParts(cardToEdit.fullNumber.match(/.{1,4}/g) || ['', '', '', '']);
        setIban(cardToEdit.iban.replace('IR', ''));
      } else {
        setCardParts(['', '', '', '']);
        setIban('');
      }
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, cardToEdit, inputRefs]);

  const handleCardPartChange = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length > 4) return;
    
    const newCardParts = [...cardParts];
    newCardParts[index] = numericValue;
    setCardParts(newCardParts);

    if (numericValue.length === 4 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 24) {
      setIban(numericValue);
    }
  };

  const handleSaveClick = () => {
    const fullNumber = cardParts.join('');
    if (fullNumber.length === 16 && iban.length === 24) {
      onSave({
        fullNumber,
        iban: `IR${iban}`
      });
      onClose();
    }
  };

  const fullCardNumber = cardParts.join('');
  const isFormValid = fullCardNumber.length === 16 && iban.length === 24;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[70] transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 my-8 mx-4 max-w-lg w-full transform transition-all duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {cardToEdit ? 'ویرایش شماره کارت' : 'ثبت شماره کارت جدید'}
            </h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="py-8 space-y-8 text-right">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">شماره کارت:</label>
            <div className="flex items-center gap-2" dir="ltr">
              {cardParts.map((part, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={part}
                  onChange={(e) => handleCardPartChange(index, e.target.value)}
                  className="w-full text-center bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-3 min-h-[52px] focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
                />
              ))}
              <div className="w-[52px] h-[52px] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <BankLogoIcon className="w-10 h-10"/>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">شماره شبا:</label>
            <div dir="ltr" className="flex items-center w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg min-h-[52px] focus-within:ring-2 focus-within:ring-violet-500 dark:focus-within:ring-violet-400 focus-within:border-transparent">
              <span className="pl-3 text-gray-400 dark:text-gray-500 font-mono select-none">IR</span>
              <input
                ref={ibanInputRef}
                type="text"
                inputMode="numeric"
                value={iban}
                onChange={handleIbanChange}
                className="w-full bg-transparent p-3 outline-none text-gray-800 dark:text-gray-200 text-left flex-grow"
                maxLength={24}
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-auto pt-4 border-t dark:border-gray-700 flex justify-end">
          <button
            onClick={handleSaveClick}
            disabled={!isFormValid}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cardToEdit ? 'ذخیره تغییرات' : 'ثبت اطلاعات کارت'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;