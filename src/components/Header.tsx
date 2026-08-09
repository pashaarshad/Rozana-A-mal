import React from 'react';
import { Volume2, VolumeX, Flame, Settings, HelpCircle, History, Sparkles, Headphones } from 'lucide-react';
import { UserSettings } from '../types';
import { BISMILLAH_ARABIC, BISMILLAH_TRANSLITERATION } from '../data/amalData';

interface HeaderProps {
  streak: number;
  settings: UserSettings;
  listenModeActive: boolean;
  onToggleListenMode: () => void;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onOpenInstructions: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streak,
  settings,
  listenModeActive,
  onToggleListenMode,
  onUpdateSettings,
  onOpenInstructions,
  onOpenHistory,
  onOpenSettings,
}) => {
  const toggleSound = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="relative w-full text-center pt-6 pb-8 px-4 border-b border-amber-500/20 bg-gradient-to-b from-[#03130e] via-[#051a14] to-transparent">
      {/* Top Action Bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 mb-6">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{streak} Day Streak</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Listen Mode Toggle Button */}
          <button
            onClick={onToggleListenMode}
            className={`p-2 rounded-full border transition-all flex items-center gap-1.5 text-xs font-semibold px-3 ${
              listenModeActive
                ? 'bg-amber-500 text-emerald-950 border-amber-300 shadow-[0_0_12px_rgba(212,175,55,0.4)] animate-pulse'
                : 'bg-emerald-900/60 hover:bg-emerald-800/80 border-amber-500/30 text-amber-300'
            }`}
            title="Toggle Hands-Free Continuous Listen Mode"
          >
            <Headphones className="w-4 h-4 text-amber-300 fill-current" />
            <span className="hidden sm:inline">Listen Mode</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-full bg-emerald-900/40 hover:bg-emerald-800/60 border border-amber-500/20 text-amber-200 transition-all"
            title={settings.soundEnabled ? 'Mute Counter Sound' : 'Enable Counter Sound'}
            aria-label="Toggle Sound"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>

          <button
            onClick={onOpenHistory}
            className="p-2 rounded-full bg-emerald-900/40 hover:bg-emerald-800/60 border border-amber-500/20 text-amber-200 transition-all flex items-center gap-1 text-xs font-medium px-3"
            title="View History & Streaks"
          >
            <History className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">History</span>
          </button>

          <button
            onClick={onOpenInstructions}
            className="p-2 rounded-full bg-emerald-900/40 hover:bg-emerald-800/60 border border-amber-500/20 text-amber-200 transition-all flex items-center gap-1 text-xs font-medium px-3"
            title="Read Ammi's Instructions"
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Instructions</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full bg-emerald-900/40 hover:bg-emerald-800/60 border border-amber-500/20 text-amber-200 transition-all"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Bismillah Header */}
      <div className="max-w-2xl mx-auto space-y-2">
        <div className="font-arabic text-3xl sm:text-4xl text-amber-200 drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)] tracking-wide">
          {BISMILLAH_ARABIC}
        </div>
        <p className="text-xs sm:text-sm text-amber-300/80 italic font-light tracking-wide">
          {BISMILLAH_TRANSLITERATION}
        </p>

        {/* Main Title */}
        <div className="pt-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-cinzel tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            DAILY WAZAIF & REMEMBRANCE
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-cinzel gold-text-gradient tracking-wider uppercase">
            Rozana A'mal
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-md mx-auto">
            {todayFormatted} • Structured daily wazaif counter with automatic offline storage
          </p>
        </div>
      </div>
    </header>
  );
};
