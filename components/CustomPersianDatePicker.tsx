
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from './icons';

interface CustomPersianDatePickerProps {
  startDate: string;
  endDate: string;
  onRangeSelect: (range: { start: string, end: string }) => void;
  allowPastDates?: boolean;
}

// توابع کمکی
const toPersianDigits = (n: number | string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const parseDate = (dateStr: string): { year: number; month: number; day: number } | null => {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const toEn = (s: string) => parseInt(s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()));
  return { year: toEn(parts[0]), month: toEn(parts[1]), day: toEn(parts[2]) };
};

const formatDate = (date: { year: number; month: number; day: number }): string => {
  return `${String(date.year)}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}`
    .replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

const dateToTimestamp = (date: { year: number; month: number; day: number } | null): number => {
    if (!date) return 0;
    return date.year * 372 + date.month * 31 + date.day;
};

const isPersianLeap = (year: number): boolean => {
    return [1, 5, 9, 13, 17, 22, 26, 30].includes(year % 33);
};

const getDaysInPersianMonth = (year: number, month: number): number => {
    if (month >= 1 && month <= 6) return 31;
    if (month >= 7 && month <= 11) return 30;
    if (month === 12) return isPersianLeap(year) ? 30 : 29;
    return 0;
};

const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

// لیست تعطیلات رسمی برای سال‌های ۱۴۰۳ و ۱۴۰۴
const OFFICIAL_HOLIDAYS: Record<number, Record<number, number[]>> = {
    1403: {
        1: [1, 2, 3, 4, 12, 13, 22, 23], // فروردین
        2: [15, 25], // اردیبهشت
        3: [14, 15, 28], // خرداد
        4: [5, 25, 26], // تیر
        5: [], // مرداد
        6: [4, 12, 14, 22, 30], // شهریور
        7: [], // مهر
        8: [], // آبان
        9: [15], // آذر
        10: [25], // دی
        11: [9, 22], // بهمن
        12: [29, 30], // اسفند
    },
    1404: {
        1: [1, 2, 3, 4, 10, 12, 13, 31], // فروردین
        2: [1], // اردیبهشت
        3: [14, 15, 17, 26], // خرداد
        4: [15], // تیر
        5: [], // مرداد
        6: [14, 22], // شهریور
        7: [13], // مهر
        8: [], // آبان
        9: [5, 25], // آذر
        10: [24], // دی
        11: [7, 22], // بهمن
        12: [18, 29] // اسفند
    }
};

// گرفتن تاریخ امروز به شمسی
const G_TODAY = new Date();
const P_TODAY_FORMATTER_LATN = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric' });
const [pTodayYear, pTodayMonth, pTodayDay] = P_TODAY_FORMATTER_LATN.format(G_TODAY).split('/').map(Number);
const P_TODAY_OBJ = { year: pTodayYear, month: pTodayMonth, day: pTodayDay };

const CustomPersianDatePicker: React.FC<CustomPersianDatePickerProps> = ({ startDate, endDate, onRangeSelect, allowPastDates = false }) => {
  const [currentDate, setCurrentDate] = useState({ year: P_TODAY_OBJ.year, month: P_TODAY_OBJ.month });
  const [selectionStart, setSelectionStart] = useState(parseDate(startDate));
  const [selectionEnd, setSelectionEnd] = useState(parseDate(endDate));
  const [hoveredDate, setHoveredDate] = useState<{ year: number; month: number; day: number } | null>(null);

  useEffect(() => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    const todayTimestamp = dateToTimestamp(P_TODAY_OBJ);
    const startTimestamp = dateToTimestamp(start);

    // Ensure start date is not in the past only if allowPastDates is false
    if (!allowPastDates && start && startTimestamp < todayTimestamp) {
        setSelectionStart(P_TODAY_OBJ);
    } else {
        setSelectionStart(start);
    }

    setSelectionEnd(end);

    if (start && (allowPastDates || startTimestamp >= todayTimestamp)) {
        setCurrentDate({ year: start.year, month: start.month });
    } else {
        setCurrentDate({ year: P_TODAY_OBJ.year, month: P_TODAY_OBJ.month });
    }
  }, [startDate, endDate, allowPastDates]);

  const handleDayClick = (day: number) => {
    const clickedDate = { year: currentDate.year, month: currentDate.month, day };
    const clickedTimestamp = dateToTimestamp(clickedDate);
    const todayTimestamp = dateToTimestamp(P_TODAY_OBJ);
    
    if (!allowPastDates && clickedTimestamp < todayTimestamp) return; // Do not select past dates if disabled

    if (!selectionStart || (selectionStart && selectionEnd)) {
      setSelectionStart(clickedDate);
      setSelectionEnd(null);
    } else if (dateToTimestamp(clickedDate) < dateToTimestamp(selectionStart)) {
      setSelectionStart(clickedDate);
    } else {
      setSelectionEnd(clickedDate);
      onRangeSelect({ start: formatDate(selectionStart), end: formatDate(clickedDate) });
    }
  };

  const handleMonthChange = (delta: number) => {
    setCurrentDate(prev => {
      let newMonth = prev.month + delta;
      let newYear = prev.year;
      if (newMonth > 12) { newMonth = 1; newYear++; }
      if (newMonth < 1) { newMonth = 12; newYear--; }
      
      // Prevent going to a month before the current month of the current year ONLY if past dates are disabled
      if (!allowPastDates && (newYear < P_TODAY_OBJ.year || (newYear === P_TODAY_OBJ.year && newMonth < P_TODAY_OBJ.month))) {
          return { year: P_TODAY_OBJ.year, month: P_TODAY_OBJ.month };
      }

      return { year: newYear, month: newMonth };
    });
  };

  const handleYearChange = (delta: number) => {
    setCurrentDate(prev => {
        const newYear = prev.year + delta;
        // Prevent going to a year before the current year ONLY if past dates are disabled
        if (!allowPastDates && newYear < P_TODAY_OBJ.year) {
            return prev;
        }
        return { ...prev, year: newYear };
    });
  };
  
    const getFirstDayOfMonthOffset = (year: number, month: number): number => {
        const GREGORIAN_EPOCH_OFFSET = 21;
        const gregorianYear = year + 621;
        
        let daysSinceYearStart = 0;
        for (let m = 1; m < month; m++) {
            daysSinceYearStart += getDaysInPersianMonth(year, m);
        }
        
        const dayOfYear = daysSinceYearStart + 1;
        const approxGregorianDate = new Date(gregorianYear, 2, GREGORIAN_EPOCH_OFFSET + dayOfYear -1);
        
        return (approxGregorianDate.getDay() + 1) % 7; // 0 for Saturday
    };


  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  const daysInMonth = getDaysInPersianMonth(currentDate.year, currentDate.month);
  const emptyDaysCount = getFirstDayOfMonthOffset(currentDate.year, currentDate.month);
  
  const calendarDays = [
      ...Array(emptyDaysCount).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const isPrevMonthDisabled = !allowPastDates && currentDate.year === P_TODAY_OBJ.year && currentDate.month === P_TODAY_OBJ.month;
  const isPrevYearDisabled = !allowPastDates && currentDate.year <= P_TODAY_OBJ.year;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 w-full border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => handleMonthChange(-1)} disabled={isPrevMonthDisabled} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRightIcon className="w-5 h-5" />
        </button>
        <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span>{persianMonths[currentDate.month - 1]}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => handleYearChange(-1)} disabled={isPrevYearDisabled} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronDownIcon className="w-4 h-4" />
            </button>
            <span>{toPersianDigits(currentDate.year)}</span>
            <button onClick={() => handleYearChange(1)} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                <ChevronUpIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button onClick={() => handleMonthChange(1)} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <ChevronLeftIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {weekDays.map((day, idx) => (
          <div key={day} className={`text-xs font-semibold p-2 ${idx === 6 ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>{day}</div>
        ))}
        {calendarDays.map((day, index) => {
          if (!day) return <div key={`empty-${index}`}></div>;

          const dayDate = { year: currentDate.year, month: currentDate.month, day };
          const dayTimestamp = dateToTimestamp(dayDate);
          const startTimestamp = dateToTimestamp(selectionStart);
          const endTimestamp = dateToTimestamp(selectionEnd);
          const hoveredTimestamp = dateToTimestamp(hoveredDate);
          const todayTimestamp = dateToTimestamp(P_TODAY_OBJ);

          const isDisabled = !allowPastDates && dayTimestamp < todayTimestamp;
          
          const isSelected = dayTimestamp === startTimestamp || dayTimestamp === endTimestamp;
          const isStart = dayTimestamp === startTimestamp;
          const isEnd = dayTimestamp === endTimestamp;
          const isInRange = selectionStart && selectionEnd && dayTimestamp > startTimestamp && dayTimestamp < endTimestamp;
          const isHoverInRange = selectionStart && !selectionEnd && hoveredTimestamp && dayTimestamp > startTimestamp && dayTimestamp <= hoveredTimestamp;
          
          // Holiday Logic
          const isFriday = (index % 7) === 6;
          const yearHolidays = OFFICIAL_HOLIDAYS[currentDate.year];
          const monthHolidays = yearHolidays ? yearHolidays[currentDate.month] : [];
          const isOfficialHoliday = monthHolidays?.includes(day);
          const isHoliday = isFriday || isOfficialHoliday;

          let dayClasses = `w-10 h-10 flex items-center justify-center rounded-lg transition-colors text-sm`;

          if (isDisabled) {
              dayClasses += ' text-gray-300 dark:text-gray-600 cursor-not-allowed';
          } else if (isSelected) {
            dayClasses += ' bg-violet-600 text-white';
          } else if (isInRange || isHoverInRange) {
            dayClasses += ' bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300';
          } else {
             // Normal day style, check for holiday
             if (isHoliday) {
                 dayClasses += ' text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20';
             } else {
                 dayClasses += ' text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
             }
          }
          
          const getRangeBgClass = () => {
              if (isDisabled || (!isInRange && !isHoverInRange && !isStart && !isEnd)) return '';
              let bgClass = 'bg-violet-100 dark:bg-violet-900/50';
              if(isStart) bgClass += ' rounded-r-lg';
              if(isEnd) bgClass += ' rounded-l-lg';
              if(selectionStart && !selectionEnd && hoveredTimestamp && dayTimestamp === hoveredTimestamp) bgClass += ' rounded-l-lg';
              return bgClass;
          }

          return (
            <div
              key={day}
              className={`flex justify-center items-center ${getRangeBgClass()}`}
              onMouseEnter={() => !isDisabled && setHoveredDate(dayDate)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <button
                onClick={() => handleDayClick(day)}
                disabled={isDisabled}
                className={dayClasses}
              >
                {toPersianDigits(day)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomPersianDatePicker;
