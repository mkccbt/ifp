type Listener = (activeId: string | null) => void;

class TextToSpeechEngine {
  private activeId: string | null = null;
  private listeners = new Set<Listener>();

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getActiveId(): string | null {
    return this.activeId;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn(this.activeId));
  }

  public stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
    if (this.activeId !== null) {
      this.activeId = null;
      this.notify();
    }
  }

  public speak(id: string, text: string): void {
    if (!this.isSupported() || !text.trim()) return;

    // Toggle off if already speaking the same item
    if (this.activeId === id && window.speechSynthesis.speaking) {
      this.stop();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.94;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const indoVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith('id')) ||
      voices.find((v) => v.lang.toLowerCase().includes('ind'));
    if (indoVoice) {
      utterance.voice = indoVoice;
    }

    this.activeId = id;
    this.notify();

    utterance.onend = () => {
      if (this.activeId === id) {
        this.activeId = null;
        this.notify();
      }
    };

    utterance.onerror = () => {
      if (this.activeId === id) {
        this.activeId = null;
        this.notify();
      }
    };

    window.speechSynthesis.speak(utterance);
  }
}

export const ttsEngine = new TextToSpeechEngine();
