import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GoldFrame from './GoldFrame';
import { config } from '../config';

const arabicFormatter = new Intl.NumberFormat('ar-EG', { useGrouping: false });

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let currentProgress = 0;

    // Simulate steady progress while waiting for font and hero image
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 10;
      if (currentProgress >= 90) {
        clearInterval(interval);
      }
      setProgress((prev) => Math.min(Math.max(prev, currentProgress), 90));
    }, 120);

    const checkCriticalAssets = async () => {
      try {
        // 1. Wait for fonts
        if (document.fonts) {
          await document.fonts.ready;
        }

        // 2. Preload hero image
        const heroImgSrc = config.story?.[0]?.image || '/assets/couple-child.webp';
        await new Promise((resolve) => {
          const img = new Image();
          img.src = heroImgSrc;
          img.onload = resolve;
          img.onerror = resolve; // Continue on error
        });
      } finally {
        setProgress(100);
        setTimeout(() => {
          setIsLoaded(true);
        }, 300);
      }
    };

    checkCriticalAssets();

    return () => clearInterval(interval);
  }, []);

  if (isLoaded) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-cream flex flex-col items-center justify-center p-4 select-none"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        data-testid="preloader"
      >
        <GoldFrame className="max-w-xs w-full text-center">
          <div className="py-4 px-2 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="h-[0.5px] w-6 bg-gold"></span>
              <span className="diamond-shape"></span>
              <span className="h-[0.5px] w-6 bg-gold"></span>
            </div>

            <p className="text-xl font-bold text-brown font-amiri">
              {config.groom} & {config.bride}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gold/15 h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gold rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>

            <span className="text-xs text-gold-dark font-amiri block">
              جاري تجهيز الدعوة {arabicFormatter.format(progress)}٪
            </span>
          </div>
        </GoldFrame>
      </motion.div>
    </AnimatePresence>
  );
}
