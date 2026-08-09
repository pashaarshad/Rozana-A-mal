import React from 'react';
import { X, History, Flame, Calendar, Award } from 'lucide-react';
import { HistoryRecord } from '../types';

interface HistoryModalProps {
  history: HistoryRecord[];
  streak: number;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ history, streak, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-cinzel gold-text-gradient">
                Recitation History & Streak
              </h2>
              <p className="text-xs text-emerald-300/80">
                Tracking your daily wazaif consistency
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

        {/* Streak Stats Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#0a271f] to-emerald-950 border border-amber-500/30 flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Flame className="w-8 h-8 fill-amber-400 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-cinzel text-amber-300/80 tracking-widest uppercase">
                Current Streak
              </span>
              <h3 className="text-2xl font-black font-cinzel text-amber-100">
                {streak} Days Active
              </h3>
            </div>
          </div>

          <div className="text-right">
            <Award className="w-6 h-6 text-amber-400 ml-auto mb-1" />
            <span className="text-[11px] text-emerald-300">Keep going!</span>
          </div>
        </div>

        {/* Recent History Log List */}
        <div className="space-y-3">
          <h3 className="text-xs font-cinzel uppercase tracking-widest text-amber-300 font-bold">
            Past 30 Days Activity Log
          </h3>

          {history.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-emerald-950/40 border border-amber-500/10 text-emerald-300/70 text-xs">
              <Calendar className="w-8 h-8 text-amber-400/40 mx-auto mb-2" />
              No previous day records saved yet. Complete today's wazaif to start your history!
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/80 border border-amber-500/20 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-amber-100">{record.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-emerald-300">
                      {record.completedItemsCount} / {record.totalItemsCount} Done
                    </span>
                    <span className="font-bold text-amber-300 font-cinzel px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30">
                      {record.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-emerald-950 border border-amber-500/30 text-amber-200 font-semibold text-sm hover:bg-emerald-900 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
