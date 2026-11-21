// audio.js — every sound the game makes, synthesised with WebAudio.
// No audio files: a find is a bright two-note chime, a miss is a low buzz, a
// hint is a soft blip, a level clear is a rising arpeggio and a win is a little
// fanfare. Nothing loads, nothing streams, and M mutes it all.
export class SoundBank {
  constructor() {
    this.context = null;
    this.muted = false;
    this.lastTickSecond = -1;
  }

  /** Create the AudioContext on the first user gesture (browsers demand one). */
  ensure() {
    if (this.context === null) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.context = new AudioContext();
    }
    if (this.context && this.context.state === 'suspended') this.context.resume();
  }

  /** Mute or unmute every sound this bank makes. */
  setMuted(muted) {
    this.muted = muted;
  }

  /** One oscillator note: frequency, start delay, length, waveform and gain. */
  note(frequency, delay, length, type, gain) {
    if (this.muted || this.context === null) return;
    const start = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(gain, start + 0.015);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + length);
    oscillator.connect(envelope);
    envelope.connect(this.context.destination);
    oscillator.start(start);
    oscillator.stop(start + length + 0.05);
  }

  /** A satisfying ding-ding on a find: E6 then B6, bright and short. */
  find() {
    this.note(1318.5, 0, 0.16, 'sine', 0.22);
    this.note(1975.5, 0.07, 0.24, 'sine', 0.2);
  }

  /** A dull low buzz on a miss. */
  miss() {
    this.note(140, 0, 0.22, 'sawtooth', 0.12);
    this.note(110, 0.05, 0.2, 'sawtooth', 0.1);
  }

  /** A soft blip when a hint is spent. */
  hint() {
    this.note(880, 0, 0.12, 'triangle', 0.16);
    this.note(1174.7, 0.08, 0.14, 'triangle', 0.14);
  }

  /** A rising arpeggio when a level is cleared. */
  levelClear() {
    const steps = [523.25, 659.25, 783.99, 1046.5];
    steps.forEach((frequency, index) => {
      this.note(frequency, index * 0.09, 0.3, 'triangle', 0.2);
    });
  }

  /** A small fanfare when the last level is cleared. */
  win() {
    const steps = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
    steps.forEach((frequency, index) => {
      this.note(frequency, index * 0.11, 0.34, 'triangle', 0.2);
    });
    this.note(261.6, 0, 0.9, 'sine', 0.1);
  }

  /** A short tick; the game calls it once per second under 15 seconds left. */
  tick() {
    this.note(1200, 0, 0.05, 'square', 0.05);
  }

  /** A soft click for buttons and the title screen. */
  click() {
    this.note(660, 0, 0.07, 'sine', 0.12);
  }
}
