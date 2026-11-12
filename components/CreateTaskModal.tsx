import React from 'react';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { XIcon, CalendarIcon, PlusIcon, SpinnerIcon, TrashIcon, CheckIcon, DotsVerticalIcon, DownloadIcon, FileIcon, UploadIcon } from './icons';
import CustomPersianDatePicker from './CustomPersianDatePicker';
import UserSelectionModal from './UserSelectionModal';
import type { Task, UploadedFile, UserReference, ChecklistItem } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'status'>) => void;
  onUpdateTask: (task: Task) => void;
  allUsers: UserReference[];
  taskToEdit?: Task | null; // تسکی که برای ویرایش فرستاده می‌شود
}

// کامپوننت برای نمایش یک آیتم فایل
const FileItem: React.FC<{ file: UploadedFile; onDelete: (id: number) => void; }> = ({ file, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // بستن منو با کلیک بیرون از آن
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // تشخیص نوع فایل برای نمایش آیکون مناسب
    const getFileType = (fileName: string): 'image' | 'pdf' | 'excel' | 'word' | 'other' => {
        if (/\.(jpg|jpeg|png|gif)$/i.test(fileName)) return 'image';
        if (/\.(pdf)$/i.test(fileName)) return 'pdf';
        if (/\.(xlsx|xls|csv)$/i.test(fileName)) return 'excel';
        if (/\.(docx|doc)$/i.test(fileName)) return 'word';
        return 'other';
    };

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3 min-w-0">
                <FileIcon type={getFileType(file.name)} className="w-10 h-10 flex-shrink-0" />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{file.size}</p>
                </div>
            </div>
            {/* منوی عملیات (حذف، دانلود) */}
            <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full">
                    <DotsVerticalIcon className="w-5 h-5" />
                </button>
                {menuOpen && (
                    <div className="absolute left-0 top-full mt-1 w-36 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg z-10">
                        <button className="w-full text-right flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                            <DownloadIcon className="w-4 h-4" />
                            <span>دانلود</span>
                        </button>
                        <button onClick={() => { onDelete(file.id); setMenuOpen(false); }} className="w-full text-right flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                            <TrashIcon className="w-4 h-4" />
                            <span>حذف</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onAddTask, onUpdateTask, allUsers, taskToEdit }) => {
  // State های مربوط به فیلدهای فرم
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [admins, setAdmins] = useState<UserReference[]>([]);
  const [supervisors, setSupervisors] = useState<UserReference[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // State های کنترلی
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState<'admins' | 'supervisors' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ref ها برای دسترسی مستقیم به عناصر DOM
  const datePickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // تابع برای ریست کردن تمام state های فرم
  const resetState = () => {
    setTitle('');
    setDescription('');
    setAdmins([]);
    setSupervisors([]);
    setChecklist([]);
    setUploadedFiles([]);
    setNewChecklistItem('');

    const today = new Date();
    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const todayStr = formatter.format(today);
    setStartDate(todayStr);
    setEndDate(todayStr);
  };

  // useEffect برای مدیریت باز و بسته شدن مودال
  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        // اگر در حالت ویرایش هستیم، فیلدها را با اطلاعات تسک پر کن
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description);
            setAdmins(taskToEdit.admins || []);
            setSupervisors(taskToEdit.supervisors || []);
            setStartDate(taskToEdit.startDate);
            setEndDate(taskToEdit.endDate);
            setChecklist(taskToEdit.checklist || []);
            setUploadedFiles(taskToEdit.files || []);
        } else {
            // در غیر این صورت (حالت ایجاد)، فیلدها را خالی کن
            resetState();
        }
    } else {
        document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen, taskToEdit]);

  // useEffect برای بستن انتخابگر تاریخ با کلیک بیرون از آن
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDatePickerOpen && datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDatePickerOpen]);

  // تابع برای مدیریت انتخاب بازه زمانی از تقویم
  const handleRangeSelect = (range: { start: string, end: string }) => {
    setStartDate(range.start);
    setEndDate(range.end);
    setDatePickerOpen(false);
  };

  // تابع برای مدیریت انتخاب فایل
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile: UploadedFile = {
          id: Date.now(),
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)}Mb`,
          uploader: 'شما',
          format: `.${file.name.split('.').pop()}`,
          content: reader.result as string, // Save file content
        };
        setUploadedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file); // Read file as data URL
    }
     if (event.target) event.target.value = ''; // ریست کردن input تا بتوان دوباره همان فایل را انتخاب کرد
  };

  const handleDeleteFile = (id: number) => setUploadedFiles(prev => prev.filter(f => f.id !== id));
  
  // تابع برای افزودن آیتم جدید به چک‌لیست
  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
        const newItem: ChecklistItem = {
            id: Date.now(),
            text: newChecklistItem.trim(),
            completed: false,
        };
        setChecklist(prev => [...prev, newItem]);
        setNewChecklistItem('');
    }
  };

  // تابع برای تغییر وضعیت یک آیتم چک‌لیست
  const toggleChecklistItem = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };
  
  // تابع برای ارسال فرم (ایجاد یا ویرایش تسک)
  const handleSubmit = () => {
    if (isLoading || !title.trim()) return;
    
    setIsLoading(true);

    const taskData = {
      title,
      description,
      adminName: admins.length > 0 ? admins[0].name : (taskToEdit?.adminName || 'بدون ادمین'),
      admins,
      supervisors,
      startDate,
      endDate,
      files: uploadedFiles,
      checklist,
    };

    // شبیه‌سازی تاخیر شبکه
    setTimeout(() => {
        if (taskToEdit) {
            onUpdateTask({
                ...taskToEdit,
                ...taskData,
            });
        } else {
            onAddTask(taskData);
        }
        setIsLoading(false);
        onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-start z-[60] transition-opacity duration-300 overflow-y-auto"
        onClick={onClose}
      >
        <div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 my-8 mx-4 max-w-2xl w-full transform transition-all duration-300"
          onClick={e => e.stopPropagation()}
        >
          {/* هدر مودال */}
          <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{taskToEdit ? 'ویرایش تسک' : 'ایجاد تسک'}</h3>
            <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          
          {/* بدنه فرم */}
          <div className="py-6 space-y-6 text-right max-h-[70vh] overflow-y-auto px-6 scrollbar-right">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان تسک:</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان را وارد نمایید..."
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ادمین ها:</label>
                    <div className="flex items-center gap-2 flex-wrap p-2 border border-gray-200 dark:border-gray-600 rounded-lg min-h-[46px]">
                        {admins.map(admin => (
                            <img key={admin.id} src={admin.avatar} alt={admin.name} className="w-8 h-8 rounded-full"/>
                        ))}
                        <button onClick={() => setUserModalOpen('admins')} className="w-8 h-8 flex items-center justify-center bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors">
                            <PlusIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ناظرها:</label>
                    <div className="flex items-center gap-2 flex-wrap p-2 border border-gray-200 dark:border-gray-600 rounded-lg min-h-[46px]">
                        {supervisors.map(s => (
                            <img key={s.id} src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full"/>
                        ))}
                        <button onClick={() => setUserModalOpen('supervisors')} className="w-8 h-8 flex items-center justify-center bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors">
                            <PlusIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تاریخ شروع و اتمام:</label>
                <div className="relative">
                <button onClick={() => setDatePickerOpen(prev => !prev)}
                    className="w-full text-right p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400"/>
                    <span>{`${startDate}   -   ${endDate}`}</span>
                </button>
                </div>
                {isDatePickerOpen && (
                    <div ref={datePickerRef} className="absolute top-full right-0 mt-2 z-20 w-full md:w-auto">
                        <CustomPersianDatePicker startDate={startDate} endDate={endDate} onRangeSelect={handleRangeSelect} />
                    </div>
                )}
            </div>
           
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">چک لیست:</label>
                <div className="space-y-2">
                    {checklist.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                            <button onClick={() => toggleChecklistItem(item.id)} className={`w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${item.completed ? 'bg-violet-600 border-violet-600' : 'border-gray-300 dark:border-gray-500'}`}>
                                {item.completed && <CheckIcon className="w-3.5 h-3.5 text-white"/>}
                            </button>
                            <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{item.text}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <input type="text" value={newChecklistItem} onChange={e => setNewChecklistItem(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAddChecklistItem()}
                        placeholder="افزودن آیتم جدید..."
                        className="flex-grow p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"/>
                    <button onClick={handleAddChecklistItem} className="text-violet-600 dark:text-violet-400 font-semibold text-sm hover:underline flex-shrink-0">افزودن</button>
                </div>
            </div>
        
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">فایل ها:</label>
                <div className="space-y-2">
                    {uploadedFiles.map(file => (
                    <FileItem key={file.id} file={file} onDelete={handleDeleteFile} />
                    ))}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                 <div className="p-4 mt-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                    <UploadIcon className="mx-auto w-8 h-8 text-gray-400 dark:text-gray-500" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">فایل های خود را اینجا بکشید و رها کنید</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">یا</p>
                    <button onClick={() => fileInputRef.current?.click()} className="mt-2 text-violet-600 dark:text-violet-400 font-semibold text-sm hover:underline">
                        فایل را انتخاب کنید
                    </button>
                </div>
            </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">توضیحات تسک:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="توضیحات تسک را وارد نمایید..."
                    rows={4}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-gray-800 dark:text-gray-200 resize-none"
                />
            </div>
          </div>
          
          {/* فوتر مودال */}
          <div className="mt-6 pt-4 border-t dark:border-gray-700 flex justify-end gap-4">
             {taskToEdit && (
                <button onClick={onClose}
                    className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-3 px-8 rounded-lg transition-colors">
                    بازگشت
                </button>
            )}
             <button onClick={handleSubmit} disabled={isLoading || !title.trim()}
              className="bg-[#6D28D9] hover:bg-opacity-90 text-white font-bold py-3 px-12 rounded-lg transition-colors flex items-center justify-center min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? <SpinnerIcon className="w-5 h-5" /> : (taskToEdit ? 'ویرایش تسک' : 'ایجاد تسک')}
            </button>
          </div>
        </div>
      </div>

      {/* مودال انتخاب کاربر */}
      {isUserModalOpen && (
         <UserSelectionModal
            isOpen={!!isUserModalOpen}
            onClose={() => setUserModalOpen(null)}
            title={isUserModalOpen === 'admins' ? 'لیست ادمین ها' : 'لیست ناظرها'}
            // FIX: Add the required 'listTitle' prop.
            listTitle={isUserModalOpen === 'admins' ? 'لیست ادمین های موجود' : 'لیست ناظرهای موجود'}
            allUsers={allUsers}
            selectedUsers={isUserModalOpen === 'admins' ? admins : supervisors}
            onConfirm={(users) => {
                if (isUserModalOpen === 'admins') setAdmins(users);
                else setSupervisors(users);
                setUserModalOpen(null);
            }}
         />
      )}
    </>
  );
};

export default CreateTaskModal;