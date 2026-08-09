import React from 'react';
import { X, BookOpen, Clock, Heart, Sparkles, Volume2 } from 'lucide-react';
import { INSTRUCTIONS_SUMMARY } from '../data/amalData';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  const originalMessage = [
    "SUBO AIK BAR A AMAL DOPAHER ME AIK BAR AUR SHAAM ME AIK BAR",
    "Awwal 3 darood padko, 7 BAR SURATH FATIHA, 7 BAR AAYATHUL KURSI, 7 BAR SUREH KAFIROON, 7 BAR SURAH IQLAS, 7 BAR FALAQ, 7 BAR NAAS, THODI AAWAZ SE PADNA",
    "Din Aik bar ya 2 bar ya hosake to 3 bar 21 martaba sureh Touba k last k 2 aayath zaroor padna",
    "Aur Din me bar ya 2 bar khuresh 113 martaba pehle b bolko the na a amal zaroor karna zia"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-cinzel gold-text-gradient">
                Amal Instructions & Guidelines
              </h2>
              <p className="text-xs text-emerald-300/80">
                Daily routine guidelines & original instructions
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

        {/* Structured Summary Cards */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xs font-cinzel uppercase tracking-widest text-amber-300 font-bold">
            Structured Routine Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INSTRUCTIONS_SUMMARY.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-emerald-950/80 border border-amber-500/20 space-y-1.5"
              >
                <div className="font-bold text-sm text-amber-200 font-cinzel">
                  {rule.title}
                </div>
                <p className="text-xs text-amber-300/90 font-medium">
                  "{rule.urduText}"
                </p>
                <p className="text-[11px] text-emerald-200/80">
                  {rule.englishText}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Original WhatsApp Wording Reference */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#031d16] to-[#0a271f] border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-cinzel font-bold">
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>ORIGINAL INSTRUCTION MESSAGE</span>
          </div>

          <div className="space-y-2 text-xs text-emerald-100 font-sans leading-relaxed italic bg-emerald-950/60 p-4 rounded-xl border border-amber-500/10">
            {originalMessage.map((msg, i) => (
              <p key={i} className="border-b border-amber-500/10 pb-2 last:border-b-0 last:pb-0">
                "{msg}"
              </p>
            ))}
          </div>
          <p className="text-[11px] text-amber-300/70 text-right">
            — Note: "Thodi aawaz se padna" (Recite aloud gently)
          </p>
        </div>

        {/* Footer Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-cinzel font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
          >
            Start Today's Recitation
          </button>
        </div>
      </div>
    </div>
  );
};
