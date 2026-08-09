import React from 'react';
import { Sun, Sunset, Moon, CheckCircle2 } from 'lucide-react';
import { TimeOfDay } from '../types';

interface SessionSelectorProps {
  activeSession: TimeOfDay;
  subahCompleted: boolean;
  dopaherCompleted: boolean;
  shaamCompleted: boolean;
  onSelectSession: (session: TimeOfDay) => void;
}

export const SessionSelector: React.FC<SessionSelectorProps> = ({
  activeSession,
  subahCompleted,
  dopaherCompleted,
  shaamCompleted,
  onSelectSession,
}) => {
  const sessions: { id: TimeOfDay; label: string; urduLabel: string; icon: React.ReactNode; isCompleted: boolean }[] = [
    {
      id: 'subah',
      label: 'Subah',
      urduLabel: 'صبح',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      isCompleted: subahCompleted,
    },
    {
      id: 'dopaher',
      label: 'Dopaher',
      urduLabel: 'دوپہر',
      icon: <Sunset className="w-4 h-4 text-orange-400" />,
      isCompleted: dopaherCompleted,
    },
    {
      id: 'shaam',
      label: 'Shaam',
      urduLabel: 'شام',
      icon: <Moon className="w-4 h-4 text-indigo-300" />,
      isCompleted: shaamCompleted,
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-4">
      <div className="text-center mb-2">
        <span className="text-xs uppercase font-cinzel text-amber-300/80 tracking-widest">
          Select Daily Session Routine
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 rounded-2xl bg-emerald-950/80 border border-amber-500/20 shadow-xl">
        {sessions.map((session) => {
          const isActive = activeSession === session.id;
          return (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-b from-amber-500/20 to-emerald-900/90 border border-amber-400/60 text-amber-200 shadow-lg shadow-amber-500/10'
                  : 'bg-emerald-900/20 hover:bg-emerald-900/40 text-gray-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {session.icon}
                <span className="font-bold text-sm sm:text-base tracking-wide">{session.label}</span>
                {session.isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                )}
              </div>
              <span className="font-arabic-title text-xs text-amber-300/70">{session.urduLabel}</span>

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute -bottom-1 w-8 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
