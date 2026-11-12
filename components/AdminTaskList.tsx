import React, { useState, useMemo, useEffect, useRef } from 'react';
// FIX: Import ChatMessage type to resolve missing type error.
import type { Task, TaskStatus, UploadedFile, UserReference, ChatMessage } from '../types';
import { SearchIcon, PlusIcon, TrashIcon } from './icons';
import Pagination from './Pagination';
import ConfirmationModal from './ConfirmationModal';
import CreateTaskModal from './CreateTaskModal';
import ViewTaskModal from './ViewTaskModal';
import AdminTaskListSkeleton from './AdminTaskListSkeleton';

// داده‌های نمونه برای فایل‌ها
const initialFiles: UploadedFile[] = [
  { id: 1, name: 'Resume.pdf', size: '2.86Mb', uploader: 'علیرضا', format: '.pdf' },
  { id: 2, name: 'Reports.xlsx', size: '1.5Mb', uploader: 'هادی', format: '.xlsx' },
  { id: 3, name: 'image.jpg', size: '4.2Mb', uploader: 'پرهام', format: '.jpg' },
  { id: 4, name: 'archive.zip', size: '10.1Mb', uploader: 'گوهر', format: '.zip' },
];

// داده‌های نمونه برای تاریخچه چت
const mockChatHistory: ChatMessage[] = [
  { id: 1, sender: 'علیرضا آذرخش آلوچه', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', timestamp: 'دیروز ساعت ۱۱:۰۵', isCurrentUser: false, type: 'text', content: 'سلام، لطفا پس از بررسی اطلاع دهید.' },
  { id: 2, sender: 'شما', avatar: 'https://randomuser.me/api/portraits/men/0.jpg', timestamp: 'دیروز ساعت ۱۱:۱۵', isCurrentUser: true, type: 'text', content: 'حتما، به نظر می‌رسد تا فردا ظهر به نتیجه برسیم.' },
  { id: 3, sender: 'علیرضا آذرخش آلوچه', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', timestamp: 'امروز ساعت ۰۹:۳۰', isCurrentUser: false, type: 'file', content: '', fileInfo: { name: 'اصلاح دیتا استراکچر۴', size: '2.86Mb' } },
];

// داده‌های نمونه برای تسک‌ها
const tasksData: Task[] = [
  { 
    id: 1, adminName: 'علیرضا آذرخش آلوچه', title: 'ارتباط بین همکاران سفرنامه 24', status: 'در حال انجام',
    description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.',
    startDate: '۱۴۰۲/۰۵/۰۵', endDate: '۱۴۰۲/۰۵/۱۰',
    supervisors: [
      { id: 13, name: 'User 1', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
      { id: 14, name: 'User 2', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    ],
    admins: [
        { id: 2, name: 'علیرضا علوی', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
        { id: 3, name: 'پرهام رحیمی', avatar: 'https://randomuser.me/api/portraits/men/62.jpg' },
    ],
    files: initialFiles,
    checklist: [
        { id: 1, text: 'ارتباط بین مشتری سفرنامه 24', completed: true },
        { id: 2, text: 'تماس با مشتریان حقوقی کلیدی سفرنامه 24', completed: false },
        { id: 3, text: 'صدور فاکتور برای مشتریان', completed: false },
        { id: 4, text: 'خرید هاست و دامین', completed: false },
    ],
    chatHistory: mockChatHistory,
  },
  { 
    id: 2, adminName: 'علیرضا علوی', title: 'ارتباط بین همکاران سفرنامه 24', status: 'انجام شده',
    description: 'این یک تسک تستی است.',
    startDate: '۱۴۰۲/۰۵/۰۱', endDate: '۱۴۰۲/۰۵/۰۴',
    supervisors: [
        { id: 15, name: 'User 3', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    ],
    files: [],
    checklist: [
        { id: 1, text: 'آیتم ۱', completed: true },
        { id: 2, text: 'آیتم ۲', completed: true },
    ],
     chatHistory: [
        { id: 1, sender: 'علیرضا علوی', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', timestamp: '۳ روز پیش', isCurrentUser: false, type: 'text', content: 'این تسک تکمیل شده است.' }
    ]
  },
  { 
    id: 3, adminName: 'پرهام رحیمی', title: 'ارتباط بین همکاران سفرنامه 24', status: 'در حال انجام',
    description: 'توضیحات مربوط به تسک پرهام رحیمی.',
    startDate: '۱۴۰۲/۰۶/۰۱', endDate: '۱۴۰۲/۰۶/۱۵',
    supervisors: [
        { id: 13, name: 'User 1', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { id: 16, name: 'User 4', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
        { id: 17, name: 'User 5', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
    ],
    chatHistory: [],
   },
  { id: 4, adminName: 'محمد علی خاکیان', title: 'ارتباط بین همکاران سفرنامه 24', status: 'در حال انجام', description: '', startDate: '', endDate: '', supervisors: [], chatHistory: [] },
  { id: 5, adminName: 'حسن خلیلی پور', title: 'ارتباط بین همکاران سفرنامه 24', status: 'انجام شده', description: '', startDate: '', endDate: '', supervisors: [], chatHistory: [] },
  { id: 6, adminName: 'امیر حسین کریمیان', title: 'ارتباط بین همکاران سفرنامه 24', status: 'در حال انجام', description: '', startDate: '', endDate: '', supervisors: [], chatHistory: [] },
  { id: 7, adminName: 'علیرضا کمکیان', title: 'ارتباط بین همکاران سفرنامه 24', status: 'انجام شده', description: '', startDate: '', endDate: '', supervisors: [], chatHistory: [] },
  { id: 8, adminName: 'امیر پاشا اسکندری', title: 'ارتباط بین همکاران سفرنامه 24', status: 'در حال انجام', description: '', startDate: '', endDate: '', supervisors: [], chatHistory: [] },
  { id: 9, adminName: 'امیرحسین قره‌خانی', title: 'ارتباط بین همکاران سفرنامه 24', status: 'در حال انجام', description: '', startDate: '', endDate: '', supervisors: [], chatHistory: [] },
  { id: 10, adminName: 'آرش حسینی', title: 'ارتباط بین همکاران سفرنامه 24', status: 'انجام شده', description: '', startDate: '', endDate: '', supervisors: [], chatHistory: [] },
  { id: 11, adminName: 'سارا محمدی', title: 'ارتباط بین همکاران سفرنامه 24', status: 'در حال انجام', description: '', startDate: '', endDate: '', supervisors: [], chatHistory: [] },
  { id: 12, adminName: 'نیما رضایی', title: 'ارتباط بین همکاران سفرنامه 24', status: 'انجام شده', description: '', startDate: '', endDate: '', supervisors: [], chatHistory: [] },
];

// لیست تمام کاربران برای استفاده در مودال انتخاب کاربر
const allUsersForModal: UserReference[] = [
    { id: 1, name: 'علیرضا آذرخش آلوچه', avatar: 'https://randomuser.me/api/portraits/men/34.jpg' },
    { id: 2, name: 'علیرضا علوی', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
    { id: 3, name: 'پرهام رحیمی', avatar: 'https://randomuser.me/api/portraits/men/62.jpg' },
    { id: 4, name: 'محمد علی خاکیان', avatar: 'https://randomuser.me/api/portraits/men/63.jpg' },
    { id: 5, name: 'حسن خلیلی پور', avatar: 'https://randomuser.me/api/portraits/men/81.jpg' },
    { id: 6, name: 'امیر حسین کریمیان', avatar: 'https://randomuser.me/api/portraits/men/83.jpg' },
    { id: 7, name: 'علیرضا کمکیان', avatar: 'https://randomuser.me/api/portraits/men/85.jpg' },
    { id: 8, name: 'امیر پاشا اسکندری', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 9, name: 'سارا محمدی', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { id: 10, name: 'نیما رضایی', avatar: 'https://randomuser.me/api/portraits/men/36.jpg' },
    { id: 11, name: 'امیرحسین قره‌خانی', avatar: 'https://randomuser.me/api/portraits/men/37.152.178.211jpg' },
    { id: 12, name: 'آرش حسینی', avatar: 'https://randomuser.me/api/portraits/men/38.jpg' },
    { id: 13, name: 'User 1', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 14, name: 'User 2', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 15, name: 'User 3', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { id: 16, name: 'User 4', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: 17, name: 'User 5', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
];

// کامپوننت برای نمایش نشان وضعیت تسک
const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
    const styles: Record<TaskStatus, string> = {
        'در حال انجام': 'bg-[#FFFBEB] text-[#F59E0B] dark:bg-yellow-900/50 dark:text-yellow-400',
        'انجام شده': 'bg-[#F0FDF4] text-[#22C55E] dark:bg-green-900/50 dark:text-green-400',
        'در حال برسی': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
    };
    return (
        <span className={`inline-flex justify-center items-center w-28 px-3 py-1.5 text-xs font-semibold rounded-md ${styles[status] || ''}`}>
            {status}
        </span>
    );
};

// کامپوننت برای نمایش یک ردیف تسک
const TaskRow: React.FC<{ task: Task; rowNumber: number; onDelete: () => void; onView: () => void; }> = ({ task, rowNumber, onDelete, onView }) => {
    return (
        <>
            {/* نمای کارت برای موبایل */}
            <div className="block lg:hidden p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{task.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{task.adminName}</p>
                    </div>
                    <StatusBadge status={task.status}/>
                </div>
                <div className="flex items-center justify-end gap-2 mt-4">
                    <button onClick={onView} className="bg-[#353535] dark:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-xs whitespace-nowrap hover:bg-opacity-90 dark:hover:bg-opacity-80">
                        مشاهده تسک
                    </button>
                    <button onClick={onDelete} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-md">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* نمای ردیف جدول برای دسکتاپ */}
            <div className="hidden lg:grid grid-cols-[auto_1fr_2fr_1.5fr_1.5fr] items-center py-4 border-gray-200 dark:border-gray-700 border-b last:border-b-0 text-sm text-gray-700 dark:text-gray-300 gap-4">
                 <div className="flex justify-center pr-4">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold w-10 h-10 flex items-center justify-center rounded-lg">{String(rowNumber).padStart(2, '0')}</span>
                </div>
                <div className="text-center font-semibold text-gray-800 dark:text-gray-200 pr-4">{task.adminName}</div>
                <div className="text-center font-medium pr-4">{task.title}</div>
                <div className="text-center pr-4">
                    <StatusBadge status={task.status}/>
                </div>
                <div className="flex items-center justify-end gap-2 px-2">
                    <button onClick={onView} className="bg-[#353535] dark:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-xs whitespace-nowrap hover:bg-opacity-90 dark:hover:bg-opacity-80">
                        مشاهده تسک
                    </button>
                    <button onClick={onDelete} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-md">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
    )
}

interface AdminTaskListProps {
  onTaskStatusChange: () => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

const AdminTaskList: React.FC<AdminTaskListProps> = ({ onTaskStatusChange, onShowToast }) => {
    // state برای نگهداری لیست کل تسک‌ها، با خواندن از localStorage
    const [tasks, setTasks] = useState<Task[]>(() => {
        try {
            const savedTasks = localStorage.getItem('adminTasks');
            return savedTasks ? JSON.parse(savedTasks) : tasksData;
        } catch (error) {
            console.error("Failed to parse tasks from localStorage", error);
            return tasksData;
        }
    });
    
    // state برای صفحه فعلی
    const [currentPage, setCurrentPage] = useState(1);
    // state برای متن جستجو
    const [searchQuery, setSearchQuery] = useState('');
    // state برای مودال تایید حذف
    const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; task: Task | null }>({ isOpen: false, task: null });
    // state برای مودال مشاهده جزئیات تسک
    const [viewModalState, setViewModalState] = useState<{ isOpen: boolean; taskId: number | null }>({ isOpen: false, taskId: null });
    // state برای مودال ایجاد تسک
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    // state برای نگهداری تسکی که در حال ویرایش است
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 8;
    const quotaErrorToastShown = useRef(false);
    
    // ذخیره تسک‌ها در localStorage هنگام تغییر
    useEffect(() => {
        try {
            localStorage.setItem('adminTasks', JSON.stringify(tasks));
            quotaErrorToastShown.current = false; // Reset if save is successful
        } catch (error) {
            if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
                
                if (!quotaErrorToastShown.current) {
                    console.error("Quota exceeded! Saving tasks without file content.", error);
                    onShowToast('فضای ذخیره‌سازی مرورگر پر است! تسک ذخیره شد اما فایل‌های حجیم پس از بازخوانی در دسترس نخواهند بود.', 'error');
                    quotaErrorToastShown.current = true;
                }
                
                const lightTasks = tasks.map(task => {
                    const lightTask: Task = { ...task };

                    if (lightTask.files) {
                        lightTask.files = lightTask.files.map(file => {
                            const lightFile = { ...file };
                            delete lightFile.content;
                            return lightFile;
                        });
                    }

                    if (lightTask.chatHistory) {
                        lightTask.chatHistory = lightTask.chatHistory.map(message => {
                            if (['audio', 'image', 'video', 'file'].includes(message.type) && message.content?.startsWith('data:')) {
                                return { ...message, content: '' };
                            }
                            return message;
                        });
                    }
                    return lightTask;
                });

                try {
                    localStorage.setItem('adminTasks', JSON.stringify(lightTasks));
                } catch (nestedError) {
                    console.error("Failed to save even the light version of tasks.", nestedError);
                    if (!quotaErrorToastShown.current) {
                        onShowToast('خطا: ذخیره اطلاعات اولیه تسک نیز با مشکل مواجه شد.', 'error');
                        quotaErrorToastShown.current = true;
                    }
                }
            } else {
                console.error("Failed to save tasks to localStorage", error);
            }
        }
    }, [tasks, onShowToast]);

    // شبیه‌سازی بارگذاری
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // تابع برای حذف یک تسک
    const handleDeleteTask = (idToDelete: number) => {
        setTasks(prev => prev.filter(task => task.id !== idToDelete));
    };

     // تابع برای افزودن تسک جدید
     const handleAddTask = (taskData: Omit<Task, 'id' | 'status'>) => {
        const initialChatMessages: ChatMessage[] = (taskData.files || []).map((file, index) => ({
            id: Date.now() + index,
            sender: 'شما', // Or a system user
            avatar: 'https://randomuser.me/api/portraits/men/0.jpg',
            timestamp: 'اکنون',
            isCurrentUser: true,
            type: 'file', // Can be improved to detect file type
            content: file.content || '',
            fileInfo: {
                name: file.name,
                size: file.size,
            },
        }));

        const newTask: Task = {
            id: Math.max(0, ...tasks.map(t => t.id)) + 1,
            ...taskData,
            status: 'در حال برسی',
            chatHistory: initialChatMessages,
        };
        setTasks(prevTasks => [newTask, ...prevTasks]);
        setCurrentPage(1); // بازگشت به صفحه اول پس از افزودن
        setCreateModalOpen(false);
    };

    // تابع برای به‌روزرسانی یک تسک موجود
    const handleUpdateTask = (updatedTask: Task) => {
        const originalTask = tasks.find(t => t.id === updatedTask.id);
        
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
            )
        );
        
        setEditingTask(null); // بستن مودال ویرایش پس از به‌روزرسانی

        // اگر وضعیت تسک تغییر کرده باشد، نوتیفیکیشن را نمایش بده
        if (originalTask && originalTask.status !== updatedTask.status) {
            onTaskStatusChange();
        }
    };

    // تابع برای باز کردن مودال ویرایش
    const handleOpenEditModal = (task: Task) => {
        setEditingTask(task);
    };

    // فیلتر کردن تسک‌ها بر اساس جستجو با استفاده از useMemo برای بهینه‌سازی
    const filteredTasks = useMemo(() => {
        if (!searchQuery.trim()) {
            return tasks;
        }
        const lowercasedQuery = searchQuery.toLowerCase().trim();
        return tasks.filter(task => 
            task.adminName.toLowerCase().includes(lowercasedQuery) ||
            task.title.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery, tasks]);
    
    // محاسبه تعداد کل صفحات
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

    // تابع برای تغییر صفحه
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // برش دادن تسک‌های فیلتر شده برای نمایش در صفحه فعلی
    const paginatedTasks = filteredTasks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // توابع مربوط به مودال حذف
    const handleOpenDeleteModal = (task: Task) => {
        setDeleteModalState({ isOpen: true, task });
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalState({ isOpen: false, task: null });
    };

    const handleConfirmDelete = () => {
        if (deleteModalState.task) {
            // Optimistic UI: Delete immediately from state
            handleDeleteTask(deleteModalState.task.id);
            onShowToast('تسک مورد نظر با موفقیت حذف شد', 'success');
        }
        handleCloseDeleteModal();
    };
    
    // توابع مربوط به مودال مشاهده
    const handleOpenViewModal = (task: Task) => {
        setViewModalState({ isOpen: true, taskId: task.id });
    };

    const handleCloseViewModal = () => {
        setViewModalState({ isOpen: false, taskId: null });
    };

    // پیدا کردن تسک فعلی برای نمایش در مودال مشاهده
    const currentTaskForModal = viewModalState.taskId
        ? tasks.find(task => task.id === viewModalState.taskId)
        : null;

    if (isLoading) {
        return <AdminTaskListSkeleton />;
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex-1 flex flex-col overflow-y-auto scrollbar-right">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    {/* فیلد جستجو */}
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="جستجوی نام ادمین یا تسک..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 pr-10 pl-4 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-right" />
                        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    {/* دکمه ایجاد تسک جدید */}
                    <button
                        onClick={() => setCreateModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-[#6D28D9] text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-opacity-90 transition-colors w-full sm:w-auto"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>ایجاد تسک جدید</span>
                    </button>
                </div>

                {/* بدنه لیست تسک‌ها */}
                <div className="flex-1">
                    {/* هدر جدول (فقط دسکتاپ) */}
                    <div className="hidden lg:grid grid-cols-[auto_1fr_2fr_1.5fr_1.5fr] items-center px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm font-semibold text-gray-500 dark:text-gray-400 gap-4">
                        <div className="text-center pr-4">ردیف</div>
                        <div className="text-center pr-4">نام ادمین</div>
                        <div className="text-center pr-4">عنوان تسک</div>
                        <div className="text-center pr-4">وضعیت</div>
                        <div className="text-left px-2"></div>
                    </div>
                    <div>
                        {paginatedTasks.length > 0 ? (
                            paginatedTasks.map((task, index) => (
                                <TaskRow 
                                    key={task.id} 
                                    task={task} 
                                    rowNumber={(currentPage - 1) * itemsPerPage + index + 1}
                                    onDelete={() => handleOpenDeleteModal(task)} 
                                    onView={() => handleOpenViewModal(task)}
                                />
                            ))
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                                نتیجه ای یافت نشد.
                            </div>
                        )}
                    </div>
                </div>

                {/* صفحه‌بندی */}
                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {/* مودال تایید حذف */}
            <ConfirmationModal
                isOpen={deleteModalState.isOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="آیا از حذف این تسک مطمئن هستید؟"
                message={
                    <>
                        آیا از حذف تسک "<strong className="font-bold text-gray-700 dark:text-gray-300">{deleteModalState.task?.title}</strong>" برای ادمین{' '}
                        <strong className="font-bold text-gray-700 dark:text-gray-300">{deleteModalState.task?.adminName}</strong>{' '}
                        مطمئن هستید؟
                    </>
                }
            />

            {/* مودال ایجاد/ویرایش تسک */}
            <CreateTaskModal
                isOpen={isCreateModalOpen || !!editingTask}
                onClose={() => {
                    setCreateModalOpen(false);
                    setEditingTask(null);
                }}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                taskToEdit={editingTask}
                allUsers={allUsersForModal}
            />
            {/* مودال مشاهده تسک */}
            {currentTaskForModal && (
                <ViewTaskModal
                    isOpen={viewModalState.isOpen}
                    onClose={handleCloseViewModal}
                    task={currentTaskForModal}
                    onUpdateTask={handleUpdateTask}
                    onEditRequest={() => handleOpenEditModal(currentTaskForModal)}
                    onShowToast={onShowToast}
                />
            )}
        </>
    );
};

export default AdminTaskList;