export type TimeOfDay = 'subah' | 'dopaher' | 'shaam';

export interface AmalItem {
  id: string;
  number: string;
  title: string;
  arabicTitle: string;
  category: 'core' | 'special_tawbah' | 'special_113';
  targetCount: number;
  quranRef?: string;
  arabicText: string;
  transliteration: string;
  meaningUrduRoman: string;
  meaningEnglish: string;
  notes?: string;
}

export interface DayProgress {
  date: string; // YYYY-MM-DD
  activeSession: TimeOfDay;
  subahCompleted: boolean;
  dopaherCompleted: boolean;
  shaamCompleted: boolean;
  counts: Record<string, number>; // itemId -> count
  tawbahCounts: number; // 0 to 21
  quraishCounts: number; // 0 to 113
  notes?: string;
}

export interface HistoryRecord {
  date: string;
  percentage: number;
  completedItemsCount: number;
  totalItemsCount: number;
}

export interface UserSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  arabicFontSize: 'medium' | 'large' | 'huge';
  showTranslation: boolean;
  showTransliteration: boolean;
  autoAdvanceOnComplete: boolean;
}
