import React from 'react';
import { motion } from 'framer-motion';
import { config } from '../config';
import GoldFrame from './GoldFrame';
import { generateIcs, getGoogleCalendarUrl } from '../lib/ics';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function EventDetails() {
  const prefersReducedMotion = useReducedMotion();

  const { fullDate, timeString } = React.useMemo(() => {
    try {
      const date = new Date(config.eventDateISO);
      const fullDate = new Intl.DateTimeFormat('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);

      const timeString = new Intl.DateTimeFormat('ar-EG', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(date);

      return { fullDate, timeString };
    } catch {
      return { fullDate: '', timeString: '' };
    }
  }, []);

  const handleDownloadIcs = () => {
    generateIcs(config);
  };

  const googleCalUrl = getGoogleCalendarUrl(config);

  return (
    <section
      className="event-details-section w-full py-10 px-2 sm:px-4 flex flex-col items-center"
      data-testid="event-details"
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-dark font-amiri mb-2">
          تفاصيل الحفل
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="h-[1px] w-12 bg-gold"></span>
          <span className="diamond-shape"></span>
          <span className="h-[1px] w-12 bg-gold"></span>
        </div>
      </div>

      <motion.div
        className="w-full max-w-lg"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <GoldFrame innerClassName="p-5 sm:p-7 space-y-6 text-center">
          {/* 1. Date & Time */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gold tracking-widest uppercase">
              الموعد والوقت
            </span>
            <p className="text-xl sm:text-2xl font-bold text-brown font-amiri">
              {fullDate}
            </p>
            {timeString && (
              <p className="text-base text-gold-dark font-medium font-amiri">
                الساعة {timeString}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="h-[0.5px] w-8 bg-gold/50"></span>
            <span className="w-1.5 h-1.5 rotate-45 bg-gold inline-block"></span>
            <span className="h-[0.5px] w-8 bg-gold/50"></span>
          </div>

          {/* 2. Venue Location */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gold tracking-widest uppercase">
              المكان
            </span>
            <p className="text-xl sm:text-2xl font-bold text-brown font-amiri">
              {config.venueName}
            </p>
            {config.venueCity && (
              <p className="text-sm sm:text-base text-brown-soft">
                {config.venueCity}
              </p>
            )}
          </div>

          {/* 3. Interactive Embedded Map */}
          {config.mapsEmbedSrc && (
            <div className="pt-2">
              <div className="w-full h-48 sm:h-56 rounded-sm border border-gold/60 overflow-hidden shadow-inner bg-cream/50">
                <iframe
                  title="موقع قاعات لافي للحفلات"
                  src={config.mapsEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* 4. Optional Dress Code */}
          {config.dressCode && (
            <div className="pt-2 border-t border-gold/30">
              <span className="text-xs font-semibold text-gold tracking-widest uppercase block mb-1">
                الزي المقترح
              </span>
              <p className="text-sm sm:text-base text-brown-soft">
                {config.dressCode}
              </p>
            </div>
          )}

          {/* 5. Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            {config.mapsUrl && (
              <a
                href={config.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-gold text-cream font-medium rounded-[3px] hover:bg-gold-dark transition-colors shadow-sm text-sm"
              >
                <svg
                  className="w-4 h-4 me-2 stroke-current fill-none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                افتح الخريطة (Google Maps)
              </a>
            )}

            <button
              type="button"
              onClick={handleDownloadIcs}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-gold text-cream font-medium rounded-[3px] hover:bg-gold-dark transition-colors shadow-sm text-sm"
            >
              <svg
                className="w-4 h-4 me-2 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              أضف للتقويم (.ics)
            </button>
          </div>

          {/* Secondary Google Calendar link */}
          <div className="pt-1">
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gold-dark hover:underline inline-flex items-center gap-1 font-amiri"
            >
              <span>أو أضف إلى تقويم Google</span>
              <span>↗</span>
            </a>
          </div>
        </GoldFrame>
      </motion.div>
    </section>
  );
}
