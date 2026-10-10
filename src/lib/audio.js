import { Howl, Howler } from 'howler';
import { config } from '../config';

class AudioManager {
  constructor() {
    this.music = null;
    this.sfx = {};
    this.muted = sessionStorage.getItem('invitation_audio_muted') === 'true';
    this.subscribers = new Set();
    this.initialized = false;

    // Apply initial mute state
    Howler.mute(this.muted);

    // Pause music when tab is hidden
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!this.music) return;
        if (document.visibilityState === 'hidden') {
          if (this.music.playing()) {
            this.music.pause();
            this.wasPlayingBeforeHidden = true;
          }
        } else {
          if (this.wasPlayingBeforeHidden && !this.muted) {
            this.music.play();
            this.wasPlayingBeforeHidden = false;
          }
        }
      });
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach((cb) => cb(this.muted));
  }

  initMusic() {
    if (this.music || !config.musicSrc) return;

    try {
      this.music = new Howl({
        src: [config.musicSrc],
        html5: true,
        loop: true,
        volume: 0,
        onloaderror: () => {
          // Fail silently if music file does not exist
          this.music = null;
        },
      });
    } catch {
      this.music = null;
    }
  }

  playMusic() {
    if (!this.music) {
      this.initMusic();
    }
    if (!this.music) return;

    if (!this.music.playing()) {
      const id = this.music.play();
      // Fade in over 2s to volume 0.35
      this.music.fade(0, 0.35, 2000, id);
    }
  }

  play(key) {
    // If key is 'open', also trigger music playback
    if (key === 'open') {
      this.playMusic();
    }

    const sfxPaths = {
      seal: '/assets/sfx/seal.mp3',
      open: '/assets/sfx/open.mp3',
      send: '/assets/sfx/send.mp3',
    };

    const path = sfxPaths[key];
    if (!path) return;

    if (!this.sfx[key]) {
      try {
        this.sfx[key] = new Howl({
          src: [path],
          volume: 0.5,
          onloaderror: () => {
            this.sfx[key] = null;
          },
        });
      } catch {
        return;
      }
    }

    try {
      this.sfx[key]?.play();
    } catch {
      // Fail silently
    }
  }

  pause() {
    if (this.music && this.music.playing()) {
      this.music.pause();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    Howler.mute(this.muted);
    try {
      sessionStorage.setItem('invitation_audio_muted', String(this.muted));
    } catch {
      // Storage unavailable fallback
    }
    this.notify();
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}

export const audio = new AudioManager();
