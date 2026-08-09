import React, { useState, useEffect } from 'react';
import {
  Plus,
  Minus,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Volume2,
  BookOpen,
  Play,
  Pause,
  Loader2,
} from 'lucide-react';
import { AmalItem, UserSettings } from '../types';
import { soundService, triggerVibration } from '../utils/sound';
import { recitationPlayer } from '../utils/audioPlayer';

interface AmalCardProps {
  item: AmalItem;
  count: number;
  settings: UserSettings;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onResetCount: (id: string) => void;
  onOpenFullCounter: (item: AmalItem) => void;
}

export const AmalCard: React.FC<AmalCardProps> = ({
  item,
  count,
  settings,
  onIncrement,
  onDecrement,
  onResetCount,
  onOpenFullCounter,
}) => {
  const [showArabic, setShowArabic] = useState<boolean>(true);
  const [isAnimate, setIsAnimate] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = recitationPlayer.subscribe((playingItemId, loading) => {
      if (playingItemId === item.id) {
        setIsLoadingAudio(loading);
        setIsPlaying(!loading);
      } else {
        setIsPlaying(false);
        setIsLoadingAudio(false);
      }
    });

    return () => unsubscribe();
  }, [item.id]);

  const handleAudioToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    recitationPlayer.playRecitation(item.id, item.audioUrl, item.arabicText);
  };

  const isCompleted = count >= item.targetCount;

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (settings.soundEnabled) soundService.playTap(600 + (count % 7) * 40);
    if (settings.vibrationEnabled) triggerVibration(20);

    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 200);

    onIncrement(item.id);
  };

  const handleCardTap = () => {
    if (settings.soundEnabled) soundService.playTap(600 + (count % 7) * 40);
    if (settings.vibrationEnabled) triggerVibration(20);

    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 200);

    onIncrement(item.id);
  };

  const handleMinusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (settings.soundEnabled) soundService.playTap(400);
    if (settings.vibrationEnabled) triggerVibration(15);
    onDecrement(item.id);
  };

  const handleResetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResetCount(item.id);
  };

  const getFontSizeClass = () => {
    switch (settings.arabicFontSize) {
      case 'medium':
        return 'text-2xl sm:text-3xl';
      case 'huge':
        return 'text-4xl sm:text-5xl';
      case 'large':
      default:
        return 'text-3xl sm:text-4xl';
    }
  };

  return (
    <div
      className={`relative glass-card rounded-3xl p-5 sm:p-6 transition-all duration-300 border ${
        isCompleted
          ? 'bg-gradient-to-b from-emerald-950/90 to-emerald-900/40 border-amber-400/80 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
          : 'border-amber-500/20 hover:border-amber-500/40'
      }`}
    >
      {/* Category Badge & Actions */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            {item.number}
          </span>
          {item.quranRef && (
            <span className="text-xs text-emerald-300/80 font-medium flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              {item.quranRef}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio Recitation Play Button */}
          <button
            onClick={handleAudioToggle}
            className={`p-1.5 rounded-xl border transition-all flex items-center gap-1 text-xs px-2.5 font-medium ${
              isPlaying
                ? 'bg-amber-500 text-emerald-950 border-amber-400 font-bold shadow-[0_0_10px_rgba(212,175,55,0.4)] animate-pulse'
                : isLoadingAudio
                ? 'bg-emerald-900/80 text-amber-300 border-amber-500/30'
                : 'bg-emerald-900/60 hover:bg-emerald-800 text-amber-300 border-amber-500/30'
            }`}
            title={isPlaying ? 'Pause Audio Recitation' : 'Play Audio Recitation'}
          >
            {isLoadingAudio ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
            ) : isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span className="hidden sm:inline font-medium">
              {isLoadingAudio ? 'Loading...' : isPlaying ? 'Playing' : 'Listen'}
            </span>
          </button>

          {/* Open Tasbeeh Mode */}
          <button
            onClick={() => onOpenFullCounter(item)}
            className="p-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1 text-xs px-2.5"
            title="Open Fullscreen Digital Tasbeeh Counter"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">Fullscreen</span>
          </button>

          {/* Toggle Arabic view */}
          <button
            onClick={() => setShowArabic(!showArabic)}
            className="p-1.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 transition-all"
            title={showArabic ? 'Hide Arabic Text' : 'Show Arabic Text'}
          >
            {showArabic ? <ChevronUp className="w-4 h-4 text-amber-300" /> : <ChevronDown className="w-4 h-4 text-amber-300" />}
          </button>
        </div>
      </div>

      {/* Title Header */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-100 tracking-wide">
            {item.title}
          </h3>
          <span className="font-arabic-title text-2xl sm:text-3xl text-amber-300/90 font-bold">
            {item.arabicTitle}
          </span>
        </div>

        {item.notes && (
          <p className="text-xs text-amber-200/90 italic mt-1 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 inline-block">
            📌 {item.notes}
          </p>
        )}
      </div>

      {/* Quranic Arabic Text */}
      {showArabic && (
        <div className="my-4 p-4 rounded-2xl bg-emerald-950/70 border border-amber-500/20 text-center space-y-3">
          <div className={`font-arabic text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${getFontSizeClass()}`}>
            {item.arabicText}
          </div>

          {settings.showTransliteration && item.transliteration && (
            <p className="text-xs sm:text-sm text-emerald-200/90 italic font-light pt-2 border-t border-amber-500/10">
              "{item.transliteration}"
            </p>
          )}

          {settings.showTranslation && (
            <div className="text-xs text-amber-100/80 pt-1 space-y-1 text-left sm:text-center">
              {item.meaningUrduRoman && (
                <p className="font-medium text-amber-300/90">
                  <span className="text-amber-400 font-bold">Urdu/Roman:</span> {item.meaningUrduRoman}
                </p>
              )}
              {item.meaningEnglish && (
                <p className="text-emerald-200/80">
                  <span className="text-emerald-300 font-bold">English:</span> {item.meaningEnglish}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* HUGE Animated Counter Display Section */}
      <div className="mt-5 pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Massive Digit Counter Display */}
        <div
          onClick={handleCardTap}
          className={`cursor-pointer w-full sm:w-auto flex-1 flex items-center justify-between sm:justify-start gap-4 p-3 sm:px-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#032018] to-emerald-950 border ${
            isCompleted
              ? 'border-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
              : 'border-amber-500/30 hover:border-amber-400/60'
          } select-none transition-all`}
        >
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-cinzel text-amber-300/80 tracking-widest">
              Tap to Count
            </span>
            <span className="text-xs font-semibold text-emerald-300">
              Target: {item.targetCount} Times
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`font-cinzel font-extrabold text-4xl sm:text-5xl tracking-tight transition-transform duration-150 ${
                isCompleted ? 'gold-text-gradient' : 'text-amber-200'
              } ${isAnimate ? 'scale-125' : 'scale-100'}`}
            >
              {String(count).padStart(2, '0')}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-amber-500/60">
              / {String(item.targetCount).padStart(2, '0')}
            </span>
          </div>

          {isCompleted && (
            <div className="flex items-center gap-1 text-emerald-300 bg-emerald-900/80 border border-amber-400/50 px-3 py-1 rounded-full text-xs font-bold animate-bounce">
              <Check className="w-4 h-4 text-amber-300" />
              <span>DONE</span>
            </div>
          )}
        </div>

        {/* Increment / Decrement / Reset Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleMinusClick}
            disabled={count <= 0}
            className="p-3 rounded-2xl bg-emerald-950 hover:bg-emerald-900 border border-amber-500/20 text-amber-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Decrement"
          >
            <Minus className="w-5 h-5" />
          </button>

          <button
            onClick={handlePlusClick}
            className={`p-3 sm:px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
              isCompleted
                ? 'bg-amber-500 hover:bg-amber-400 text-emerald-950 shadow-amber-500/30'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 shadow-amber-500/20'
            }`}
            title="Tap to Add 1"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
            <span className="font-cinzel text-lg font-black">+1</span>
          </button>

          <button
            onClick={handleResetClick}
            disabled={count === 0}
            className="p-3 rounded-2xl bg-emerald-950 hover:bg-emerald-900 border border-amber-500/20 text-amber-300/70 hover:text-amber-300 disabled:opacity-20 disabled:pointer-events-none transition-all"
            title="Reset counter for this wazaif"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
