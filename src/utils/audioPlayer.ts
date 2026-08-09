// Audio recitation player with HTML5 Audio and Web Speech Synthesis fallback

type PlayerListener = (playingItemId: string | null, isLoading: boolean) => void;

function getAbsoluteAudioUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return new URL(url, origin).href;
  } catch {
    return url;
  }
}

class RecitationPlayer {
  private activeAudio: HTMLAudioElement | null = null;
  private currentItemId: string | null = null;
  private isLoadingState: boolean = false;
  private listeners: Set<PlayerListener> = new Set();
  private currentSessionId: number = 0;
  private activeLoadTimeout: ReturnType<typeof setTimeout> | null = null;
  private ttsFallbackTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.getVoices();
      } catch {
        // ignore
      }
    }
  }

  public subscribe(listener: PlayerListener) {
    this.listeners.add(listener);
    // Send current state immediately
    listener(this.currentItemId, this.isLoadingState);

    return () => {
      this.listeners.delete(listener);
    };
  }

  // Pre-warms Web Speech Synthesis on touch/click gesture for mobile iOS/Android
  public unlockMobileAudio() {
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {
        console.warn('SpeechSynthesis unlock warning:', e);
      }
    }
  }

  public playRecitation(itemId: string, rawAudioUrl?: string, arabicText?: string, onEnded?: () => void) {
    // If already playing or loading this item, toggle pause
    if (this.currentItemId === itemId) {
      this.pause();
      return;
    }

    // Stop previous media and invalidate past session callbacks
    this.stopInternal();

    // Increment session ID to discard events from older play calls
    const sessionId = ++this.currentSessionId;

    const absoluteAudioUrl = rawAudioUrl ? getAbsoluteAudioUrl(rawAudioUrl) : '';

    if (absoluteAudioUrl && typeof window !== 'undefined') {
      this.currentItemId = itemId;
      this.isLoadingState = true;
      this.notifyListeners();

      let firedEnded = false;

      const cleanupAndTriggerEnd = () => {
        if (firedEnded) return;
        firedEnded = true;
        if (this.currentSessionId === sessionId) {
          this.currentItemId = null;
          this.isLoadingState = false;
          this.notifyListeners();
          if (onEnded) onEnded();
        }
      };

      // Create a fresh Audio element for every track to avoid browser media pipeline state corruption
      const audio = new Audio();
      this.activeAudio = audio;

      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      audio.preload = 'auto';

      if (absoluteAudioUrl.startsWith('http://') || absoluteAudioUrl.startsWith('https://')) {
        audio.crossOrigin = 'anonymous';
      }

      const clearHandlers = () => {
        audio.oncanplaythrough = null;
        audio.onplaying = null;
        audio.oncanplay = null;
        audio.onended = null;
        audio.onerror = null;
        audio.onpause = null;
        if (this.activeLoadTimeout) {
          clearTimeout(this.activeLoadTimeout);
          this.activeLoadTimeout = null;
        }
      };

      // 6-second timeout safeguard in case network hangs
      this.activeLoadTimeout = setTimeout(() => {
        if (this.currentSessionId === sessionId && this.isLoadingState) {
          console.warn('Audio URL load timed out, falling back to Web Speech API');
          clearHandlers();
          try {
            audio.pause();
          } catch {}
          this.playSpeechSynthesis(itemId, arabicText || '', sessionId, onEnded);
        }
      }, 6000);

      const markReadyAndPlaying = () => {
        if (this.currentSessionId === sessionId) {
          if (this.activeLoadTimeout) {
            clearTimeout(this.activeLoadTimeout);
            this.activeLoadTimeout = null;
          }
          if (this.isLoadingState) {
            this.isLoadingState = false;
            this.notifyListeners();
          }
        }
      };

      audio.oncanplaythrough = markReadyAndPlaying;
      audio.oncanplay = markReadyAndPlaying;
      audio.onplaying = markReadyAndPlaying;

      audio.onended = () => {
        if (this.currentSessionId === sessionId) {
          clearHandlers();
          cleanupAndTriggerEnd();
        }
      };

      audio.onerror = (e) => {
        if (this.currentSessionId === sessionId) {
          console.warn('Audio URL playback error, falling back to Web Speech API:', e);
          clearHandlers();
          this.playSpeechSynthesis(itemId, arabicText || '', sessionId, onEnded);
        }
      };

      try {
        audio.src = absoluteAudioUrl;
      } catch (err) {
        console.warn('Setting audio.src failed:', err);
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Ignore AbortError caused by user switching tracks or pausing
          if (err && err.name === 'AbortError') {
            return;
          }
          if (this.currentSessionId === sessionId) {
            console.warn('audio.play() rejected, falling back to Web Speech API:', err);
            clearHandlers();
            this.playSpeechSynthesis(itemId, arabicText || '', sessionId, onEnded);
          }
        });
      }
    } else if (arabicText) {
      this.playSpeechSynthesis(itemId, arabicText, sessionId, onEnded);
    }
  }

  private playSpeechSynthesis(itemId: string, text: string, sessionId: number, onEnded?: () => void) {
    if (this.currentSessionId !== sessionId) return;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (this.currentSessionId === sessionId) {
        this.currentItemId = null;
        this.isLoadingState = false;
        this.notifyListeners();
        if (onEnded) onEnded();
      }
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch (e) {
      console.warn('SpeechSynthesis reset warning:', e);
    }

    this.currentItemId = itemId;
    this.isLoadingState = false;
    this.notifyListeners();

    // Strip diacritics for clearer mobile Web Speech Synthesis
    const cleanText = text.replace(/[\u0610-\u061A\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText || text);

    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;

    // Pick best Arabic voice if available
    try {
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }
    } catch {
      // ignore
    }

    let fired = false;
    const finish = () => {
      if (fired) return;
      fired = true;
      if (this.ttsFallbackTimeout) {
        clearTimeout(this.ttsFallbackTimeout);
        this.ttsFallbackTimeout = null;
      }
      if (this.currentSessionId === sessionId) {
        this.currentItemId = null;
        this.isLoadingState = false;
        this.notifyListeners();
        if (onEnded) onEnded();
      }
    };

    utterance.onend = finish;
    utterance.onerror = finish;

    // Safety timeout for mobile Safari where utterance.onend sometimes drops
    const estimatedDurationMs = Math.max(5000, text.length * 160);
    this.ttsFallbackTimeout = setTimeout(() => {
      if (this.currentSessionId === sessionId) {
        console.warn('TTS safety duration reached, advancing item');
        finish();
      }
    }, estimatedDurationMs);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('SpeechSynthesis.speak failed:', e);
      finish();
    }
  }

  public pause() {
    this.stop();
  }

  public stop() {
    this.stopInternal();
    this.currentItemId = null;
    this.isLoadingState = false;
    this.notifyListeners();
  }

  private stopInternal() {
    // Invalidate session so pending async events/onend callbacks from previous audio do nothing
    this.currentSessionId++;

    if (this.activeLoadTimeout) {
      clearTimeout(this.activeLoadTimeout);
      this.activeLoadTimeout = null;
    }

    if (this.ttsFallbackTimeout) {
      clearTimeout(this.ttsFallbackTimeout);
      this.ttsFallbackTimeout = null;
    }

    if (this.activeAudio) {
      const audio = this.activeAudio;
      this.activeAudio = null;
      audio.oncanplaythrough = null;
      audio.onplaying = null;
      audio.oncanplay = null;
      audio.onended = null;
      audio.onerror = null;
      audio.onpause = null;
      try {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      } catch (e) {
        console.warn('Audio pause error:', e);
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('SpeechSynthesis cancel error:', e);
      }
    }
  }

  public isPlaying(itemId: string): boolean {
    return this.currentItemId === itemId && !this.isLoadingState;
  }

  public isLoading(itemId: string): boolean {
    return this.currentItemId === itemId && this.isLoadingState;
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentItemId, this.isLoadingState);
      } catch (err) {
        console.error('Error in recitation listener:', err);
      }
    });
  }
}

export const recitationPlayer = new RecitationPlayer();
