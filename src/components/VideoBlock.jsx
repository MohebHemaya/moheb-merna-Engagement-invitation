import React, { useRef, useEffect } from 'react';
import { config } from '../config';
import GoldFrame from './GoldFrame';
import { useLiteMode } from '../hooks/useLiteMode';

export default function VideoBlock() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const isLite = useLiteMode();

  useEffect(() => {
    if (!config.videoSrc || isLite) return;

    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {
            // Autoplay policy or user interaction restriction
          });
        } else {
          videoEl.pause();
        }
      },
      { threshold: 0.35 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isLite]);

  if (!config.videoSrc) return null;

  return (
    <section
      ref={containerRef}
      className="video-section w-full py-10 px-2 sm:px-4 flex flex-col items-center"
      data-testid="video-block"
    >
      <div className="w-full max-w-lg">
        <GoldFrame innerClassName="p-2 sm:p-3">
          <div className="relative aspect-video w-full overflow-hidden bg-black/10 rounded-sm">
            {isLite ? (
              <img
                src={config.videoPoster || config.story?.[0]?.image}
                alt="فيديو الحفل"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <video
                ref={videoRef}
                src={config.videoSrc}
                poster={config.videoPoster}
                muted
                loop
                playsInline
                preload="none"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </GoldFrame>
      </div>
    </section>
  );
}
