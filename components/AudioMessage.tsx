
import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon } from './icons';

// Helper function to determine if a color is dark
const isColorDark = (hexColor: string): boolean => {
    if (!hexColor || !hexColor.startsWith('#')) return false;
    
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hexColor = hexColor.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    if (!result) return false;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance < 0.5;
};

interface AudioMessageProps {
    audioUrl: string; // آدرس فایل صوتی
    isCurrentUser?: boolean; // آیا این پیام برای کاربر فعلی است؟ (برای استایل‌دهی متفاوت)
    customBubbleColor?: string;
}

const AudioMessage: React.FC<AudioMessageProps> = ({ audioUrl, isCurrentUser, customBubbleColor }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState('00:00');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    useEffect(() => {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        const setAudioData = () => {
            if (audio.duration && isFinite(audio.duration)) {
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60);
                setDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        }
        
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
            audio.src = '';
        };
    }, [audioUrl]);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    const waveformBars = React.useMemo(() => 
        Array.from({ length: 40 }, (_, i) => ((i * 11 + 17) % 26) + 4),
    []);

    const isCustomColorDark = customBubbleColor ? isColorDark(customBubbleColor) : false;

    const playButtonBg = customBubbleColor
        ? (isCustomColorDark ? 'bg-white/20' : 'bg-transparent backdrop-blur-xs')
        : (isCurrentUser ? 'bg-gray-300/80 dark:bg-gray-500/80' : 'bg-gray-300 dark:bg-gray-600');

    const playButtonIconColor = customBubbleColor
        ? (isCustomColorDark ? 'text-white' : 'text-gray-800')
        : 'text-gray-800 dark:text-gray-200';

    const waveformBg = customBubbleColor
        ? (isCustomColorDark ? 'bg-white/50' : 'bg-transparent backdrop-blur-xs')
        : (isCurrentUser ? 'bg-gray-400/80 dark:bg-gray-400/80' : 'bg-gray-600 dark:bg-gray-400');
    
    const durationColor = customBubbleColor
        ? (isCustomColorDark ? 'text-gray-200' : 'text-gray-700')
        : (isCurrentUser ? 'text-gray-600 dark:text-gray-300' : 'text-gray-300 dark:text-gray-300');

    return (
        <div className="flex items-center gap-3 w-full">
            <button 
                onClick={togglePlayPause}
                className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${playButtonBg} ${playButtonIconColor}`}
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
                {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5 pl-0.5" />}
            </button>
            <div className="flex items-center gap-0.5 h-8 flex-grow min-w-0 overflow-hidden">
                {waveformBars.map((height, i) => (
                    <div 
                        key={i} 
                        className={`w-[3px] rounded-full ${waveformBg}`}
                        style={{ height: `${height}px` }}
                    ></div>
                ))}
            </div>
            <span className={`text-xs font-mono flex-shrink-0 ${durationColor}`}>{duration}</span>
        </div>
    );
};

export default AudioMessage;
