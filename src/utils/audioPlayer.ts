// Audio recitation player with HTML5 Audio and Web Speech Synthesis fallback

type PlayerListener = (playingItemId: string | null, isLoading: boolean) => void;

class RecitationPlayer {
  private audio: HTMLAudioElement | null = null;
  private currentItemId: string | null = null;
  private isLoadingState: boolean = false;
  private listeners: Set<PlayerListener> = new Set();
  private currentSessionId: number = 0;
  private activeLoadTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      // Set inline attributes for mobile compatibility
      this.audio.setAttribute('playsinline', 'true');
      this.audio.setAttribute('webkit-playsinline', 'true');
      this.audio.preload = 'auto';
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

  // Pre-warms audio element on direct user touch/click gesture for mobile iOS/Android
  public unlockMobileAudio() {
    if (this.audio) {
      try {
        if (!this.audio.src) {
          // Silent 1px wav buffer
          this.audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
          this.audio.load();
        }
      } catch (e) {
        console.warn('Mobile audio unlock warning:', e);
      }
    }
  }

  public playRecitation(itemId: string, audioUrl?: string, arabicText?: string, onEnded?: () => void) {
    // If already playing or loading this item, toggle pause
    if (this.currentItemId === itemId && (this.audio || (typeof window !== 'undefined' && 'speechSynthesis' in window))) {
      this.pause();
      return;
    }

    // Stop previous media and invalidate past session callbacks
    this.stopInternal();

    // Increment session ID to discard events from older play calls
    const sessionId = ++this.currentSessionId;

    if (audioUrl && this.audio) {
      this.currentItemId = itemId;
      this.isLoadingState = true;
      this.notifyListeners();

      // Clear previous audio source and state
      this.audio.pause();
      this.audio.src = audioUrl;
      this.audio.load();

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

      const clearHandlers = () => {
        if (this.audio) {
          this.audio.oncanplaythrough = null;
          this.audio.onplaying = null;
          this.audio.onended = null;
          this.audio.onerror = null;
          this.audio.onpause = null;
        }
        if (this.activeLoadTimeout) {
          clearTimeout(this.activeLoadTimeout);
          this.activeLoadTimeout = null;
        }
      };

      // Timeout safeguard in case network hangs
      this.activeLoadTimeout = setTimeout(() => {
        if (this.currentSessionId === sessionId && this.isLoadingState) {
          console.warn('Audio URL load timed out, trying speech synthesis fallback');
          clearHandlers();
          this.playSpeechSynthesis(itemId, arabicText || '', sessionId, onEnded);
        }
      }, 7000);

      this.audio.oncanplaythrough = () => {
        if (this.currentSessionId === sessionId) {
          if (this.activeLoadTimeout) clearTimeout(this.activeLoadTimeout);
          this.isLoadingState = false;
          this.notifyListeners();
        }
      };

      this.audio.onplaying = () => {
        if (this.currentSessionId === sessionId) {
          if (this.activeLoadTimeout) clearTimeout(this.activeLoadTimeout);
          this.isLoadingState = false;
          this.notifyListeners();
        }
      };

      this.audio.onended = () => {
        if (this.currentSessionId === sessionId) {
          clearHandlers();
          cleanupAndTriggerEnd();
        }
      };

      this.audio.onerror = (e) => {
        if (this.currentSessionId === sessionId) {
          console.warn('Audio URL playback error, falling back to Web Speech API:', e);
          clearHandlers();
          this.playSpeechSynthesis(itemId, arabicText || '', sessionId, onEnded);
        }
      };

      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (this.currentSessionId === sessionId) {
            console.warn('audio.play() rejected (autoplay/format constraint), falling back to TTS:', err);
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
    } catch (e) {
      console.warn('SpeechSynthesis cancel error:', e);
    }

    this.currentItemId = itemId;
    this.isLoadingState = false;
    this.notifyListeners();

    // Strip diacritics for clearer mobile Web Speech Synthesis
    const cleanText = text.replace(/[\u0610-\u061A\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText || text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;

    let fired = false;
    const finish = () => {
      if (fired) return;
      fired = true;
      if (this.currentSessionId === sessionId) {
        this.currentItemId = null;
        this.isLoadingState = false;
        this.notifyListeners();
        if (onEnded) onEnded();
      }
    };

    utterance.onend = finish;
    utterance.onerror = finish;

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

    if (this.audio) {
      this.audio.oncanplaythrough = null;
      this.audio.onplaying = null;
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio.onpause = null;
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
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
        console.error('Error in audio player listener:', err);
      }
    });
  }
}

export const recitationPlayer = new RecitationPlayer();

