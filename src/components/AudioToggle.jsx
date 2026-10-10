import React, { useState, useEffect } from 'react';
import { audio } from '../lib/audio';

export default function AudioToggle() {
  const [muted, setMuted] = useState(audio.isMuted());

  useEffect(() => {
    return audio.subscribe((newMuted) => {
      setMuted(newMuted);
    });
  }, []);

  const handleToggle = () => {
    const next = audio.toggleMute();
    setMuted(next);
  };

  return (
    <div className="fixed top-4 end-4 z-40">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-cream/90 border border-gold shadow-md flex items-center justify-center text-gold-dark hover:bg-cream hover:border-gold-dark transition-all focus:outline-none focus:ring-2 focus:ring-gold/60 cursor-pointer backdrop-blur-sm"
        data-testid="audio-toggle-button"
      >
        {muted ? (
          /* Muted Icon */
          <svg
            className="w-5 h-5 stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          /* Playing Icon with animated sound wave */
          <svg
            className="w-5 h-5 stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>
    </div>
  );
}
