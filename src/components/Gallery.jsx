import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { config } from '../config';
import GoldFrame from './GoldFrame';

const arabicFormatter = new Intl.NumberFormat('ar-EG');

export default function Gallery() {
  const images = config.gallery || [];
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);

  // Keyboard navigation (Esc, Left, Right)
  const handleKeyDown = useCallback(
    (e) => {
      if (selectedIndex === null) return;

      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowRight') {
        // In RTL, right arrow goes to previous or next
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    },
    [selectedIndex, images.length]
  );

  useEffect(() => {
    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedIndex, handleKeyDown]);

  // Touch swipe support
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || selectedIndex === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left
        setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      } else {
        // Swiped right
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      }
    }
    setTouchStartX(null);
  };

  if (!images || images.length === 0) return null;

  return (
    <section className="gallery-section w-full py-12 px-2 sm:px-4" data-testid="gallery">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-dark font-amiri mb-2">
          معرض الذكريات
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="h-[1px] w-12 bg-gold"></span>
          <span className="diamond-shape"></span>
          <span className="h-[1px] w-12 bg-gold"></span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className="group relative aspect-square overflow-hidden border border-gold p-1 bg-cream shadow-sm rounded-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <img
              src={img.src || img}
              alt={img.alt || `صورة ${arabicFormatter.format(idx + 1)}`}
              loading="lazy"
              className="w-full h-full object-cover rounded-sm transition-transform duration-500 group-hover:scale-105"
              style={{ filter: 'sepia(0.3) contrast(1.02)' }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 start-4 text-cream hover:text-gold p-2 z-50 text-2xl font-bold focus:outline-none cursor-pointer"
              aria-label="إغلاق المعرض"
            >
              ✕
            </button>

            {/* Counter */}
            <div className="absolute top-5 end-5 text-cream/80 text-sm font-amiri z-50">
              {arabicFormatter.format(selectedIndex + 1)} / {arabicFormatter.format(images.length)}
            </div>

            {/* Prev Button */}
            <button
              type="button"
              onClick={() =>
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
              }
              className="absolute start-3 top-1/2 -translate-y-1/2 p-3 text-cream/70 hover:text-cream text-3xl focus:outline-none z-50 cursor-pointer"
              aria-label="الصورة السابقة"
            >
              ‹
            </button>

            {/* Current Image */}
            <motion.div
              key={selectedIndex}
              className="max-w-xl max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GoldFrame className="bg-black/40">
                <img
                  src={images[selectedIndex]?.src || images[selectedIndex]}
                  alt="عرض الصورة"
                  className="max-h-[70vh] w-auto mx-auto object-contain"
                />
              </GoldFrame>
            </motion.div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() =>
                setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
              }
              className="absolute end-3 top-1/2 -translate-y-1/2 p-3 text-cream/70 hover:text-cream text-3xl focus:outline-none z-50 cursor-pointer"
              aria-label="الصورة التالية"
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
