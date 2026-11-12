
import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { User, ChatMessage, Ticket } from '../types';
import { 
    SearchIcon, PlusIcon, DocumentTextIcon, MicrophoneIcon, 
    SendIcon, PhotoIcon, VideoIcon, AudioIcon, SquareIcon, ChevronLeftIcon, 
    UserIcon, PaperclipIcon, StopIcon, LockClosedIcon, ChevronRightIcon, PlayIcon,
    ChevronDownIcon, LockOpenIcon, DotsVerticalIcon, XIcon
} from './icons';
import ImagePreviewModal from './ImagePreviewModal';
import AudioMessage from './AudioMessage';
import VideoPreviewModal from './VideoPreviewModal';
import ImageGalleryModal from './ImageGalleryModal';
import VideoGalleryModal from './VideoGalleryModal';
import DocumentGalleryModal from './DocumentGalleryModal';
import AudioGalleryModal from './AudioGalleryModal';
import BackgroundColorModal from './BackgroundColorModal';
import ChatBubbleColorModal from './ChatBubbleColorModal';
import ConfirmationModal from './ConfirmationModal';

// Helper function to determine if a color is dark
const isColorDark = (hexColor: string): boolean => {
    if (!hexColor || !hexColor.startsWith('#')) return false;
    
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hexColor = hexColor.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    if (!result) return false;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    // Using the luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance < 0.5;
};

// Order of Persian months for sorting
const PERSIAN_MONTHS_ORDER = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];


