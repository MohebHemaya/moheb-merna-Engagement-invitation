import React from 'react';
import { motion } from 'framer-motion';
import { config } from '../config';
import GoldFrame from './GoldFrame';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  // Formatted date in Arabic (ar-EG)
  const formattedDate = React.useMemo(() => {
    try {
      const date = new Date(config.eventDateISO);
      return new Intl.DateTimeFormat('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch {
      return '';
    }
  }, []);

  const photoSrc = config.story?.[0]?.image || '/assets/couple-proposal.png';

  return (
    <section
      className="hero-section w-full py-6 flex flex-col items-center justify-center text-center"
      data-testid="hero"
    >
      <GoldFrame className="w-full max-w-md sm:max-w-lg shadow-xl">
        {/* 1. Bismillah */}
        {/* 1. Christian Blessing & Verse */}
        <motion.div
          className="mb-3 space-y-1"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {config.headerBlessing && (
            <p className="text-gold-dark text-xs sm:text-sm font-medium font-amiri tracking-wide">
              {config.headerBlessing}
            </p>
          )}
          {config.bibleVerse && (
            <p className="text-brown-soft text-sm sm:text-base font-semibold font-amiri italic">
              {config.bibleVerse}
            </p>
          )}
        </motion.div>

        {/* 2. Invitation Greeting */}
        <motion.p
          className="text-brown text-base sm:text-lg mb-6 font-amiri"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
        >
          يتشرفان بدعوتكم لحضور خطوبتهما
        </motion.p>

        {/* 3. Framed Photo with Development Animation */}
        <div className="flex justify-center my-4">
          <div className="border-2 border-gold p-[5px] bg-cream shadow-md rounded-sm inline-block">
            <motion.div
              className="overflow-hidden w-[190px] h-[236px] sm:w-[220px] sm:h-[275px] bg-[#EADECA]"
              initial={
                prefersReducedMotion
                  ? { opacity: 1, filter: 'sepia(0.5) contrast(1.03)' }
                  : {
                      clipPath: 'inset(100% 0% 0% 0%)',
                      filter: 'grayscale(100%)',
                    }
              }
              animate={{
                clipPath: 'inset(0% 0% 0% 0%)',
                filter: 'sepia(0.5) contrast(1.03)',
              }}
              transition={{
                clipPath: { duration: 1.2, ease: 'easeOut' },
                filter: { duration: 2.0, ease: 'easeInOut' },
              }}
            >
              <img
                src={photoSrc}
                alt="صورة العروسين"
                width={190}
                height={236}
                loading="eager"
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 62%' }}
              />
            </motion.div>
          </div>
        </div>

        {/* 4. Names with RTL Wipe Reveal */}
        <div className="my-5 flex flex-col items-center">
          <motion.div
            className="flex items-center justify-center gap-3 text-3xl sm:text-4xl md:text-5xl font-bold text-brown font-amiri"
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' }
            }
            animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
          >
            <span className="text-gold-dark">{config.groom}</span>
            <span className="text-gold text-2xl sm:text-3xl font-normal">&</span>
            <span className="text-gold-dark">{config.bride}</span>
          </motion.div>

          {/* Diamond Divider */}
          <div className="flex items-center justify-center gap-3 my-4">
            <span className="h-[1px] w-12 sm:w-16 bg-gold"></span>
            <span className="diamond-shape"></span>
            <span className="h-[1px] w-12 sm:w-16 bg-gold"></span>
          </div>

          {/* 5. Formatted Date */}
          {formattedDate && (
            <motion.p
              className="text-brown text-base sm:text-lg font-amiri font-semibold"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
            >
              {formattedDate}
            </motion.p>
          )}

          {/* Venue teaser */}
          {config.venueName && (
            <p className="text-brown-soft text-sm sm:text-base mt-1">
              {config.venueName} - {config.venueCity}
            </p>
          )}
        </div>

        {/* 7. Subtle Scroll Hint */}
        <motion.div
          className="mt-6 flex flex-col items-center opacity-70"
          animate={
            prefersReducedMotion
              ? {}
              : { y: [0, 5, 0] }
          }
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: 'easeInOut',
          }}
        >
          <span className="text-xs text-brown-soft mb-1 font-amiri">مرر للأسفل</span>
          <svg
            className="w-4 h-4 text-gold stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </GoldFrame>
    </section>
  );
}
