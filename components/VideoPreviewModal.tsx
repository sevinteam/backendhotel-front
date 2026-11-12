import React, { useEffect } from 'react';
import { XIcon } from './icons';

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
}

const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({ isOpen, onClose, videoUrl }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !videoUrl) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-transparent backdrop-blur-xs dark:bg-transparent backdrop-blur-xs flex items-center justify-center z-[100] transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] w-auto h-auto transform transition-all duration-300 scale-95"
        style={isOpen ? { transform: 'scale(1)', opacity: 1 } : { transform: 'scale(0.95)', opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
          <video
            src={videoUrl}
            controls
            autoPlay
            controlsList="nodownload nofullscreen"
            className="block max-w-full max-h-full rounded-lg"
            style={{ maxHeight: 'calc(90vh - 1rem)' }} // Ensure padding is respected
          />
        </div>
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors z-10"
          aria-label="Close video preview"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default VideoPreviewModal;
