import React, { useState, useEffect, useRef, useMemo } from 'react';
import { XIcon, PaperclipIcon, PencilIcon, SendIcon, MicrophoneIcon, ClipboardListIcon, StopIcon, DocumentTextIcon, PlayIcon } from './icons';
import type { Task, ChecklistItem, ChatMessage, UploadedFile } from '../types';
import ImagePreviewModal from './ImagePreviewModal';
import AudioMessage from './AudioMessage';
import FileListModal from './FileListModal';
import ChecklistModal from './ChecklistModal';
import VideoPreviewModal from './VideoPreviewModal';

interface ViewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
  onEditRequest: (task: Task) => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

// کامپوننت نشان وضعیت
const StatusBadge: React.FC<{ status: Task['status'] }> = ({ status }) => {
    const styles: Record<Task['status'], string> = {
        'در حال انجام': 'bg-orange-100 text-orange-600 dark:bg-amber-900/50 dark:text-amber-400',
        'انجام شده': 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
        'در حال برسی': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
    };
    return (
        <div className={`py-1 px-4 rounded-md text-center text-xs font-semibold ${styles[status]}`}>
            {status}
        </div>
    );
};


const ViewTaskModal: React.FC<ViewTaskModalProps> = ({ isOpen, onClose, task, onUpdateTask, onEditRequest, onShowToast }) => {
  // state برای متن پیام جدید
  const [newMessage, setNewMessage] = useState('');
  // state برای آدرس تصویر در حال پیش‌نمایش
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  // state برای وضعیت ضبط صدا
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'stopping'>('idle');
  // state برای تب فعال در نمای موبایل
  const [activeMobileTab, setActiveMobileTab] = useState<'chat' | 'details'>('chat');
  
  // Ref ها برای دسترسی به عناصر DOM
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // state برای کنترل مودال‌های داخلی
  const [isFileListModalOpen, setFileListModalOpen] = useState(false);
  const [isChecklistModalOpen, setChecklistModalOpen] = useState(false);

  const ID_OFFSET = 1_000_000;

  const allTaskFiles = useMemo((): UploadedFile[] => {
      // Using a Map to ensure uniqueness based on a key (name + size)
      // This will keep the first-encountered version of a file.
      const uniqueFiles = new Map<string, UploadedFile>();

      const addFileToMap = (file: UploadedFile) => {
          const key = `${file.name}|${file.size}`;
          if (!uniqueFiles.has(key)) {
              uniqueFiles.set(key, file);
          }
      };
      
      // Add files from initial task creation first.
      (task.files || []).forEach(file => addFileToMap({ ...file }));
      
      // Then, add files from chat history. Duplicates will be ignored.
      (task.chatHistory || [])
        .filter(msg => ['file', 'image', 'video', 'audio'].includes(msg.type) && msg.fileInfo)
        .forEach(msg => {
            addFileToMap({
              id: msg.id + ID_OFFSET, // ID will be from chat message, which is fine.
              name: msg.fileInfo!.name,
              size: msg.fileInfo!.size || 'N/A',
              uploader: msg.sender,
              format: `.${msg.fileInfo!.name.split('.').pop() || 'file'}`,
              content: msg.content,
            });
        });

      return Array.from(uniqueFiles.values());
  }, [task.files, task.chatHistory]);
  
  // مدیریت اسکرول بدنه صفحه هنگام باز و بسته شدن مودال
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveMobileTab('chat'); // بازنشانی به تب چت
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // اسکرول به پایین چت با هر تغییر
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [task.chatHistory, activeMobileTab]);
  
  // تنظیم ارتفاع خودکار textarea
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

  // تابع برای به‌روزرسانی بخشی از اطلاعات تسک
  const handleUpdate = (updatedProps: Partial<Task>) => {
    let newStatus = updatedProps.status || task.status;
    const checklist = updatedProps.checklist || task.checklist || [];
    
    // اگر چک‌لیست تغییر کرده، وضعیت تسک را بر اساس آن به‌روز کن
    if ('checklist' in updatedProps) {
      const allCompleted = checklist.length > 0 && checklist.every(item => item.completed);
      newStatus = allCompleted ? 'انجام شده' : 'در حال انجام';
    }

    onUpdateTask({ ...task, ...updatedProps, status: newStatus });
  };
 
  // تابع برای افزودن یک پیام جدید به چت
  const addMessageToChat = (message: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now(),
    };
    handleUpdate({ chatHistory: [...(task.chatHistory || []), newMessage]});
  }

  // ارسال پیام متنی
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    addMessageToChat({
        sender: 'شما',
        avatar: 'https://randomuser.me/api/portraits/men/0.jpg',
        timestamp: 'اکنون',
        isCurrentUser: true,
        type: 'text',
        content: newMessage.trim(),
    });
    setNewMessage('');
  }
  
  // ارسال فایل (تصویر، ویدیو، داکیومنت و...)
  const handleFileSend = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
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
                  timestamp: 'اکنون',
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
      }
      if (event.target) event.target.value = '';
  };
  
  // شروع و پایان ضبط صدا
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
                        timestamp: 'اکنون',
                        isCurrentUser: true,
                        type: 'audio',
                        content: e.target?.result as string,
                    });
                };
                reader.readAsDataURL(audioBlob);
                stream.getTracks().forEach(track => track.stop()); // آزاد کردن میکروفون
                setRecordingStatus('idle');
            };

            recorder.start();
            setRecordingStatus('recording');
        } catch (error) {
            console.error("Microphone permission denied:", error);
        }
    }
  };

  // ذخیره تغییرات چک‌لیست
  const handleChecklistSave = (updatedChecklist: ChecklistItem[]) => {
    handleUpdate({ checklist: updatedChecklist });
    setChecklistModalOpen(false);
  };
  
    const handleViewFile = (file: UploadedFile) => {
        const fileContent = file.content;
        if (!fileContent) {
            onShowToast('محتوای این فایل به دلیل محدودیت فضای ذخیره‌سازی در دسترس نیست.', 'error');
            return;
        }
        
        const fileName = file.name;
        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);
        const isVideo = /\.(mp4|webm|ogg)$/i.test(fileName);
        
        // Determine file type from chat message if possible, otherwise rely on extension
        let fileTypeFromChat: string | undefined;
        if(file.id >= ID_OFFSET) {
            const sourceMessage = (task.chatHistory || []).find(msg => (msg.id + ID_OFFSET) === file.id);
            fileTypeFromChat = sourceMessage?.type;
        }

        if (isImage || fileTypeFromChat === 'image') {
            setImagePreviewUrl(fileContent);
            return;
        }

        if (isVideo || fileTypeFromChat === 'video') {
            setVideoPreviewUrl(fileContent);
            return;
        }

        // For other types (pdf, zip, rar, docx, etc.), force download.
        const link = document.createElement('a');
        link.href = fileContent;
        link.download = fileName;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  // محاسبه درصد پیشرفت چک‌لیست
  const completedItems = task.checklist?.filter(item => item.completed).length || 0;
  const totalItems = task.checklist?.length || 0;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  
  const progressBarColorClass =
    task.status === 'انجام شده' || Math.round(progress) === 100
      ? 'bg-green-500'
      : task.status === 'در حال انجام'
      ? 'bg-orange-400'
      : 'bg-indigo-500';

  const getSubtitle = () => {
    const creator = 'ابوالفضل آبیاری';
    
    const allAdminNames = new Set<string>();
    if (task.adminName && task.adminName !== 'بدون ادمین') {
        allAdminNames.add(task.adminName);
    }
    if (task.admins) {
        task.admins.forEach(admin => allAdminNames.add(admin.name));
    }
    
    const assignedAdmins = Array.from(allAdminNames).filter(Boolean);

    if (assignedAdmins.length > 0) {
        return `ارتباط بین ${creator} با ${assignedAdmins.join(' و ')}`;
    }
    return `تسک مربوط به ${creator}`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-50 transition-opacity duration-300"
        onClick={onClose}
      >
        <div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-6xl h-full lg:h-[90vh] lg:max-h-[800px] transform transition-all duration-300 relative flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* هدر و تب‌های موبایل */}
          <div className="lg:hidden flex-shrink-0">
              <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                  <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 truncate pr-4">{task.title}</h3>
                  <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                      <XIcon className="w-6 h-6" />
                  </button>
              </div>
              <div className="flex border-b dark:border-gray-700">
                  <button
                      onClick={() => setActiveMobileTab('chat')}
                      className="relative flex-1 py-3 text-sm font-semibold text-center"
                  >
                      <span className={activeMobileTab === 'chat' ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'}>ارتباط</span>
                      {activeMobileTab === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-400"></div>}
                  </button>
                  <button
                      onClick={() => setActiveMobileTab('details')}
                      className="relative flex-1 py-3 text-sm font-semibold text-center"
                  >
                      <span className={activeMobileTab === 'details' ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'}>جزئیات تسک</span>
                      {activeMobileTab === 'details' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-400"></div>}
                  </button>
              </div>
          </div>
          
          <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto min-h-0">
              {/* پنل چت (سمت راست) */}
              <div className={`flex-1 bg-[#F9F9F9] dark:bg-gray-900 flex-col h-full min-h-0 ${activeMobileTab === 'chat' ? 'flex' : 'hidden'} lg:flex`}>
                  <div className="hidden lg:block flex-shrink-0 px-8 py-6 text-right">
                      <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">{task.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{getSubtitle()}</p>
                  </div>
                <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-right flex flex-col task-chat-scrollbar">
                    {(task.chatHistory || []).map(msg => {
                        const bubbleClasses = msg.isCurrentUser
                            ? 'bg-[#F1F1F1] text-gray-800 dark:bg-gray-700 dark:text-gray-200 shadow-sm rounded-t-xl rounded-br-xl'
                            : 'bg-[#353535] text-white shadow-sm rounded-t-xl rounded-bl-xl';

                        return (
                        <div key={msg.id} className={`w-full flex ${msg.isCurrentUser ? 'justify-start' : 'justify-end'}`}>
                          <div className={`flex items-end gap-3 max-w-[85%] sm:max-w-[75%] ${!msg.isCurrentUser ? 'flex-row-reverse' : ''}`}>
                              <img src={msg.avatar} alt={msg.sender} className="w-9 h-9 rounded-full flex-shrink-0" />
                              <div className={`flex flex-col w-full ${msg.isCurrentUser ? 'items-start' : 'items-end'}`}>
                                  <div className={`flex items-center gap-2 mb-1 ${!msg.isCurrentUser ? 'flex-row-reverse' : ''}`}>
                                      <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{msg.sender}</span>
                                      <span className="text-xs text-gray-400 dark:text-gray-500">{msg.timestamp}</span>
                                  </div>
                                  <div className={`relative max-w-full text-sm overflow-hidden break-words ${bubbleClasses}`}>
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
                                    {msg.type === 'audio' && <div className="p-3"><AudioMessage audioUrl={msg.content} isCurrentUser={msg.isCurrentUser} /></div>}
                                    {msg.type === 'file' && msg.fileInfo && (
                                        (() => {
                                            const isViewable = /\.(pdf|docx?)$/i.test(msg.fileInfo!.name);
                                            return (
                                                <a
                                                    href={msg.content}
                                                    download={isViewable ? undefined : msg.fileInfo.name}
                                                    target={isViewable ? "_blank" : "_self"}
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-xl"
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
                    )})}
                </div>
                {/* ورودی پیام */}
                <div className="p-4 bg-[#F9F9F9] dark:bg-gray-900 flex-shrink-0">
                  <div className="relative bg-white dark:bg-gray-700/50 rounded-full flex items-center p-2">
                      <div className="flex items-center gap-2 pr-2 flex-shrink-0">
                          <button 
                              onClick={handleSendMessage} 
                              className="bg-violet-600 text-white w-9 h-9 flex items-center justify-center rounded-full hover:bg-violet-700 transition-colors flex-shrink-0"
                          >
                              <SendIcon className="w-5 h-5" />
                          </button>
                          <button onClick={handleToggleRecording} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover-text-gray-300 p-1">
                              {recordingStatus === 'recording' ? <StopIcon className="w-6 h-6 text-red-500" /> : <MicrophoneIcon className="w-6 h-6"/>}
                          </button>
                           <input type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.zip,.rar" ref={fileInputRef} onChange={handleFileSend} className="hidden" />
                          <button onClick={() => fileInputRef.current?.click()} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover-text-gray-300 p-1">
                              <PaperclipIcon className="w-6 h-6" />
                          </button>
                      </div>
                      <textarea 
                          ref={textareaRef}
                          rows={1}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                          placeholder="پیام خود را بنویسید..."
                          className="flex-grow bg-transparent focus:outline-none resize-none text-right text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 self-center px-3"
                          style={{ minHeight: '24px' }}
                      />
                  </div>
                </div>
              </div>

              {/* پنل جزئیات (سمت چپ) */}
              <div className={`w-full lg:max-w-sm flex-shrink-0 bg-white dark:bg-gray-800 flex-col lg:border-r border-gray-100 dark:border-gray-700/50 ${activeMobileTab === 'details' ? 'flex' : 'hidden'} lg:flex`}>
                <div className="hidden lg:flex justify-between items-center p-6 border-b dark:border-gray-700/50">
                    <button onClick={() => onEditRequest(task)} className="flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 font-semibold hover:underline flex-shrink-0">
                        <PencilIcon className="w-4 h-4" />
                        <span>ویرایش تسک</span>
                    </button>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-right space-y-6 text-right task-chat-scrollbar">
                    <div className='flex justify-between items-center text-right'>
                        <div>
                            <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-1">عنوان تسک</h4>
                            <p className="text-base font-bold text-gray-800 dark:text-gray-200">{task.title}</p>
                        </div>
                        <button onClick={() => onEditRequest(task)} className="lg:hidden flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 font-semibold hover:underline flex-shrink-0 ml-2">
                            <PencilIcon className="w-4 h-4" />
                            <span>ویرایش تسک</span>
                        </button>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">توضیحات</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-h-24 overflow-y-auto scrollbar-right pl-4 pr-4 break-words">{task.description}</p>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">وضعیت</h4>
                        <div className="flex items-center gap-4">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                <div className={`${progressBarColorClass} h-1.5 rounded-full transition-all duration-500`} style={{width: `${progress}%`}}></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{Math.round(progress)}%</span>
                        </div>
                        <div className="mt-3">
                            <StatusBadge status={task.status} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">تاریخ شروع تسک</h4>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{task.startDate}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">تاریخ اتمام تسک</h4>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{task.endDate}</p>
                        </div>
                    </div>

                    {task.admins && task.admins.length > 0 && (
                      <div>
                          <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">ادمین ها</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                              {task.admins.map(admin => (
                                  <img key={admin.id} src={admin.avatar} alt={admin.name} className="w-9 h-9 rounded-full" title={admin.name}/>
                              ))}
                          </div>
                      </div>
                    )}

                    {task.supervisors && task.supervisors.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">ناظرها</h4>
                            <div className="flex items-center gap-2 flex-wrap">
                                {task.supervisors.map(s => (
                                    <img key={s.id} src={s.avatar} alt={s.name} className="w-9 h-9 rounded-full" title={s.name}/>
                                ))}
                            </div>
                        </div>
                    )}
                    
                </div>
                {/* دکمه‌های عملیات در فوتر پنل جزئیات */}
                <div className="p-6 flex-shrink-0 space-y-3 border-t border-gray-100 dark:border-gray-700/50">
                    <button 
                        onClick={() => setFileListModalOpen(true)} 
                        className="w-full text-center p-3 rounded-lg text-sm font-semibold bg-[#F2F2F2] dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={allTaskFiles.length === 0}
                    >
                        مشاهده فایل های ضمیمه
                    </button>
                    <button onClick={() => setChecklistModalOpen(true)} className="w-full text-center p-3 rounded-lg text-sm font-semibold bg-violet-600 text-white flex items-center justify-center gap-2 hover:bg-violet-700 transition-colors">
                        <ClipboardListIcon className="w-5 h-5"/>
                        <span>چک لیست</span>
                    </button>
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* مودال پیش‌نمایش تصویر */}
      {imagePreviewUrl && (
        <ImagePreviewModal 
            isOpen={!!imagePreviewUrl}
            onClose={() => setImagePreviewUrl(null)}
            imageUrl={imagePreviewUrl}
        />
      )}
      
      {/* مودال پیش‌نمایش ویدیو */}
      <VideoPreviewModal
        isOpen={!!videoPreviewUrl}
        onClose={() => setVideoPreviewUrl(null)}
        videoUrl={videoPreviewUrl}
      />
      
      {/* مودال لیست فایل‌ها */}
      <FileListModal 
        isOpen={isFileListModalOpen}
        onClose={() => setFileListModalOpen(false)}
        files={allTaskFiles}
        onView={handleViewFile}
      />

      {/* مودال چک‌لیست */}
      <ChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setChecklistModalOpen(false)}
        checklist={task.checklist || []}
        onSave={handleChecklistSave}
       />
    </>
  );
};

export default ViewTaskModal;