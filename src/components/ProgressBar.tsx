import React from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

interface ProgressBarProps {
  completedCount: number;
  totalCount: number;
  percentage: number;
  onResetToday: () => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  completedCount,
  totalCount,
  percentage,
  onResetToday,
}) => {
  const isFullyComplete = percentage === 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      <div className="glass-card p-4 sm:p-5 rounded-2xl relative overflow-hidden">
        {/* Glow effect on completion */}
        {isFullyComplete && (
          <div className="absolute inset-0 bg-amber-500/10 pointer-events-none animate-pulse" />
        )}

        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${isFullyComplete ? 'bg-amber-400 text-emerald-950' : 'bg-amber-500/20 text-amber-300'}`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-amber-100 font-cinzel">
                Today's Progress
              </h2>
              <p className="text-xs text-emerald-300/80">
                {completedCount} of {totalCount} practices completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold font-cinzel gold-text-gradient">
              {percentage}%
            </span>

            <button
              onClick={onResetToday}
              className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-amber-500/20 text-amber-300/80 hover:text-amber-300 transition-all text-xs flex items-center gap-1.5"
              title="Reset today's counter to 0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Today</span>
            </button>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full h-3 bg-emerald-950/90 rounded-full p-0.5 border border-amber-500/20 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(212,175,55,0.6)]"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {isFullyComplete && (
          <div className="mt-3 text-center text-xs font-semibold text-amber-300 bg-amber-500/10 py-1.5 px-3 rounded-lg border border-amber-500/30">
            🎉 Mashallah! You have completed all wazaif for today. May Allah accept your efforts!
          </div>
        )}
      </div>
    </div>
  );
};
