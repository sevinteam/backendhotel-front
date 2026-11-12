
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { XIcon, PlayIcon, PauseIcon } from './icons';

interface SavedAudio {
  id: number;
  url: string;
}

interface AudioGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  audios: SavedAudio[];
}

const toPersianDigits = (n: string): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(n).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const AudioItem: React.FC<{ audio: SavedAudio }> = ({ audio }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState('۰۰:۰۰');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audioElement = new Audio(audio.url);
        audioRef.current = audioElement;

        const setAudioData = () => {
            if (audioElement.duration && isFinite(audioElement.duration)) {
                const minutes = Math.floor(audioElement.duration / 60);
                const seconds = Math.floor(audioElement.duration % 60);
                const durationString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                setDuration(toPersianDigits(durationString));
            }
        };

        const handleEnded = () => setIsPlaying(false);

        audioElement.addEventListener('loadedmetadata', setAudioData);
        audioElement.addEventListener('ended', handleEnded);

        return () => {
            audioElement.removeEventListener('loadedmetadata', setAudioData);
            audioElement.removeEventListener('ended', handleEnded);
            audioElement.pause();
        };
    }, [audio.url]);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(console.error);
            }
            setIsPlaying(!isPlaying);
        }
    };

    const waveformBars = useMemo(() => 
        Array.from({ length: 40 }, (_, i) => ((i * 7 + 13) % 20) + 4),
    []);

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg gap-4">
            <button 
                onClick={togglePlayPause}
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 transition-colors"
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
                {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5 pl-0.5" />}
            </button>
            <div className="flex items-center gap-0.5 h-6 flex-grow min-w-0 overflow-hidden">
                {waveformBars.map((height, i) => (
                    <div 
                        key={i} 
                        className="w-[3px] rounded-full bg-gray-300 dark:bg-gray-500"
                        style={{ height: `${height}px` }}
                    ></div>
                ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{duration}</span>
        </div>
    );
};


const AudioGalleryModal: React.FC<AudioGalleryModalProps> = ({ isOpen, onClose, audios }) => {
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
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">صداهای ذخیره شده</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Audio List */}
        <div className="py-6 flex-1 overflow-y-auto pr-2 scrollbar-right text-right space-y-3">
          {audios.length > 0 ? (
            audios.map(audio => (
              <AudioItem key={audio.id} audio={audio} />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              هیچ صدایی ذخیره نشده است.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioGalleryModal;
