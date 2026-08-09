import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Headphones, SkipForward, SkipBack, Loader2, X } from 'lucide-react';
import { AMAL_ITEMS } from '../data/amalData';
import { recitationPlayer } from '../utils/audioPlayer';

interface ListenModeBarProps {
  onClose?: () => void;
}

export const ListenModeBar: React.FC<ListenModeBarProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const currentItem = AMAL_ITEMS[currentIndex];

  useEffect(() => {
    const unsubscribe = recitationPlayer.subscribe((playingItemId, loading) => {
      setIsLoading(loading);
      if (playingItemId) {
        setIsPlaying(true);
        // Sync current index if item was triggered elsewhere
        const idx = AMAL_ITEMS.findIndex((item) => item.id === playingItemId);
        if (idx !== -1) {
          setCurrentIndex(idx);
        }
      } else if (!loading) {
        setIsPlaying(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const playItemAtIndex = (index: number) => {
    if (index < 0 || index >= AMAL_ITEMS.length) return;
    recitationPlayer.unlockMobileAudio();
    setCurrentIndex(index);
    const item = AMAL_ITEMS[index];

    recitationPlayer.playRecitation(item.id, item.audioUrl, item.arabicText, () => {
      // On ended: automatically play the next item in Listen Mode
      if (index + 1 < AMAL_ITEMS.length) {
        playItemAtIndex(index + 1);
      } else {
        setIsPlaying(false);
      }
    });
  };

  const handleTogglePlay = () => {
    recitationPlayer.unlockMobileAudio();
    if (isPlaying) {
      recitationPlayer.pause();
      setIsPlaying(false);
    } else {
      playItemAtIndex(currentIndex);
    }
  };

  const handleNext = () => {
    recitationPlayer.unlockMobileAudio();
    const nextIdx = (currentIndex + 1) % AMAL_ITEMS.length;
    playItemAtIndex(nextIdx);
  };

  const handlePrev = () => {
    recitationPlayer.unlockMobileAudio();
    const prevIdx = (currentIndex - 1 + AMAL_ITEMS.length) % AMAL_ITEMS.length;
    playItemAtIndex(prevIdx);
  };

  const handleStop = () => {
    recitationPlayer.stop();
    setIsPlaying(false);
  };

  const handleCloseBar = () => {
    recitationPlayer.stop();
    setIsPlaying(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-xl">
      <div className="bg-[#031711]/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.7)] text-slate-100 flex flex-col gap-2 transition-all">
        {/* Top bar info */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${isPlaying ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' : 'bg-emerald-950 text-amber-400/80'}`}>
              <Headphones className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-cinzel text-amber-400/80 font-bold tracking-wider">
                <span>Listen Mode ({currentIndex + 1}/{AMAL_ITEMS.length})</span>
                {isPlaying && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-amber-100 truncate font-arabic">
                {currentItem?.title} — <span className="text-amber-300 font-arabic">{currentItem?.arabicTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] text-amber-300/80 hover:text-amber-200 underline px-1.5 py-1"
            >
              {isExpanded ? 'Hide' : 'Text'}
            </button>
            <button
              onClick={handleCloseBar}
              className="p-1 rounded-full text-amber-300/60 hover:text-amber-200 hover:bg-emerald-900/50 transition-all"
              title="Close Listen Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Optional Expanded Arabic Preview */}
        {isExpanded && currentItem && (
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-amber-500/20 text-center space-y-1 max-h-36 overflow-y-auto">
            <p className="font-arabic text-lg text-amber-200 leading-relaxed dir-rtl" dir="rtl">
              {currentItem.arabicText}
            </p>
            <p className="text-xs text-amber-100/70 italic font-light">
              {currentItem.transliteration}
            </p>
          </div>
        )}

        {/* Playback Controls */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-500/10">
          <div className="text-[11px] text-slate-300/80 font-mono pl-1">
            {currentItem?.targetCount}x Target
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-emerald-900/50 hover:bg-emerald-800/80 text-amber-300 border border-amber-500/20 transition-all active:scale-95"
              title="Previous Wazaif"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className={`p-3 rounded-full border transition-all flex items-center justify-center shadow-lg active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 text-emerald-950 border-amber-300 font-bold shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 border-amber-300 hover:brightness-110 font-bold'
              }`}
              title={isPlaying ? 'Pause' : 'Play All'}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-emerald-950" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-emerald-900/50 hover:bg-emerald-800/80 text-amber-300 border border-amber-500/20 transition-all active:scale-95"
              title="Next Wazaif"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleStop}
              className="p-2 rounded-full bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-all active:scale-95 ml-1"
              title="Stop Listen Mode"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>

          <div className="text-[11px] text-amber-300/80 font-medium pr-1">
            Auto-Next
          </div>
        </div>
      </div>
    </div>
  );
};