const mockTickets: (Omit<Ticket, 'messages' | 'lastMessageFrom'> & { messages?: ChatMessage[]; lastMessageFrom?: 'user' | 'support' })[] = [
    { 
        id: 1, 
        title: '349812', 
        avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
        status: 'open', 
        lastUpdate: '۱۴۰۴/۰۸/۲۴', 
        unreadCount: 12, 
        lastMessageFrom: 'user',
        department: 'پشتیبانی',
        isNew: true,
        messages: [
            { id: 1, sender: 'علیرضا آذرخش آلوچه', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', timestamp: 'دیروز ساعت ۱۱:۰۵', isCurrentUser: false, type: 'file', content: '', fileInfo: { name: 'Resume.pdf', size: '2.56Mb' } },
            { id: 2, sender: 'علیرضا آذرخش آلوچه', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', timestamp: '1404.08.12, 7:35 PM', isCurrentUser: false, type: 'video', content: 'https://www.w3schools.com/html/mov_bbb.mp4', fileInfo: { name: 'test video.mp4', size: '4.3 MB' } },
            { id: 3, sender: 'شما', avatar: 'https://randomuser.me/api/portraits/men/0.jpg', timestamp: 'دیروز ساعت ۱۱:۰۵', isCurrentUser: true, type: 'text', content: 'ممنون، لطفا پس از بررسی اطلاع دهید.' },
            { id: 4, sender: 'علیرضا آذرخش آلوچه', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', timestamp: 'دیروز ساعت ۱۱:۰۵', isCurrentUser: false, type: 'text', content: 'حتما، تا فردا ظهر بهتون اطلاع میدم حتما.' },
            { id: 5, sender: 'شما', avatar: 'https://randomuser.me/api/portraits/men/0.jpg', timestamp: 'دیروز ساعت ۱۲:۰۵', isCurrentUser: true, type: 'text', content: 'سلام، چه خبر؟' },
            { id: 6, sender: 'علیرضا آذرخش آلوچه', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', timestamp: 'دیروز ساعت ۱۲:۱۰', isCurrentUser: false, type: 'image', content: 'https://picsum.photos/400/300' },
            { id: 7, sender: 'شما', avatar: 'https://randomuser.me/api/portraits/men/0.jpg', timestamp: 'دیروز ساعت ۱۲:۱۵', isCurrentUser: true, type: 'text', content: 'خوبم، فقط منتظر پاسخ شما بودم.' },
            { id: 8, sender: 'علیرضا آذرخش آلوچه', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', timestamp: 'دیروز ساعت ۱۲:۲۰', isCurrentUser: false, type: 'audio', content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', fileInfo: { name: 'voice-message.mp3' } },
            { id: 9, sender: 'شما', avatar: 'https://randomuser.me/api/portraits/men/0.jpg', timestamp: 'دیروز ساعت ۱۲:۲۵', isCurrentUser: true, type: 'text', content: 'ممنون از شما.' },
            { id: 10, sender: 'علیرضا آذرخش آلوچه', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', timestamp: 'دیروز ساعت ۱۲:۳۰', isCurrentUser: false, type: 'text', content: 'خواهش می‌کنم، در خدمتم.' },
            { id: 11, sender: 'شما', avatar: 'https://randomuser.me/api/portraits/men/0.jpg', timestamp: 'دیروز ساعت ۱۲:۳۵', isCurrentUser: true, type: 'file', content: '', fileInfo: { name: 'document.docx', size: '1.2Mb' } },
            { id: 12, sender: 'علیرضا آذرخش آلوچه', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', timestamp: 'دیروز ساعت ۱۲:۴۰', isCurrentUser: false, type: 'file', content: '', fileInfo: { name: 'archive.zip', size: '10.1Mb' } },
        ]
    },
    { 
        id: 2, 
        title: '782873', 
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
        status: 'open', 
        lastUpdate: '۱۴۰۴/۰۸/۲۴', 
        unreadCount: 17, 
        lastMessageFrom: 'support',
        department: 'فروش',
        isNew: false,
        messages: [
             { id: 1, sender: 'شما', avatar: 'https://randomuser.me/api/portraits/men/0.jpg', timestamp: 'امروز ساعت ۱۰:۰۰', isCurrentUser: true, type: 'text', content: 'سلام، وقت بخیر. آیا آپدیتی برای تیکت من وجود دارد؟' },
        ]
    },
    { 
        id: 3, 
        title: '519342', 
        avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
        status: 'open', 
        lastUpdate: '۱۴۰۴/۰۸/۲۳', 
        unreadCount: 0, 
        lastMessageFrom: 'user',
        department: 'مالی',
        isNew: false,
        messages: []
    },
    { 
        id: 4, 
        title: '990147',
        avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
        status: 'closed',
        lastUpdate: '۱۴۰۴/۰۳/۱۵',
        month: 'خرداد ماه ۱۴۰۴',
        unreadCount: 67,
        lastMessageFrom: 'support',
        department: 'پشتیبانی',
        isNew: false,
        messages: [
            { id: 1, sender: 'علیرضا آذرخش آلوچه', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', timestamp: '۱۴۰۴/۰۳/۱۰', isCurrentUser: false, type: 'text', content: 'سلام، این یک تیکت از ماه خرداد است.' },
            { id: 2, sender: 'شما', avatar: 'https://randomuser.me/api/portraits/men/0.jpg', timestamp: '۱۴۰۴/۰۳/۱۰', isCurrentUser: true, type: 'text', content: 'سلام، دریافت شد.' },
        ]
    },
    { 
        id: 5, 
        title: '302851',
        avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
        status: 'closed',
        lastUpdate: '۱۴۰۴/۰۳/۲۱',
        month: 'خرداد ماه ۱۴۰۴',
        unreadCount: 0, 
        lastMessageFrom: 'user',
        department: 'فنی',
        isNew: false,
        messages: [
            { id: 1, sender: 'علیرضا آذرخش آلوچه', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', timestamp: '۱۴۰۴/۰۳/۲۰', isCurrentUser: false, type: 'text', content: 'این یک تیکت دیگر است.' },
        ]
    },
    { 
        id: 6, 
        title: '647209',
        avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
        status: 'closed',
        lastUpdate: '۱۴۰۴/۰۴/۰۱',
        month: 'تیر ماه ۱۴۰۴',
        lastMessageFrom: 'user',
        department: 'مدیریت',
        isNew: false,
        messages: []
    },
];


const UserTicketTab: React.FC<{ user: User; theme: string; }> = ({ user, theme }) => {
    const initialUserTickets = useMemo(() => {
         return mockTickets.map(ticket => {
            const updatedMessages = (ticket.messages || []).map(msg => {
                if (!msg.isCurrentUser) {
                    return { ...msg, sender: user.name, avatar: user.avatar };
                }
                return msg;
            });
            return {
                ...ticket,
                avatar: user.avatar,
                messages: updatedMessages,
                isNew: ticket.isNew === undefined ? ticket.lastMessageFrom === 'user' && (ticket.unreadCount || 0) > 0 : ticket.isNew,
            };
        });
    }, [user]);

    const [tickets, setTickets] = useState<Ticket[]>(() => {
        try {
            const savedTicketsJSON = localStorage.getItem(`userTickets_${user.id}`);
            if (savedTicketsJSON) {
                return JSON.parse(savedTicketsJSON);
            }
        } catch (error) {
            console.error("Error reading tickets from localStorage", error);
        }
        return initialUserTickets.map(t => ({...t, messages: t.messages || []}));
    });
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
    const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'stopping'>('idle');
    const [rightPanelTab, setRightPanelTab] = useState<'tickets' | 'info'>('tickets');
    
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
    const [isMobileInfoVisible, setIsMobileInfoVisible] = useState(false);
    const [expandedMonths, setExpandedMonths] = useState<string[]>(['خرداد ماه ۱۴۰۴']);
    const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
    const [isVideoGalleryOpen, setIsVideoGalleryOpen] = useState(false);
    const [isAudioGalleryOpen, setIsAudioGalleryOpen] = useState(false);
    const [isDocumentGalleryOpen, setIsDocumentGalleryOpen] = useState(false);
    const [isBgColorModalOpen, setIsBgColorModalOpen] = useState(false);
    const [isChatBubbleColorModalOpen, setIsChatBubbleColorModalOpen] = useState(false);
    const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
    
    const [chatBackground, setChatBackground] = useState('');
    const [chatBubbleColor, setChatBubbleColor] = useState('');


    const chatContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const openTickets = useMemo(() => tickets.filter(t => t.status === 'open'), [tickets]);
    
    const closedTicketsByMonth = useMemo(() => {
        return tickets.reduce((acc, ticket) => {
            if (ticket.status === 'closed' && ticket.month) {
                acc[ticket.month] = [...(acc[ticket.month] || []), ticket];
            }
            return acc;
        }, {} as Record<string, Ticket[]>);
    }, [tickets]);
    
    const filteredOpenTickets = useMemo(() => {
        if (!searchQuery.trim()) return openTickets;
        return openTickets.filter(t => t.title.includes(searchQuery.trim()));
    }, [openTickets, searchQuery]);

    const filteredClosedTicketsByMonth = useMemo(() => {
        if (!searchQuery.trim()) return closedTicketsByMonth;
        
        const filtered: Record<string, Ticket[]> = {};
        for (const month in closedTicketsByMonth) {
            const monthTickets = closedTicketsByMonth[month].filter(t => t.title.includes(searchQuery.trim()));
            if (monthTickets.length > 0) {
                filtered[month] = monthTickets;
            }
        }
        return filtered;
    }, [closedTicketsByMonth, searchQuery]);

    const closedTicketMonths = useMemo(() => {
        const months = Object.keys(filteredClosedTicketsByMonth);
        
        const parseMonthYear = (monthStr: string) => {
            const parts = monthStr.split(' ماه ');
            const monthName = parts[0];
            const year = parseInt(parts[1].replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()), 10);
            const monthIndex = PERSIAN_MONTHS_ORDER.indexOf(monthName);
            return { year, monthIndex };
        };

        return months.sort((a, b) => {
            const { year: yearA, monthIndex: monthA } = parseMonthYear(a);
            const { year: yearB, monthIndex: monthB } = parseMonthYear(b);

            if (yearA !== yearB) {
                return yearB - yearA;
            }
            return monthB - monthA;
        });
    }, [filteredClosedTicketsByMonth]);
    
    const imagesForGallery = useMemo(() => {
        if (!activeTicket || !activeTicket.messages) {
            return [];
        }

        return activeTicket.messages
            .filter(msg => msg.type === 'image' && msg.content)
            .map((msg, index) => ({
                id: msg.id,
                name: msg.fileInfo?.name || `image-${index + 1}.jpg`,
                size: msg.fileInfo?.size || 'Unknown',
                timestamp: msg.timestamp,
                thumbnailUrl: msg.content,
                downloadUrl: msg.content,
            }));
    }, [activeTicket]);

    const videosForGallery = useMemo(() => {
        if (!activeTicket || !activeTicket.messages) {
            return [];
        }

        return activeTicket.messages
            .filter(msg => msg.type === 'video' && msg.content)
            .map((msg, index) => ({
                id: msg.id,
                name: msg.fileInfo?.name || `video-${index + 1}.mp4`,
                size: msg.fileInfo?.size || 'Unknown',
                timestamp: msg.timestamp,
                thumbnailUrl: msg.avatar,
                downloadUrl: msg.content,
            }));
    }, [activeTicket]);
    
    const audiosForGallery = useMemo(() => {
        if (!activeTicket || !activeTicket.messages) {
            return [];
        }

        return activeTicket.messages
            .filter(msg => msg.type === 'audio' && msg.content)
            .map(msg => ({
                id: msg.id,
                url: msg.content,
            }));
    }, [activeTicket]);

    const documentsForGallery = useMemo(() => {
        if (!activeTicket || !activeTicket.messages) {
            return [];
        }

        const docFileTypes = ['zip', 'pdf', 'rar', 'doc', 'docx', 'xls', 'xlsx'];

        return activeTicket.messages
            .filter(msg => {
                if (msg.type !== 'file' || !msg.content || !msg.fileInfo) {
                    return false;
                }
                const name = msg.fileInfo.name.toLowerCase();
                return docFileTypes.some(ext => name.endsWith(`.${ext}`));
            })
            .map(msg => ({
                id: msg.id,
                name: msg.fileInfo!.name,
                size: msg.fileInfo!.size || 'Unknown',
                timestamp: msg.timestamp,
                downloadUrl: msg.content,
            }));
    }, [activeTicket]);

    const chatDateHeader = useMemo(() => {
        if (!activeTicket) {
            return "تاریخچه گفتگو";
        }
        if (activeTicket.status === 'closed' && activeTicket.month) {
            return `چت های ${activeTicket.month}`;
        }
        try {
            const today = new Date();
            const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            const parts = formatter.formatToParts(today);
            const day = parts.find(p => p.type === 'day')?.value || '';
            const month = parts.find(p => p.type === 'month')?.value || '';
            const year = (parts.find(p => p.type === 'year')?.value || '').replace('ه‍.ش.', '').trim();
            
            return `${day} ${month} ${year}`;
        } catch (e) {
            console.error("Failed to format Persian date:", e);
            return 'امروز';
        }
    }, [activeTicket]);

    const chatBgStyle = useMemo((): React.CSSProperties => {
        if (!chatBackground) return {};
        if (chatBackground.startsWith('http')) {
            return { backgroundImage: `url(${chatBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' };
        }
        return { backgroundColor: chatBackground };
    }, [chatBackground]);

    const isBgDark = useMemo(() => {
        if (chatBackground.startsWith('http')) {
            return true;
        }
        return isColorDark(chatBackground);
    }, [chatBackground]);
    
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 1024);
            if (width >= 1024 && mobileView === 'chat') {
                setMobileView('list');
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [mobileView]);

    useEffect(() => {
        localStorage.setItem(`userTickets_${user.id}`, JSON.stringify(tickets));
    }, [tickets, user.id]);


    useEffect(() => {
        // This effect runs once on mount to set the initial active ticket
        // without overriding the localStorage state.
        const firstOpenTicket = tickets.find(t => t.status === 'open');
        if (!isMobile && !activeTicket && firstOpenTicket) {
             setActiveTicket(firstOpenTicket);
        }
    }, [isMobile, tickets, activeTicket]);

    useEffect(() => {
        const lightBgDefault = '#F3F4F6';
        const darkBgDefault = 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop';
        const lightBubbleDefault = '#353535';
        const darkBubbleDefault = '#374151';
    
        const savedBg = localStorage.getItem(`chatBackground_${theme}_${user.id}`);
        setChatBackground(savedBg || (theme === 'dark' ? darkBgDefault : lightBgDefault));
    
        const savedBubbleColor = localStorage.getItem(`chatBubbleColor_${theme}_${user.id}`);
        setChatBubbleColor(savedBubbleColor || (theme === 'dark' ? darkBubbleDefault : lightBubbleDefault));
    }, [theme, user.id]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [activeTicket?.messages, mobileView]);

    const handleTextareaInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            const maxHeight = 96; 
            if (scrollHeight > maxHeight) {
                textareaRef.current.style.height = `${maxHeight}px`;
                textareaRef.current.style.overflowY = 'auto';
            } else {
                textareaRef.current.style.height = `${scrollHeight}px`;
                textareaRef.current.style.overflowY = 'hidden';
            }
        }
    };

    useEffect(handleTextareaInput, [newMessage]);
    
    const getCurrentTime = () => new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', hour12: false });

    const addMessageToChat = (message: Omit<ChatMessage, 'id'>) => {
        if (!activeTicket) return;

        const newMsg: ChatMessage = { ...message, id: Date.now() };

        const updatedTickets = tickets.map(ticket => {
            if (ticket.id === activeTicket.id) {
                const isUserMessage = !message.isCurrentUser;
                const isReopening = isUserMessage && ticket.status === 'closed';

                const lastMessageFrom: 'user' | 'support' = isUserMessage ? 'user' : 'support';
                
                const newUnreadCount = isUserMessage
                    ? (ticket.unreadCount || 0) + 1
                    : 0; // Admin message resets unread count

                return { 
                    ...ticket, 
                    status: isReopening ? ('open' as const) : ticket.status,
                    month: isReopening ? undefined : ticket.month,
                    messages: [...(ticket.messages || []), newMsg],
                    lastMessageFrom,
                    unreadCount: newUnreadCount,
                    isNew: isUserMessage,
                };
            }
            return ticket;
        });

        setTickets(updatedTickets);
        setActiveTicket(prev => prev ? updatedTickets.find(t => t.id === prev.id) || null : null);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        addMessageToChat({
            sender: 'شما',
            avatar: 'https://randomuser.me/api/portraits/men/0.jpg',
            timestamp: getCurrentTime(),
            isCurrentUser: true,
            type: 'text',
            content: newMessage.trim(),
        });
        setNewMessage('');
    };
    
    const handleFileSend = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            let type: ChatMessage['type'] = 'file';

            if (file.type.startsWith('image/')) {
                type = 'image';
            } else if (file.type.startsWith('video/')) {
                type = 'video';
            } else if (file.type.startsWith('audio/')) {
                type = 'audio';
            }

            addMessageToChat({
                sender: 'شما',
                avatar: 'https://randomuser.me/api/portraits/men/0.jpg',
                timestamp: getCurrentTime(),
                isCurrentUser: true,
                type: type,
                content: content,
                fileInfo: {
                    name: file.name,
                    size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                },
            });
        };
        reader.readAsDataURL(file);

        if (event.target) event.target.value = ''; // Reset input
    };

    const handleToggleRecording = async () => {
        if (recordingStatus === 'recording') {
            mediaRecorderRef.current?.stop();
            setRecordingStatus('stopping');
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);
                mediaRecorderRef.current = recorder;
                const audioChunks: Blob[] = [];

                recorder.ondataavailable = (event) => audioChunks.push(event.data);

                recorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        addMessageToChat({
                            sender: 'شما',
                            avatar: 'https://randomuser.me/api/portraits/men/0.jpg',
                            timestamp: getCurrentTime(),
                            isCurrentUser: true,
                            type: 'audio',
                            content: e.target?.result as string,
                        });
                    };
                    reader.readAsDataURL(audioBlob);
                    stream.getTracks().forEach(track => track.stop());
                    setRecordingStatus('idle');
                };

                recorder.start();
                setRecordingStatus('recording');
            } catch (error) {
                console.error("Microphone permission denied:", error);
            }
        }
    };

    const handleTicketSelect = (ticket: Ticket) => {
        const updatedTickets = tickets.map(t => 
            t.id === ticket.id ? { ...t, unreadCount: 0, isNew: false } : t
        );
        setTickets(updatedTickets);
        
        const ticketToActivate = updatedTickets.find(t => t.id === ticket.id);
        setActiveTicket(ticketToActivate || null);

        if (isMobile) {
            setMobileView('chat');
        }
    };
    
    const handleBackToList = () => {
        setActiveTicket(null);
        setMobileView('list');
    };
    
    const toggleMonth = (month: string) => {
        setExpandedMonths(prev =>
            prev.includes(month)
                ? prev.filter(m => m !== month)
                : [...prev, month]
        );
    };

    const getPersianMonthYear = (date: Date): string => {
        const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            year: 'numeric',
            month: 'long',
        });
        const parts = formatter.formatToParts(date);
        const month = parts.find(p => p.type === 'month')?.value || '';
        const year = (parts.find(p => p.type === 'year')?.value || '').replace('ه‍.ش.', '').trim();
        return `${month} ماه ${year}`;
    };

    const handleCloseTicket = () => {
        if (!activeTicket) return;

        const monthYear = getPersianMonthYear(new Date());

        const updatedTickets = tickets.map(t => 
            t.id === activeTicket.id 
            ? { ...t, status: 'closed' as const, month: monthYear, unreadCount: 0 } 
            : t
        );

        setTickets(updatedTickets);
        setActiveTicket(null);
        if (isMobile) {
            setMobileView('list');
        }
        setIsCloseConfirmOpen(false);
    };

    const handleReopenTicket = () => {
        if (!activeTicket || activeTicket.status !== 'closed') return;

        const updatedTickets = tickets.map(t => 
            t.id === activeTicket.id 
            ? { ...t, status: 'open' as const, month: undefined } 
            : t
        );

        setTickets(updatedTickets);
        setActiveTicket(prev => prev ? updatedTickets.find(t => t.id === prev.id) || null : null);
    };
    
    const handleCreateTicket = () => {
        const today = new Date();
        const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const persianDate = formatter.format(today);
        
        const generateChatId = () => String(Math.floor(100000 + Math.random() * 900000));
        const newTicket: Ticket = {
            id: Date.now(),
            title: generateChatId(),
            avatar: user.avatar,
            status: 'open',
            lastUpdate: persianDate,
            unreadCount: 0,
            messages: [],
            isNew: false,
            department: 'پشتیبانی', // Default department for new tickets created here
        };
        
        setTickets(prevTickets => [newTicket, ...prevTickets]);
        setActiveTicket(newTicket);
    
        if (isMobile) {
            setMobileView('chat');
        }
    };


    const fileCounts = useMemo(() => {
        if (!activeTicket?.messages) {
            return { documents: 0, photos: 0, audio: 0, video: 0 };
        }

        const docFileTypes = ['zip', 'pdf', 'rar', 'doc', 'docx', 'xls', 'xlsx'];

        return activeTicket.messages.reduce((acc, msg) => {
            if (msg.type === 'image') acc.photos++;
            else if (msg.type === 'audio') acc.audio++;
            else if (msg.type === 'video') acc.video++;
            else if (msg.type === 'file' && msg.fileInfo) {
                const name = msg.fileInfo.name.toLowerCase();
                if (docFileTypes.some(ext => name.endsWith(`.${ext}`))) {
                    acc.documents++;
                }
            }
            return acc;
        }, { documents: 0, photos: 0, audio: 0, video: 0 });

    }, [activeTicket]);

    const InfoPanelContent = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">فایل های ذخیره</h2>
                <div className="space-y-3">
                    <button onClick={() => setIsDocumentGalleryOpen(true)} disabled={fileCounts.documents === 0} className="w-full text-right flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                        <div className="flex items-center gap-3"><div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><DocumentTextIcon className="w-5 h-5 text-gray-500 dark:text-gray-400"/></div><div><p className="text-sm font-semibold text-gray-800 dark:text-gray-200">داکیومنت</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-px">{fileCounts.documents} فایل</p></div></div>
                        <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <button onClick={() => setIsImageGalleryOpen(true)} disabled={fileCounts.photos === 0} className="w-full text-right flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                        <div className="flex items-center gap-3"><div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><PhotoIcon className="w-5 h-5 text-gray-500 dark:text-gray-400"/></div><div><p className="text-sm font-semibold text-gray-800 dark:text-gray-200">عکس</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-px">{fileCounts.photos} فایل</p></div></div>
                        <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <button onClick={() => setIsAudioGalleryOpen(true)} disabled={fileCounts.audio === 0} className="w-full text-right flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                        <div className="flex items-center gap-3"><div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><AudioIcon className="w-5 h-5 text-gray-500 dark:text-gray-400"/></div><div><p className="text-sm font-semibold text-gray-800 dark:text-gray-200">صدا</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-px">{fileCounts.audio} فایل</p></div></div>
                        <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <button onClick={() => setIsVideoGalleryOpen(true)} disabled={fileCounts.video === 0} className="w-full text-right flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                        <div className="flex items-center gap-3"><div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><VideoIcon className="w-5 h-5 text-gray-500 dark:text-gray-400"/></div><div><p className="text-sm font-semibold text-gray-800 dark:text-gray-200">ویدیو</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-px">{fileCounts.video} فایل</p></div></div>
                        <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>
            <div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">تنظیمات چت</h2>
                <div className="space-y-3">
                    <button onClick={() => setIsBgColorModalOpen(true)} className="w-full text-right flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center gap-3"><div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400"/></div><div><p className="text-sm font-semibold text-gray-800 dark:text-gray-200">پس زمینه</p></div></div><ChevronLeftIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <button onClick={() => setIsChatBubbleColorModalOpen(true)} className="w-full text-right flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><SquareIcon className="w-5 h-5 text-gray-500 dark:text-gray-400"/></div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">رنگ چت تایم</p>
                            </div>
                        </div>
                        <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>
        </div>
    );
    
    // FIX: The TicketListItem component was incorrectly typed, causing TypeScript to fail when a `key` prop was passed.
    // I've changed its signature to use `React.FC` to correctly type it as a React component.
    // I also removed a redundant `key` prop from the inner button element.
    const TicketListItem: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
        const lastMessage = ticket.messages.length > 0 ? ticket.messages[ticket.messages.length - 1] : null;
        let lastMessagePreview: React.ReactNode = ticket.lastMessageFrom === 'support' ? 'پاسخ داده شده' : 'پاسخ داده نشده';

        if (lastMessage) {
            if (lastMessage.type === 'text') {
                lastMessagePreview = lastMessage.content;
            } else if (lastMessage.type === 'image') {
                lastMessagePreview = <span className="flex items-center gap-1"><PhotoIcon className="w-4 h-4" /> تصویر</span>;
            } else if (lastMessage.type === 'video') {
                lastMessagePreview = <span className="flex items-center gap-1"><VideoIcon className="w-4 h-4" /> ویدیو</span>;
            } else if (lastMessage.type === 'audio') {
                lastMessagePreview = <span className="flex items-center gap-1"><AudioIcon className="w-4 h-4" /> پیام صوتی</span>;
            } else if (lastMessage.type === 'file') {
                lastMessagePreview = <span className="flex items-center gap-1"><DocumentTextIcon className="w-4 h-4" /> فایل</span>;
            }
        }

        return (
            <button 
                onClick={() => handleTicketSelect(ticket)} 
                className={`w-full text-right p-3 rounded-xl flex items-start gap-3 transition-colors ${activeTicket?.id === ticket.id ? 'bg-white dark:bg-gray-700' : 'hover:bg-gray-200/50 dark:hover:bg-gray-800/50'}`}
            >
                <div className="relative flex-shrink-0">
                    <img src={ticket.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                    {ticket.isNew && (
                        <span className="absolute top-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500 border-2 border-gray-100 dark:border-gray-900"></span>
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{ticket.title}</p>
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{ticket.lastUpdate}</span>
                    </div>
                    {/* Display department if available */}
                    {ticket.department && <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5 mb-0.5">{ticket.department}</p>}
                    <div className="flex justify-between items-start mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate pr-1">{lastMessagePreview}</p>
                        {ticket.unreadCount != null && ticket.unreadCount > 0 && (
                            <span className="bg-violet-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">{ticket.unreadCount}</span>
                        )}
                    </div>
                </div>
            </button>
        );
    };

    const isTicketClosed = activeTicket?.status === 'closed';

    if (!user) return null;

    return (
        <>
            <div className={`flex-1 min-h-0 w-full h-full max-h-screen overflow-hidden ${isMobile ? 'flex flex-col' : 'grid gap-5 lg:grid-cols-[22rem_1fr]'}`}>
                
                 <aside className={`bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl flex flex-col h-full min-w-0 overflow-hidden ${isMobile && mobileView !== 'list' ? 'hidden' : 'flex'}`}>
                    <div className="bg-white dark:bg-gray-800 p-1 rounded-xl hidden lg:flex items-center text-sm font-semibold flex-shrink-0">
                        <button onClick={() => setRightPanelTab('tickets')} className={`flex-1 py-2 text-center rounded-lg transition-colors ${rightPanelTab === 'tickets' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow' : 'text-gray-500 dark:text-gray-400'}`}>چت ها</button>
                        <button onClick={() => setRightPanelTab('info')} className={`flex-1 py-2 text-center rounded-lg transition-colors ${rightPanelTab === 'info' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow' : 'text-gray-500 dark:text-gray-400'}`}>اطلاعات</button>
                    </div>

                    {rightPanelTab === 'tickets' ? (
                        <>
                            <div className="relative my-4 flex-shrink-0">
                                <input
                                    type="text"
                                    placeholder="جستجوی شناسه چت..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border-transparent focus:border-violet-500 focus:ring-violet-500 rounded-lg py-2.5 pr-10 pl-4 text-sm"
                                />
                                <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-h-0 grid grid-rows-2 gap-4">
                                <div className="flex flex-col min-h-0">
                                    <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex-shrink-0 px-2">چت های باز</h2>
                                    <div className="overflow-y-auto pr-1 scrollbar-right task-chat-scrollbar flex-1 min-h-0">
                                        <div className="space-y-1">
                                            {filteredOpenTickets.map(ticket => <TicketListItem key={ticket.id} ticket={ticket} />)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col min-h-0">
                                     <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex-shrink-0 px-2">چت های بسته شده</h2>
                                     <div className="overflow-y-auto pr-1 scrollbar-right task-chat-scrollbar flex-1 min-h-0">
                                        <div className="space-y-1">
                                            {closedTicketMonths.map(month => {
                                                const isExpanded = expandedMonths.includes(month);
                                                return (
                                                    <div key={month}>
                                                        <button
                                                            onClick={() => toggleMonth(month)}
                                                            className="w-full text-right p-3 rounded-lg flex items-center justify-between gap-3 transition-colors hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
                                                        >
                                                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{month}</span>
                                                            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`} />
                                                        </button>
                                                        {isExpanded && (
                                                            <div className="pl-4 pr-2 pt-2 space-y-1">
                                                                {filteredClosedTicketsByMonth[month]?.map(ticket => <TicketListItem key={ticket.id} ticket={ticket} />)}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleCreateTicket} className="mt-4 w-full flex items-center justify-center gap-2 bg-[#6D28D9] text-white font-semibold py-3 px-5 rounded-lg text-sm hover:bg-opacity-90 transition-colors flex-shrink-0">
                                <PlusIcon className="w-5 h-5" />
                                <span>ایجاد چت جدید</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex-1 overflow-y-auto pr-2 scrollbar-right task-chat-scrollbar mt-4">
                           <InfoPanelContent />
                        </div>
                    )}
                </aside>
                
                <main style={(isMobile && mobileView !== 'chat') ? {} : chatBgStyle} className={`flex flex-col min-h-0 h-full max-h-screen min-w-0 overflow-hidden ${isMobile && mobileView !== 'chat' ? 'hidden' : 'flex'} rounded-2xl ${chatBackground ? '' : 'bg-white dark:bg-[#1C2129]'}`}>
                    {activeTicket ? (
                        <>
                        <div className="flex-shrink-0 bg-white dark:bg-gray-800 p-4 flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 md:hidden">
                            <div className="flex items-center gap-2">
                                {isMobile && (
                                    <button onClick={handleBackToList} className="text-gray-500 dark:text-gray-400 p-2 -mr-2">
                                        <ChevronRightIcon className="w-6 h-6" />
                                    </button>
                                )}
                                <img src={activeTicket.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                                <div className="flex-grow">
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200">{user.name}</h3>
                                    <p className="text-xs text-gray-400">شناسه چت: {activeTicket.title}</p>
                                </div>
                            </div>
                            {isMobile && (
                                <button onClick={() => setIsMobileInfoVisible(true)} className="text-gray-500 dark:text-gray-400 p-2">
                                    <DotsVerticalIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <div className="flex-1 min-h-0 rounded-2xl flex flex-col overflow-hidden min-w-0 bg-transparent">
                            <div ref={chatContainerRef} className="flex-1 overflow-y-auto scrollbar-right task-chat-scrollbar px-6 space-y-6 min-h-[200px]">
                                <div className="py-4 sticky top-0 z-10 bg-transparent">
                                    <div className={`flex items-center text-center backdrop-blur-sm rounded-full py-2 px-4
                                        ${isBgDark
                                            ? 'bg-transparent backdrop-blur-xs'
                                            : 'bg-white/60'
                                        }`}
                                    >
                                        <div className={`flex-grow border-t ${isBgDark ? 'border-gray-200/50' : 'border-gray-500/50'}`}></div>
                                        <span className={`flex-shrink-0 mx-4 text-sm font-semibold 
                                            ${isBgDark
                                                ? 'text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]'
                                                : 'text-gray-800'
                                            }`}
                                        >
                                            {chatDateHeader}
                                        </span>
                                        <div className={`flex-grow border-t ${isBgDark ? 'border-gray-200/50' : 'border-gray-500/50'}`}></div>
                                    </div>
                                </div>
                                {(activeTicket.messages || []).map(msg => {
                                    const isCustomBubbleColorDark = isColorDark(chatBubbleColor);
                                    return (
                                        <div key={msg.id} className={`w-full flex ${msg.isCurrentUser ? 'justify-start' : 'justify-end'}`}>
                                            <div className={`flex items-end gap-3 max-w-[85%] sm:max-w-[75%] min-w-0 ${msg.isCurrentUser ? '' : 'flex-row-reverse'}`}>
                                                <img src={msg.avatar} alt={msg.sender} className="w-9 h-9 rounded-full flex-shrink-0" />
                                                <div className={`flex flex-col w-full ${msg.isCurrentUser ? 'items-start' : 'items-end'}`}>
                                                    <div className={`flex items-center gap-2 mb-1 ${msg.isCurrentUser ? '' : 'flex-row-reverse'}`}>
                                                        <span className={`font-semibold text-sm ${isBgDark ? 'text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]' : 'text-gray-900 dark:text-gray-800'}`}>{msg.sender}</span>
                                                        <span className={`text-xs ${isBgDark ? 'text-gray-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]' : 'text-gray-500 dark:text-gray-500'}`}>{msg.timestamp}</span>
                                                    </div>
                                                    <div
                                                        className={`relative max-w-full text-sm overflow-hidden break-words shadow-sm ${
                                                            msg.isCurrentUser
                                                            ? `rounded-t-xl rounded-br-xl ${isCustomBubbleColorDark ? 'text-white' : 'text-gray-800'}`
                                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-t-xl rounded-bl-xl'
                                                        }`}
                                                        style={msg.isCurrentUser ? { backgroundColor: chatBubbleColor } : {}}
                                                    >
                                                        {msg.type === 'text' && <p className="text-sm leading-relaxed break-all p-3">{msg.content}</p>}
                                                        {msg.type === 'image' && <img src={msg.content} alt="Sent" className="rounded-lg cursor-pointer max-w-full h-auto p-1" onClick={() => setImagePreviewUrl(msg.content)} />}
                                                        {msg.type === 'video' && msg.content && (
                                                            <div className="relative cursor-pointer p-1 group" onClick={() => setVideoPreviewUrl(msg.content)}>
                                                                <video src={msg.content} className="rounded-lg max-w-full h-auto" style={{ maxWidth: '300px' }} />
                                                                <div className="absolute inset-1 flex items-center justify-center backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                    <PlayIcon className="w-12 h-12 text-white" />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {msg.type === 'audio' && <div className="p-3"><AudioMessage audioUrl={msg.content} isCurrentUser={msg.isCurrentUser} customBubbleColor={msg.isCurrentUser ? chatBubbleColor : undefined} /></div>}
                                                        {msg.type === 'file' && msg.fileInfo && (
                                                            (() => {
                                                                const isViewable = /\.(pdf|docx?)$/i.test(msg.fileInfo.name);
                                                                return (
                                                                    <a
                                                                        href={msg.content}
                                                                        download={isViewable ? undefined : msg.fileInfo.name}
                                                                        target={isViewable ? "_blank" : "_self"}
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-3 p-3 cursor-pointer"
                                                                    >
                                                                        <div className="p-3 bg-white dark:bg-gray-600 rounded-full">
                                                                            <DocumentTextIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{msg.fileInfo.name}</p>
                                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{msg.fileInfo.size}</p>
                                                                        </div>
                                                                    </a>
                                                                );
                                                            })()
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                             <div className="flex-shrink-0 p-4 bg-transparent">
                                <div className={`relative bg-white dark:bg-gray-800 rounded-full flex items-center p-2 transition-opacity ${isTicketClosed ? 'opacity-60' : ''}`}>
                                    <div className="flex items-center gap-2 pr-2 flex-shrink-0">
                                        <button onClick={handleSendMessage} disabled={isTicketClosed} className="bg-violet-600 hover:bg-violet-700 transition-colors text-white w-9 h-9 rounded-full flex items-center justify-center shadow-sm disabled:bg-gray-400 dark:disabled:bg-gray-600"><SendIcon className="w-5 h-5" /></button>
                                        <button onClick={handleToggleRecording} disabled={isTicketClosed} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover-text-gray-300 p-1 disabled:text-gray-400 dark:disabled:text-gray-500">{recordingStatus === 'recording' ? <StopIcon className="w-6 h-6 text-red-500" /> : <MicrophoneIcon className="w-6 h-6" />}</button>
                                        <button onClick={() => fileInputRef.current?.click()} disabled={isTicketClosed} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 disabled:text-gray-400 dark:disabled:text-gray-500"><PaperclipIcon className="w-6 h-6" /></button>
                                    </div>
                                    <textarea ref={textareaRef} rows={1} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())} 
                                        placeholder={isTicketClosed ? "این چت بسته شده است. برای ارسال پیام، آن را باز کنید." : "پیام خود را بنویسید..."} 
                                        className="flex-grow bg-transparent focus:outline-none resize-none text-right text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 self-center px-3 disabled:cursor-not-allowed" style={{ minHeight: '24px' }}
                                        disabled={isTicketClosed}
                                    />
                                    <button 
                                        onClick={isTicketClosed ? handleReopenTicket : () => setIsCloseConfirmOpen(true)} 
                                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 pl-2"
                                    >
                                        {isTicketClosed ? <LockOpenIcon className="w-6 h-6" /> : <LockClosedIcon className="w-6 h-6" />}
                                    </button>
                                    <input type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.zip,.rar,.xls,.xlsx" ref={fileInputRef} onChange={handleFileSend} className="hidden" disabled={isTicketClosed}/>
                                </div>
                            </div>
                        </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-[#1C2129] rounded-2xl">
                           <p className="text-gray-500 dark:text-gray-400">یک چت را برای مشاهده انتخاب کنید.</p>
                        </div>
                    )}
                </main>

            </div>
            {imagePreviewUrl && (
                <ImagePreviewModal 
                    isOpen={!!imagePreviewUrl}
                    onClose={() => setImagePreviewUrl(null)}
                    imageUrl={imagePreviewUrl}
                />
            )}

            {videoPreviewUrl && (
                <VideoPreviewModal 
                    isOpen={!!videoPreviewUrl}
                    onClose={() => setVideoPreviewUrl(null)}
                    videoUrl={videoPreviewUrl}
                />
            )}
            
            <ImageGalleryModal
                isOpen={isImageGalleryOpen}
                onClose={() => setIsImageGalleryOpen(false)}
                images={imagesForGallery}
            />

            <VideoGalleryModal
                isOpen={isVideoGalleryOpen}
                onClose={() => setIsVideoGalleryOpen(false)}
                videos={videosForGallery}
            />
            
            <DocumentGalleryModal
                isOpen={isDocumentGalleryOpen}
                onClose={() => setIsDocumentGalleryOpen(false)}
                documents={documentsForGallery}
            />

            <AudioGalleryModal
                isOpen={isAudioGalleryOpen}
                onClose={() => setIsAudioGalleryOpen(false)}
                audios={audiosForGallery}
            />
            
             <BackgroundColorModal
                isOpen={isBgColorModalOpen}
                onClose={() => setIsBgColorModalOpen(false)}
                onSave={(bg) => {
                    setChatBackground(bg);
                    localStorage.setItem(`chatBackground_${theme}_${user.id}`, bg);
                    setIsBgColorModalOpen(false);
                }}
                currentBackground={chatBackground}
            />

            <ChatBubbleColorModal
                isOpen={isChatBubbleColorModalOpen}
                onClose={() => setIsChatBubbleColorModalOpen(false)}
                onSave={(color) => {
                    setChatBubbleColor(color);
                    localStorage.setItem(`chatBubbleColor_${theme}_${user.id}`, color);
                    setIsChatBubbleColorModalOpen(false);
                }}
                currentColor={chatBubbleColor}
                theme={theme}
            />

            <ConfirmationModal
                isOpen={isCloseConfirmOpen}
                onClose={() => setIsCloseConfirmOpen(false)}
                onConfirm={handleCloseTicket}
                title="بستن چت"
                message={<>آیا از بستن این چت برای کاربر "<strong>{user.name}</strong>" با شناسه <strong>{activeTicket?.title}</strong> مطمئن هستید؟</>}
                confirmText="بستن چت"
                cancelText="انصراف"
                icon={<LockClosedIcon className="h-10 w-10 text-red-500" />}
                confirmButtonClass="bg-red-600 hover:bg-red-800"
                iconContainerClass="bg-red-100 dark:bg-red-900/50"
            />
            
            {isMobile && isMobileInfoVisible && (
                <div className="fixed inset-0 z-20" aria-modal="true" role="dialog">
                    {/* Overlay */}
                    <div 
                        className="absolute inset-0 bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs" 
                        onClick={() => setIsMobileInfoVisible(false)}
                    ></div>
                    {/* Panel */}
                    <div className={`absolute top-0 bottom-0 right-0 w-4/5 max-w-[320px] bg-gray-100 dark:bg-gray-900 shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${isMobileInfoVisible ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="flex-shrink-0 p-4 border-b dark:border-gray-700 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200">اطلاعات چت</h3>
                            <button onClick={() => setIsMobileInfoVisible(false)} className="text-gray-500 dark:text-gray-400 p-2 -mr-2">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto scrollbar-right">
                            <InfoPanelContent />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserTicketTab;
