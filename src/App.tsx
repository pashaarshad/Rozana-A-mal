import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  loadProgress,
  saveProgress,
  loadSettings,
  saveSettings,
  loadHistory,
  loadStreak,
  resetTodayProgress,
  resetAllData,
  getTodayDateString,
} from './utils/storage';
import { soundService } from './utils/sound';
import { AMAL_ITEMS } from './data/amalData';
import { AmalItem, TimeOfDay, UserSettings } from './types';

import { Header } from './components/Header';
import { SessionSelector } from './components/SessionSelector';
import { ProgressBar } from './components/ProgressBar';
import { AmalCard } from './components/AmalCard';
import { FullCounterModal } from './components/FullCounterModal';
import { InstructionsModal } from './components/InstructionsModal';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { ListenModeBar } from './components/ListenModeBar';

import { Sparkles, Heart, ShieldCheck, HelpCircle } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [history, setHistory] = useState(loadHistory);
  const [streak, setStreak] = useState(loadStreak);

  // Modals & Mode
  const [activeFullCounterItem, setActiveFullCounterItem] = useState<AmalItem | null>(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showListenMode, setShowListenMode] = useState(false);

  // Save progress whenever progress changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Save settings whenever settings change
  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Check overall completion percentage
  const totalItems = AMAL_ITEMS.length;
  let completedItems = 0;
  AMAL_ITEMS.forEach((item) => {
    if ((progress.counts[item.id] || 0) >= item.targetCount) {
      completedItems++;
    }
  });
  const overallPercentage = Math.round((completedItems / totalItems) * 100);

  // Trigger celebration on 100%
  useEffect(() => {
    if (overallPercentage === 100) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#10b981', '#fef08a', '#059669'],
        });
        if (settings.soundEnabled) soundService.playFullCompletion();
      } catch {
        // Ignore
      }
    }
  }, [overallPercentage]);

  // Handler: Select Session (Subah, Dopaher, Shaam)
  const handleSelectSession = (session: TimeOfDay) => {
    const updated = { ...progress, activeSession: session };
    setProgress(updated);
  };

  // Handler: Increment counter
  const handleIncrement = (id: string) => {
    const targetItem = AMAL_ITEMS.find((i) => i.id === id);
    if (!targetItem) return;

    const current = progress.counts[id] || 0;
    const nextCount = current + 1;

    // Check if hitting target right now
    if (nextCount === targetItem.targetCount) {
      if (settings.soundEnabled) soundService.playCompletion();
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#d4af37', '#34d399', '#fef08a'],
        });
      } catch {
        // Ignore
      }
    }

    const newCounts = { ...progress.counts, [id]: nextCount };
    setProgress({ ...progress, counts: newCounts });
  };

  // Handler: Decrement counter
  const handleDecrement = (id: string) => {
    const current = progress.counts[id] || 0;
    if (current <= 0) return;
    const newCounts = { ...progress.counts, [id]: current - 1 };
    setProgress({ ...progress, counts: newCounts });
  };

  // Handler: Reset count for single wazaif
  const handleResetCount = (id: string) => {
    const newCounts = { ...progress.counts, [id]: 0 };
    setProgress({ ...progress, counts: newCounts });
  };

  // Handler: Reset Today
  const handleResetToday = () => {
    const resetData = resetTodayProgress(progress);
    setProgress(resetData);
  };

  // Handler: Reset All Data
  const handleResetAll = () => {
    const fresh = resetAllData();
    setProgress(fresh);
    setHistory([]);
    setStreak(0);
  };

  // Separate Items into Categories
  const coreItems = AMAL_ITEMS.filter((i) => i.category === 'core');
  const tawbahItem = AMAL_ITEMS.find((i) => i.category === 'special_tawbah');
  const quraishItem = AMAL_ITEMS.find((i) => i.category === 'special_113');

  return (
    <div className="min-h-screen bg-[#051a14] text-slate-100 islamic-bg-pattern pb-16 selection:bg-amber-500/30">
      {/* Header */}
      <Header
        streak={streak}
        settings={settings}
        listenModeActive={showListenMode}
        onToggleListenMode={() => setShowListenMode((prev) => !prev)}
        onUpdateSettings={handleUpdateSettings}
        onOpenInstructions={() => setShowInstructionsModal(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Session Selector (Subah, Dopaher, Shaam) */}
        <SessionSelector
          activeSession={progress.activeSession}
          subahCompleted={progress.subahCompleted}
          dopaherCompleted={progress.dopaherCompleted}
          shaamCompleted={progress.shaamCompleted}
          onSelectSession={handleSelectSession}
        />

        {/* Overall Progress Bar */}
        <ProgressBar
          completedCount={completedItems}
          totalCount={totalItems}
          percentage={overallPercentage}
          onResetToday={handleResetToday}
        />

        {/* SECTION 1: Core 7x Routine */}
        <section className="mb-12 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-amber-500/20">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-cinzel tracking-widest text-amber-300/80 uppercase">
                Section 01 • Daily Core Amal (7× Series)
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-100">
                Awwal Durood, 7× Surahs & Aakhir Durood
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            {coreItems.map((item) => (
              <AmalCard
                key={item.id}
                item={item}
                count={progress.counts[item.id] || 0}
                settings={settings}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onResetCount={handleResetCount}
                onOpenFullCounter={(i) => setActiveFullCounterItem(i)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 2: Surah At-Tawbah (21x) */}
        {tawbahItem && (
          <section className="mb-12 space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-amber-500/20">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-cinzel tracking-widest text-amber-300/80 uppercase">
                  Section 02 • Special Daily Wazaif
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-100">
                  Surah At-Tawbah (Last 2 Ayahs) — 21 Times
                </h2>
              </div>
            </div>

            <AmalCard
              item={tawbahItem}
              count={progress.counts[tawbahItem.id] || 0}
              settings={settings}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onResetCount={handleResetCount}
              onOpenFullCounter={(i) => setActiveFullCounterItem(i)}
            />
          </section>
        )}

        {/* SECTION 3: Surah Quraish 113x */}
        {quraishItem && (
          <section className="mb-12 space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-amber-500/20">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Heart className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              </div>
              <div>
                <span className="text-xs font-cinzel tracking-widest text-amber-300/80 uppercase">
                  Section 03 • Grand Protection & Relief
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-100">
                  Surah Quraish (Khuresh) — 113 Times
                </h2>
              </div>
            </div>

            <AmalCard
              item={quraishItem}
              count={progress.counts[quraishItem.id] || 0}
              settings={settings}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onResetCount={handleResetCount}
              onOpenFullCounter={(i) => setActiveFullCounterItem(i)}
            />
          </section>
        )}

        {/* Quick Instructions CTA Box */}
        <div className="glass-card rounded-3xl p-6 text-center space-y-3 border border-amber-500/30">
          <h3 className="font-cinzel text-lg font-bold gold-text-gradient">
            Need Guidance on Voice Volume or Routine?
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xl mx-auto">
            Recite aloud with a gentle voice ("Thodi aawaz se padna"). You can read the original instructions anytime.
          </p>
          <button
            onClick={() => setShowInstructionsModal(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold font-cinzel transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Read Original Instructions</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-emerald-300/60 space-y-2 border-t border-amber-500/10 pt-8 max-w-2xl mx-auto px-4">
        <p className="font-arabic text-amber-300/80 text-lg">
          رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ
        </p>
        <p className="italic">
          "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing."
        </p>
        <p className="text-[11px] text-amber-500/50 font-cinzel pt-2">
          ROZANA A'MAL • PREMIUM ISLAMIC DIGITAL TASBEEH & COUNTER
        </p>
      </footer>

      {/* Fullscreen Digital Tasbeeh Counter Modal */}
      {activeFullCounterItem && (
        <FullCounterModal
          item={activeFullCounterItem}
          count={progress.counts[activeFullCounterItem.id] || 0}
          allItems={AMAL_ITEMS}
          allCounts={progress.counts}
          settings={settings}
          onIncrement={handleIncrement}
          onResetCount={handleResetCount}
          onSelectNextItem={(item) => setActiveFullCounterItem(item)}
          onSelectPrevItem={(item) => setActiveFullCounterItem(item)}
          onClose={() => setActiveFullCounterItem(null)}
        />
      )}

      {/* Instructions Modal */}
      {showInstructionsModal && (
        <InstructionsModal onClose={() => setShowInstructionsModal(false)} />
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <HistoryModal
          history={history}
          streak={streak}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetToday={handleResetToday}
          onResetAll={handleResetAll}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Floating Listen Mode Audio Bar */}
      {showListenMode && (
        <ListenModeBar
          onClose={() => setShowListenMode(false)}
        />
      )}
    </div>
  );
}
