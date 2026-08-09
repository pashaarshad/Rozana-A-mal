import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  Loader2,
} from 'lucide-react';
import { AmalItem, UserSettings } from '../types';
import { soundService, triggerVibration } from '../utils/sound';
import { recitationPlayer } from '../utils/audioPlayer';

interface FullCounterModalProps {
  item: AmalItem;
  count: number;
  allItems: AmalItem[];
  allCounts: Record<string, number>;
  settings: UserSettings;
  onIncrement: (id: string) => void;
  onResetCount: (id: string) => void;
  onSelectNextItem: (item: AmalItem) => void;
  onSelectPrevItem: (item: AmalItem) => void;
  onClose: () => void;
}

export const FullCounterModal: React.FC<FullCounterModalProps> = ({
  item,
  count,
  allItems,
  allCounts,
  settings,
  onIncrement,
  onResetCount,
  onSelectNextItem,
  onSelectPrevItem,
  onClose,
}) => {
  const [isAnimate, setIsAnimate] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  useEffect(() => {
    const unsubscribe = recitationPlayer.subscribe((playingItemId, loading) => {
      if (playingItemId === item.id) {
        setIsLoadingAudio(loading);
        setIsPlayingAudio(!loading);
      } else {
        setIsPlayingAudio(false);
        setIsLoadingAudio(false);
      }
    });

    return () => unsubscribe();
  }, [item.id]);

  const handleAudioToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    recitationPlayer.playRecitation(item.id, item.audioUrl, item.arabicText);
  };

  const currentIndex = allItems.findIndex((i) => i.id === item.id);
  const isCompleted = count >= item.targetCount;
  const progressPercent = Math.min(100, Math.round((count / item.targetCount) * 100));

  const handleScreenTap = () => {
    if (soundEnabled) soundService.playTap(550 + (count % 7) * 45);
    if (settings.vibrationEnabled) triggerVibration(25);

    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 200);

    onIncrement(item.id);

    // If completing right now
    if (count + 1 === item.targetCount) {
      if (soundEnabled) soundService.playCompletion();
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResetCount(item.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#03130e] text-white p-4 sm:p-6 overflow-hidden select-none animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-2 z-10">
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-emerald-950 border border-amber-500/30 text-amber-200 hover:bg-emerald-900 transition-all"
          title="Close Fullscreen Counter"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <span className="text-xs font-cinzel text-amber-300/80 tracking-widest uppercase">
            DIGITAL TASBEEH MODE
          </span>
          <h2 className="text-base sm:text-lg font-bold font-cinzel gold-text-gradient">
            {item.title} ({item.number})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Recitation Button */}
          <button
            onClick={handleAudioToggle}
            className={`p-3 rounded-full border transition-all flex items-center justify-center ${
              isPlayingAudio
                ? 'bg-amber-500 text-emerald-950 border-amber-400 font-bold shadow-[0_0_12px_rgba(212,175,55,0.5)] animate-pulse'
                : isLoadingAudio
                ? 'bg-emerald-950 text-amber-300 border-amber-500/30'
                : 'bg-emerald-950 text-amber-300 border-amber-500/30 hover:bg-emerald-900'
            }`}
            title={isPlayingAudio ? 'Pause Audio Recitation' : 'Play Audio Recitation'}
          >
            {isLoadingAudio ? (
              <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
            ) : isPlayingAudio ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 rounded-full bg-emerald-950 border border-amber-500/30 text-amber-200 hover:bg-emerald-900 transition-all"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-300" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Tap Container */}
      <div
        onClick={handleScreenTap}
        className="flex-1 flex flex-col items-center justify-between my-4 p-4 rounded-3xl bg-gradient-to-b from-[#0a271f]/80 via-[#051a14]/90 to-[#03130e] border border-amber-500/30 relative overflow-hidden cursor-pointer shadow-2xl active:scale-[0.99] transition-transform"
      >
        {/* Background Islamic Pattern & Glow */}
        <div className="absolute inset-0 islamic-bg-pattern opacity-10 pointer-events-none" />
        {isCompleted && (
          <div className="absolute inset-0 bg-amber-500/10 pointer-events-none animate-pulse" />
        )}

        {/* Top Quranic Display */}
        <div className="w-full max-w-xl text-center pt-2 z-10 max-h-[35vh] overflow-y-auto px-2">
          <div className="font-arabic text-2xl sm:text-3xl text-amber-100 leading-relaxed drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
            {item.arabicText}
          </div>
          {item.transliteration && (
            <p className="text-xs text-emerald-200/80 italic mt-2">
              "{item.transliteration}"
            </p>
          )}
        </div>

        {/* HUGE Center Digit Display with Circular Ring */}
        <div className="relative flex flex-col items-center justify-center my-auto z-10">
          {/* SVG Progress Circle */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                className="stroke-emerald-950 fill-none"
                strokeWidth="12"
              />
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                className="stroke-amber-400 fill-none transition-all duration-300 ease-out"
                strokeWidth="12"
                strokeDasharray="264%"
                strokeDashoffset={`${264 - (264 * progressPercent) / 100}%`}
                strokeLinecap="round"
              />
            </svg>

            {/* Counter Text inside Circle */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs font-cinzel uppercase tracking-widest text-amber-300/80 mb-1">
                TAP ANYWHERE
              </span>

              <span
                className={`font-cinzel font-black text-6xl sm:text-7xl tracking-tighter transition-transform duration-150 ${
                  isCompleted ? 'gold-text-gradient' : 'text-amber-100'
                } ${isAnimate ? 'scale-125' : 'scale-100'}`}
              >
                {count}
              </span>

              <span className="text-lg sm:text-xl font-bold text-amber-400/80 mt-1">
                / {item.targetCount}
              </span>

              {isCompleted ? (
                <div className="mt-2 flex items-center gap-1 bg-amber-400 text-emerald-950 px-3 py-1 rounded-full text-xs font-bold animate-bounce shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>COMPLETED</span>
                </div>
              ) : (
                <span className="text-[11px] text-emerald-300/70 mt-1">
                  {item.targetCount - count} remaining
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Prev / Reset / Next */}
        <div className="w-full max-w-lg flex items-center justify-between gap-3 z-10 pt-2 border-t border-amber-500/20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (currentIndex > 0) onSelectPrevItem(allItems[currentIndex - 1]);
            }}
            disabled={currentIndex === 0}
            className="p-3 rounded-2xl bg-emerald-950 border border-amber-500/20 text-amber-200 disabled:opacity-30 disabled:pointer-events-none hover:bg-emerald-900 transition-all flex items-center gap-1 text-xs font-semibold"
          >
            <ChevronLeft className="w-5 h-5 text-amber-300" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={handleReset}
            disabled={count === 0}
            className="px-4 py-2.5 rounded-2xl bg-emerald-950 border border-amber-500/30 text-amber-300/80 hover:text-amber-300 disabled:opacity-20 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Counter</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (currentIndex < allItems.length - 1) onSelectNextItem(allItems[currentIndex + 1]);
            }}
            disabled={currentIndex === allItems.length - 1}
            className="p-3 rounded-2xl bg-emerald-950 border border-amber-500/20 text-amber-200 disabled:opacity-30 disabled:pointer-events-none hover:bg-emerald-900 transition-all flex items-center gap-1 text-xs font-semibold"
          >
            <span className="hidden sm:inline">Next Wazaif</span>
            <ChevronRight className="w-5 h-5 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
