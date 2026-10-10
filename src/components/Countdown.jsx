import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';
import { config } from '../config';

const arabicFormatter = new Intl.NumberFormat('ar-EG', { useGrouping: false });

function DigitBox({ value, label }) {
  const arabicValue = arabicFormatter.format(value);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-cream border-[1.5px] border-gold rounded-sm shadow-sm flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={arabicValue}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-2xl sm:text-3xl font-bold text-brown font-amiri"
          >
            {arabicValue}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs sm:text-sm text-brown-soft font-amiri mt-1.5 font-medium">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const { days, hours, minutes, seconds, isArrived } = useCountdown(config.eventDateISO);

  if (isArrived) {
    return (
      <div className="w-full my-6 p-4 border-[1.5px] border-gold bg-cream/80 text-center rounded-sm">
        <p className="text-lg sm:text-xl font-bold text-gold-dark font-amiri">
          {config.eventPassedMessage || 'الليلة هي الليلة! نتشرف بحضوركم ومشاركتكم فرحتنا'}
        </p>
      </div>
    );
  }

  return (
    <div
      className="countdown-wrapper my-6 w-full flex flex-col items-center justify-center"
      data-testid="countdown"
    >
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <DigitBox value={days} label="أيام" />
        <span className="text-gold font-bold text-xl mb-6">:</span>
        <DigitBox value={hours} label="ساعات" />
        <span className="text-gold font-bold text-xl mb-6">:</span>
        <DigitBox value={minutes} label="دقائق" />
        <span className="text-gold font-bold text-xl mb-6">:</span>
        <DigitBox value={seconds} label="ثوانٍ" />
      </div>
    </div>
  );
}
