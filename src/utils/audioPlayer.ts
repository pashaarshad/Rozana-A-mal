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
  private audio: HTMLAudioElement | null = null;
  private currentItemId: string | null = null;
  private isLoadingState: boolean = false;
  private listeners: Set<PlayerListener> = new Set();
  private currentSessionId: number = 0;
  private activeLoadTimeout: ReturnType<typeof setTimeout> | null = null;
  private ttsFallbackTimeout: ReturnType<typeof setTimeout> | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      // Set inline attributes for mobile iOS/Android compatibility
      this.audio.setAttribute('playsinline', 'true');
      this.audio.setAttribute('webkit-playsinline', 'true');
      this.audio.preload = 'auto';

      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.getVoices();
        } catch {
          // ignore
        }
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

  // Pre-warms and unlocks both Audio element AND Web Speech Synthesis on direct user touch/click gesture for mobile iOS/Android
  public unlockMobileAudio() {
    if (typeof window === 'undefined') return;

    // 1. Unlock HTML5 Audio
    if (this.audio) {
      try {
        if (!this.audio.src) {
          // Silent 1px wav buffer
          this.audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
          this.audio.load();
        }
        const p = this.audio.play();
        if (p !== undefined) {
          p.then(() => {
            if (this.audio && this.audio.src.startsWith('data:')) {
              this.audio.pause();
            }
          }).catch(() => {});
        }
      } catch (e) {
        console.warn('Mobile audio unlock warning:', e);
      }
    }

    // 2. Unlock Web Speech Synthesis
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        const dummy = new SpeechSynthesisUtterance('');
        dummy.volume = 0;
        window.speechSynthesis.speak(dummy);
      } catch (e) {
        console.warn('SpeechSynthesis unlock warning:', e);
      }
    }
  }

  public playRecitation(itemId: string, rawAudioUrl?: string, arabicText?: string, onEnded?: () => void) {
    // If already playing or loading this item, toggle pause
    if (this.currentItemId === itemId && (this.audio || (typeof window !== 'undefined' && 'speechSynthesis' in window))) {
      this.pause();
      return;
    }

    // Unlock audio contexts in case gesture is attached
    this.unlockMobileAudio();

    // Stop previous media and invalidate past session callbacks
    this.stopInternal();

    // Increment session ID to discard events from older play calls
    const sessionId = ++this.currentSessionId;

    const absoluteAudioUrl = rawAudioUrl ? getAbsoluteAudioUrl(rawAudioUrl) : '';

    if (absoluteAudioUrl && this.audio) {
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

      const clearHandlers = () => {
        if (this.audio) {
          this.audio.oncanplaythrough = null;
          this.audio.onplaying = null;
          this.audio.oncanplay = null;
          this.audio.onended = null;
          this.audio.onerror = null;
          this.audio.onpause = null;
        }
        if (this.activeLoadTimeout) {
          clearTimeout(this.activeLoadTimeout);
          this.activeLoadTimeout = null;
        }
      };

      // Fast 2.5 second timeout safeguard for bad network / Vercel range request failures
      this.activeLoadTimeout = setTimeout(() => {
        if (this.currentSessionId === sessionId && this.isLoadingState) {
          console.warn('Audio URL load timed out (2.5s), switching to Web Speech API fallback');
          clearHandlers();
          this.playSpeechSynthesis(itemId, arabicText || '', sessionId, onEnded);
        }
      }, 2500);

      this.audio.oncanplaythrough = () => {
        if (this.currentSessionId === sessionId) {
          if (this.activeLoadTimeout) clearTimeout(this.activeLoadTimeout);
          this.isLoadingState = false;
          this.notifyListeners();
        }
      };

      this.audio.oncanplay = () => {
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
          console.warn('Audio URL playback error, switching immediately to Web Speech API:', e);
          clearHandlers();
          this.playSpeechSynthesis(itemId, arabicText || '', sessionId, onEnded);
        }
      };

      // Set src and call load() to initiate media stream loading
      try {
        this.audio.src = absoluteAudioUrl;
        this.audio.load();
      } catch (err) {
        console.warn('Setting audio.src failed:', err);
      }

      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (this.currentSessionId === sessionId) {
            console.warn('audio.play() rejected (autoplay/format constraint), switching to Speech Synthesis:', err);
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
    this.currentUtterance = utterance;

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
      this.currentUtterance = null;
      if (this.currentSessionId === sessionId) {
        this.currentItemId = null;
        this.isLoadingState = false;
        this.notifyListeners();
        if (onEnded) onEnded();
      }
    };

    utterance.onend = finish;
    utterance.onerror = finish;

    // Set a safety timeout for iOS Safari where utterance.onend sometimes drops
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

    this.currentUtterance = null;

    if (this.audio) {
      this.audio.oncanplaythrough = null;
      this.audio.onplaying = null;
      this.audio.oncanplay = null;
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
        console.error('Error in recitation listener:', err);
      }
    });
  }
}

export const recitationPlayer = new RecitationPlayer();

