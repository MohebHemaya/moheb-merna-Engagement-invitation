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

  const photoSrc = config.couplePhoto || '/assets/couple-proposal.png';

  return (
    <section
      className="hero-section w-full py-6 flex flex-col items-center justify-center text-center"
      data-testid="hero"
    >
      <GoldFrame className="w-full max-w-md sm:max-w-lg shadow-xl">
        {/* Header Invitation Greeting */}
        <motion.p
          className="text-gold-dark text-sm sm:text-base font-semibold mb-1 font-amiri tracking-wider"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          دعوة خطوبة
        </motion.p>

        <motion.p
          className="text-brown text-base sm:text-lg mb-5 font-amiri"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
        >
          يتشرفان بدعوتكم لحضور حفل خطوبتهما
        </motion.p>

        {/* Framed Couple Photo */}
        <div className="flex justify-center my-3">
          <div className="border-2 border-gold p-[5px] bg-cream shadow-lg rounded-sm inline-block">
            <motion.div
              className="overflow-hidden w-[230px] h-[230px] sm:w-[270px] sm:h-[270px] bg-[#FAF5EB] rounded-sm"
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 }
              }
              animate={{
                clipPath: 'inset(0% 0% 0% 0%)',
                opacity: 1,
              }}
              transition={{
                duration: 1.2,
                ease: 'easeOut',
              }}
            >
              <img
                src={photoSrc}
                alt={`${config.groom} & ${config.bride}`}
                width={270}
                height={270}
                loading="eager"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </div>
        </div>

        {/* Names with RTL Wipe Reveal */}
        <div className="my-5 flex flex-col items-center">
          <motion.div
            className="flex items-center justify-center gap-3 text-3xl sm:text-4xl md:text-5xl font-bold text-brown font-amiri"
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' }
            }
            animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
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

          {/* Formatted Date */}
          {formattedDate && (
            <motion.p
              className="text-brown text-base sm:text-lg font-amiri font-semibold"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
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

        {/* Subtle Scroll Hint */}
        <motion.div
          className="mt-5 flex flex-col items-center opacity-70"
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
          <span className="text-xs text-brown-soft mb-1 font-amiri">مرر للأسفل للتفاصيل</span>
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
