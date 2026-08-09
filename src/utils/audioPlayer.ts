// Audio recitation player with HTML5 Audio and Web Speech Synthesis fallback

type PlayerListener = (playingItemId: string | null, isLoading: boolean) => void;

class RecitationPlayer {
  private currentAudio: HTMLAudioElement | null = null;
  private currentItemId: string | null = null;
  private isLoadingState: boolean = false;
  private listeners: Set<PlayerListener> = new Set();

  public subscribe(listener: PlayerListener) {
    this.listeners.add(listener);
    // Send current state immediately
    listener(this.currentItemId, this.isLoadingState);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public playRecitation(itemId: string, audioUrl?: string, arabicText?: string) {
    // If already playing or loading this item, toggle pause
    if (this.currentItemId === itemId) {
      this.pause();
      return;
    }

    // Stop any existing audio
    this.stop();

    if (audioUrl) {
      this.currentItemId = itemId;
      this.isLoadingState = true;
      this.notifyListeners();

      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.addEventListener('canplaythrough', () => {
        this.isLoadingState = false;
        this.notifyListeners();
      });

      audio.addEventListener('play', () => {
        this.isLoadingState = false;
        this.notifyListeners();
      });

      audio.addEventListener('pause', () => {
        if (this.currentItemId === itemId) {
          this.currentItemId = null;
          this.isLoadingState = false;
          this.notifyListeners();
        }
      });

      audio.addEventListener('ended', () => {
        this.currentItemId = null;
        this.currentAudio = null;
        this.isLoadingState = false;
        this.notifyListeners();
      });

      audio.addEventListener('error', () => {
        console.warn('Audio URL playback error, falling back to Web Speech API');
        this.playSpeechSynthesis(itemId, arabicText || '');
      });

      audio.play().catch(() => {
        this.playSpeechSynthesis(itemId, arabicText || '');
      });
    } else if (arabicText) {
      this.playSpeechSynthesis(itemId, arabicText);
    }
  }

  private playSpeechSynthesis(itemId: string, text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.currentItemId = null;
      this.isLoadingState = false;
      this.notifyListeners();
      return;
    }

    window.speechSynthesis.cancel();
    this.currentItemId = itemId;
    this.isLoadingState = false;
    this.notifyListeners();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;

    utterance.onend = () => {
      this.currentItemId = null;
      this.notifyListeners();
    };

    utterance.onerror = () => {
      this.currentItemId = null;
      this.notifyListeners();
    };

    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentItemId = null;
    this.isLoadingState = false;
    this.notifyListeners();
  }

  public stop() {
    this.pause();
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
