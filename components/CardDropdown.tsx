import React, { useState, useRef, useEffect } from 'react';
import type { CardInfo } from '../types';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, PencilIcon, TrashIcon } from './icons';

// A helper function to format numbers with spaces and convert to Persian digits
const toPersianDigits = (n: string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};
const formatCardNumber = (numStr: string) => {
    return toPersianDigits(numStr).replace(/(.{4})/g, '$1 ').trim();
};

interface CardDropdownProps {
  label: string;
  cards: CardInfo[];
  selectedCardId: number | null;
  onSelectCard: (id: number) => void;
  onOpenAddModal: () => void;
  onEdit: (card: CardInfo) => void;
  onDelete: (id: number) => void;
}

const CardDropdown: React.FC<CardDropdownProps> = ({ label, cards, selectedCardId, onSelectCard, onOpenAddModal, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedCard = cards.find(c => c.id === selectedCardId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id: number) => {
        onSelectCard(id);
        setIsOpen(false);
    };

    if (cards.length === 0) {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</label>
                <button
                    onClick={onOpenAddModal}
                    className="w-full bg-white dark:bg-gray-800 rounded-lg p-2 min-h-[52px] border border-gray-200 dark:border-gray-700 flex items-center justify-between pr-4 hover:border-violet-400 dark:hover:border-violet-600"
                >
                    <span className="text-gray-400 dark:text-gray-500">شماره کارت</span>
                    <div className="w-9 h-9 flex items-center justify-center bg-violet-600 text-white rounded-full transition-colors">
                        <PlusIcon className="w-5 h-5" />
                    </div>
                </button>
            </div>
        );
    }

    if (!selectedCard) return null; // Or some fallback UI

    return (
        <div ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</label>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between text-right bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 min-h-[52px] border outline-none transition-all duration-200
                        ${isOpen ? 'border-violet-500 ring-1 ring-violet-500' : 'border-transparent'}`}
                >
                    <div className="flex items-center gap-3">
                        <span dir="ltr" className="text-gray-800 dark:text-gray-200 font-semibold tracking-wider text-base">
                            {formatCardNumber(selectedCard.fullNumber)}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <selectedCard.logo className="w-8 h-8 flex-shrink-0" />
                        {isOpen ? <ChevronUpIcon className="w-5 h-5 text-gray-400"/> : <ChevronDownIcon className="w-5 h-5 text-gray-400"/>}
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-10 overflow-hidden p-3 space-y-2">
                        <ul className="space-y-2">
                            {cards.map(card => (
                                <li key={card.id} className="w-full p-2 rounded-lg flex items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800 transition-colors">
                                    <div 
                                        className="flex items-center gap-4 flex-grow min-w-0 cursor-pointer" 
                                        onClick={() => handleSelect(card.id)}
                                    >
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-800 dark:text-gray-200 tracking-wider text-sm truncate" dir="ltr">
                                                ...{toPersianDigits(card.fullNumber.slice(-4))}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 tracking-wider truncate" dir="ltr">
                                                ...{toPersianDigits(card.iban.slice(-6))}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <card.logo className="w-8 h-8 flex-shrink-0" />
                                        <div className="flex items-center gap-1">
                                            <button onClick={(e) => { e.stopPropagation(); onDelete(card.id); }} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); onEdit(card); }} className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {cards.length < 2 && (
                            <button
                                onClick={onOpenAddModal}
                                className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-3 px-5 rounded-lg text-sm hover:bg-violet-700 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                                <span>ثبت شماره کارت جدید</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardDropdown;