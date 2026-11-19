class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    delay = 0,
    gainPeak = 0.14
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playClick(): void {
    this.playTone(540, 0.06, 'triangle', 0, 0.08);
  }

  public playCorrect(): void {
    this.playTone(523.25, 0.12, 'triangle', 0, 0.14); // C5
    this.playTone(659.25, 0.14, 'triangle', 0.08, 0.14); // E5
    this.playTone(783.99, 0.24, 'triangle', 0.16, 0.16); // G5
  }

  public playWrong(): void {
    this.playTone(240, 0.14, 'sine', 0, 0.12);
    this.playTone(190, 0.22, 'sine', 0.11, 0.12);
  }

  public playTick(): void {
    this.playTone(880, 0.05, 'sine', 0, 0.05);
  }

  public playWin(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      this.playTone(freq, idx === notes.length - 1 ? 0.45 : 0.14, 'triangle', idx * 0.1, 0.15);
    });
  }
}

export const soundFX = new SoundEngine();
