import { DayProgress, HistoryRecord, TimeOfDay, UserSettings } from '../types';
import { AMAL_ITEMS } from '../data/amalData';

const STORAGE_KEY_PROGRESS = 'daily_amal_progress_v1';
const STORAGE_KEY_SETTINGS = 'daily_amal_settings_v1';
const STORAGE_KEY_HISTORY = 'daily_amal_history_v1';
const STORAGE_KEY_STREAK = 'daily_amal_streak_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  arabicFontSize: 'large',
  showTranslation: true,
  showTransliteration: true,
  autoAdvanceOnComplete: false,
};

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createInitialProgress(dateStr: string, session: TimeOfDay = 'subah'): DayProgress {
  const initialCounts: Record<string, number> = {};
  AMAL_ITEMS.forEach((item) => {
    initialCounts[item.id] = 0;
  });

  return {
    date: dateStr,
    activeSession: session,
    subahCompleted: false,
    dopaherCompleted: false,
    shaamCompleted: false,
    counts: initialCounts,
    tawbahCounts: 0,
    quraishCounts: 0,
  };
}

export function loadProgress(): DayProgress {
  const today = getTodayDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) {
      const fresh = createInitialProgress(today);
      saveProgress(fresh);
      return fresh;
    }

    const parsed: DayProgress = JSON.parse(raw);

    // Automatic New-Day Reset
    if (parsed.date !== today) {
      // Archive previous day history before reset
      archiveDayHistory(parsed);
      updateStreakOnNewDay(parsed);

      const freshNewDay = createInitialProgress(today, parsed.activeSession || 'subah');
      saveProgress(freshNewDay);
      return freshNewDay;
    }

    // Ensure all items exist in counts object
    AMAL_ITEMS.forEach((item) => {
      if (typeof parsed.counts[item.id] !== 'number') {
        parsed.counts[item.id] = 0;
      }
    });

    return parsed;
  } catch (err) {
    console.error('Error loading progress from localStorage:', err);
    const fresh = createInitialProgress(today);
    saveProgress(fresh);
    return fresh;
  }
}

export function saveProgress(progress: DayProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving progress to localStorage:', err);
  }
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

export function loadHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function archiveDayHistory(progress: DayProgress): void {
  if (!progress.date) return;
  const history = loadHistory();

  let completed = 0;
  let total = AMAL_ITEMS.length;

  AMAL_ITEMS.forEach((item) => {
    if ((progress.counts[item.id] || 0) >= item.targetCount) {
      completed++;
    }
  });

  const percentage = Math.round((completed / total) * 100);

  // Filter out duplicate date if exists
  const updated = history.filter((h) => h.date !== progress.date);
  updated.unshift({
    date: progress.date,
    percentage,
    completedItemsCount: completed,
    totalItemsCount: total,
  });

  // Keep last 30 days
  const trimmed = updated.slice(0, 30);
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Error saving history:', e);
  }
}

export function loadStreak(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STREAK);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function updateStreakOnNewDay(prevDayProgress: DayProgress): void {
  const currentStreak = loadStreak();
  // Check if prev day had at least 50% completion
  let completed = 0;
  AMAL_ITEMS.forEach((item) => {
    if ((prevDayProgress.counts[item.id] || 0) >= item.targetCount) {
      completed++;
    }
  });

  if (completed >= 4) {
    const newStreak = currentStreak + 1;
    localStorage.setItem(STORAGE_KEY_STREAK, newStreak.toString());
  } else {
    // Reset streak if missed
    localStorage.setItem(STORAGE_KEY_STREAK, '0');
  }
}

export function resetTodayProgress(progress: DayProgress): DayProgress {
  const today = getTodayDateString();
  const resetData = createInitialProgress(today, progress.activeSession);
  saveProgress(resetData);
  return resetData;
}

export function resetAllData(): DayProgress {
  const today = getTodayDateString();
  localStorage.removeItem(STORAGE_KEY_PROGRESS);
  localStorage.removeItem(STORAGE_KEY_HISTORY);
  localStorage.removeItem(STORAGE_KEY_STREAK);
  const fresh = createInitialProgress(today, 'subah');
  saveProgress(fresh);
  return fresh;
}
