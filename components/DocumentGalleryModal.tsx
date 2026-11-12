import React, { useEffect } from 'react';
import { XIcon, DownloadIcon, DocumentTextIcon } from './icons';

// Define a type for the document data
interface SavedDocument {
  id: number;
  name: string;
  size: string;
  timestamp: string;
  downloadUrl: string;
}

interface DocumentGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: SavedDocument[];
}

const DocumentGalleryModal: React.FC<DocumentGalleryModalProps> = ({ isOpen, onClose, documents }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = (url: string, name: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch(console.error);
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex items-center justify-center z-[70] transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 my-8 mx-4 max-w-lg w-full transform transition-all duration-300 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">داکیومنت های ذخیره شده</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Document List */}
        <div className="py-6 flex-1 overflow-y-auto pr-2 scrollbar-right text-right space-y-4">
          {documents.length > 0 ? (
            documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg flex-shrink-0">
                    <DocumentTextIcon className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{doc.size}, {doc.timestamp}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(doc.downloadUrl, doc.name)}
                  className="flex items-center gap-2 bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400 font-semibold py-2 px-4 rounded-lg text-sm whitespace-nowrap hover:bg-violet-200 dark:hover:bg-violet-900 transition-colors"
                >
                  <DownloadIcon className="w-5 h-5" />
                  <span>دانلود</span>
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              هیچ داکیومنتی ذخیره نشده است.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentGalleryModal;