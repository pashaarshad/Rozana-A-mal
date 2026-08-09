import React, { useState } from 'react';
import {
  X,
  Settings as SettingsIcon,
  Volume2,
  Vibrate,
  Type,
  Languages,
  RotateCcw,
  Trash2,
  Check,
} from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  onResetToday: () => void;
  onResetAll: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetToday,
  onResetAll,
  onClose,
}) => {
  const [confirmResetToday, setConfirmResetToday] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);

  const fontSizes: { id: 'medium' | 'large' | 'huge'; label: string }[] = [
    { id: 'medium', label: 'Medium' },
    { id: 'large', label: 'Large' },
    { id: 'huge', label: 'Extra Large' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-cinzel gold-text-gradient">
                Preferences & Settings
              </h2>
              <p className="text-xs text-emerald-300/80">
                Customize audio, typography & local storage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-emerald-950 border border-amber-500/30 text-amber-200 hover:bg-emerald-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Group 1: Sound & Vibration */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xs font-cinzel uppercase tracking-widest text-amber-300 font-bold">
            Audio & Feedback
          </h3>

          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-sm text-amber-100 font-semibold">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Counter Audio Click</span>
              </div>
              <button
                onClick={() =>
                  onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  settings.soundEnabled ? 'bg-amber-500' : 'bg-emerald-900'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-emerald-950 transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-amber-500/10">
              <div className="flex items-center gap-2.5 text-sm text-amber-100 font-semibold">
                <Vibrate className="w-4 h-4 text-amber-400" />
                <span>Haptic Vibration Feedback</span>
              </div>
              <button
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    vibrationEnabled: !settings.vibrationEnabled,
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  settings.vibrationEnabled ? 'bg-amber-500' : 'bg-emerald-900'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-emerald-950 transition-transform ${
                    settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Group 2: Typography & Display */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xs font-cinzel uppercase tracking-widest text-amber-300 font-bold">
            Typography & Language Display
          </h3>

          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-amber-500/20 space-y-4">
            {/* Font Size Selector */}
            <div>
              <div className="flex items-center gap-2 text-sm text-amber-100 font-semibold mb-2">
                <Type className="w-4 h-4 text-amber-400" />
                <span>Arabic Text Size</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {fontSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => onUpdateSettings({ ...settings, arabicFontSize: size.id })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      settings.arabicFontSize === size.id
                        ? 'bg-amber-500 text-emerald-950 border-amber-400'
                        : 'bg-emerald-900/40 text-emerald-200 border-amber-500/10 hover:bg-emerald-800/40'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Toggles */}
            <div className="pt-3 border-t border-amber-500/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-200">Show English Translation</span>
                <button
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      showTranslation: !settings.showTranslation,
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                    settings.showTranslation ? 'bg-amber-500' : 'bg-emerald-900'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-emerald-950 transition-transform ${
                      settings.showTranslation ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-200">Show Transliteration</span>
                <button
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      showTransliteration: !settings.showTransliteration,
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                    settings.showTransliteration ? 'bg-amber-500' : 'bg-emerald-900'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-emerald-950 transition-transform ${
                      settings.showTransliteration ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Group 3: Local Storage Reset Options */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xs font-cinzel uppercase tracking-widest text-amber-300 font-bold">
            Local Data & Storage
          </h3>

          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-amber-500/20 space-y-3">
            {/* Reset Today */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-amber-100">Reset Today's Progress</h4>
                <p className="text-[11px] text-emerald-300/70">Clear all counter numbers back to 0</p>
              </div>

              {confirmResetToday ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onResetToday();
                      setConfirmResetToday(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-emerald-950 font-bold text-xs"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmResetToday(false)}
                    className="px-2 py-1.5 rounded-xl bg-emerald-900 text-gray-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmResetToday(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Today</span>
                </button>
              )}
            </div>

            {/* Clear All Data */}
            <div className="flex items-center justify-between pt-3 border-t border-amber-500/10">
              <div>
                <h4 className="text-sm font-semibold text-rose-300">Clear All Local Data</h4>
                <p className="text-[11px] text-rose-200/60">Delete history, streak logs & reset settings</p>
              </div>

              {confirmResetAll ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onResetAll();
                      setConfirmResetAll(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
                  >
                    Delete All
                  </button>
                  <button
                    onClick={() => setConfirmResetAll(false)}
                    className="px-2 py-1.5 rounded-xl bg-emerald-900 text-gray-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmResetAll(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-cinzel font-bold text-sm shadow-lg shadow-amber-500/20"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
