import React from 'react';
import { XIcon } from './icons';
import type { UploadedFile } from '../types';

interface FileListModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: UploadedFile[];
  onView: (file: UploadedFile) => void;
}

const getActionForFile = (fileName: string): 'مشاهده' | 'دانلود' => {
    if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName) || /\.(mp4|webm|ogg)$/i.test(fileName)) {
        return 'مشاهده';
    }
    return 'دانلود';
};

// کامپوننت برای نمایش یک ردیف فایل (با طراحی واکنش‌گرا)
const FileRow: React.FC<{ file: UploadedFile, onView: () => void }> = ({ file, onView }) => {
    const actionText = getActionForFile(file.name);
    return (
    <>
        {/* نمای موبایل */}
        <div className="md:hidden p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-3">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{file.uploader}</p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-left">
                    <p>{file.format}</p>
                    <p>{file.size}</p>
                </div>
            </div>
            <div className="flex justify-end items-center gap-2 mt-2">
                <button onClick={onView} className="font-semibold py-2 px-4 rounded-lg text-xs whitespace-nowrap h-8 transition-colors bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">{actionText}</button>
            </div>
        </div>

        {/* نمای دسکتاپ */}
        <tr className="hidden md:table-row border-b border-gray-200 dark:border-gray-700 last:border-0 text-sm text-gray-700 dark:text-gray-300">
            <td className="px-4 py-3 text-right font-semibold">{file.uploader}</td>
            <td className="px-4 py-3 text-right">{file.name}</td>
            <td className="px-4 py-3 text-center">{file.format}</td>
            <td className="px-4 py-3 text-center">{file.size}</td>
            <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                    <button onClick={onView} className="font-semibold py-1.5 px-4 rounded-lg text-xs whitespace-nowrap h-8 transition-colors bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">{actionText}</button>
                </div>
            </td>
        </tr>
    </>
)};

const FileListModal: React.FC<FileListModalProps> = ({ isOpen, onClose, files, onView }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex justify-center items-center z-[70] transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 my-8 mx-4 max-w-2xl w-full transform transition-all duration-300 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* هدر مودال */}
        <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">لیست فایل ها</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* بدنه مودال (لیست فایل‌ها) */}
        <div className="py-6 flex-1 overflow-y-auto pr-2 scrollbar-right">
            <table className="hidden md:table w-full border-collapse">
                <thead>
                    <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                        <th className="px-4 py-2 text-right">بارگذاری توسط</th>
                        <th className="px-4 py-2 text-right">نام فایل</th>
                        <th className="px-4 py-2 text-center">فرمت</th>
                        <th className="px-4 py-2 text-center">حجم</th>
                        <th className="px-4 py-2 text-left">عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map(file => (
                        <FileRow key={file.id} file={file} onView={() => onView(file)} />
                    ))}
                </tbody>
            </table>
            <div className="md:hidden">
                 {files.map(file => (
                    <FileRow key={file.id} file={file} onView={() => onView(file)} />
                ))}
            </div>
             {files.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">فایلی برای نمایش وجود ندارد.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default FileListModal;