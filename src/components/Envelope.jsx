import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '../lib/audio';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { config } from '../config';

/**
 * Envelope Component (Phase 1)
 *
 * Sequence:
 * 0.0-0.6s: Envelope fades in and scales slightly (0.95 to 1.0).
 * Idle: Gold wax seal gently pulses with "اضغط لفتح الدعوة" label.
 * On tap:
 *  - 0.0-0.4s: Seal cracks into two halves that fall away.
 *  - 0.3-1.0s: Top flap flips open (rotateX 0 -> 180deg).
 *  - 0.8-1.6s: Card slides up out of the envelope.
 *  - Hold 0.5s, then envelope slides down and fades out (1.0s) while onOpen() reveals invitation.
 *
 * Reduced Motion:
 *  - Skips 3D flip and slide; fades directly into invitation on tap.
 */
export default function Envelope({ onOpen }) {
  const [stage, setStage] = useState('idle'); // 'idle' | 'opening' | 'opened' | 'done'
  const prefersReducedMotion = useReducedMotion();

  // Lock body scroll while envelope is active
  useEffect(() => {
    if (stage !== 'done') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [stage]);

  const handleOpen = () => {
    if (stage !== 'idle') return;

    if (prefersReducedMotion) {
      audio.play('open');
      setStage('done');
      if (onOpen) onOpen();
      return;
    }

    setStage('opening');
    audio.play('seal');

    // Sequence timing
    setTimeout(() => {
      audio.play('open');
    }, 400);

    // After card slides up and holds, fade out envelope
    setTimeout(() => {
      setStage('opened');
    }, 2100);

    // Complete transition and trigger onOpen
    setTimeout(() => {
      setStage('done');
      if (onOpen) onOpen();
    }, 3100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  if (stage === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream/95 backdrop-blur-sm p-4 overflow-hidden select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        data-testid="envelope-modal"
      >
        <motion.div
          className="relative w-full max-w-[350px] sm:max-w-[400px] flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={
            stage === 'opened'
              ? { opacity: 0, y: 70, scale: 0.96 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{ duration: stage === 'opened' ? 1.0 : 0.6, ease: 'easeOut' }}
        >
          {/* 3D Envelope Container */}
          <div
            className="relative w-[320px] sm:w-[360px] h-[215px] sm:h-[240px] mx-auto shadow-2xl rounded-sm"
            style={{ perspective: '1200px' }}
          >
            {/* 1. Envelope Back Base */}
            <div className="absolute inset-0 bg-[#EFE6D5] border border-gold/60 rounded-sm shadow-inner" />

            {/* 2. The Card Inside */}
            <motion.div
              className="absolute inset-x-3 top-3 bottom-3 bg-[#FCF8F2] border-[1.5px] border-gold p-1 shadow-md z-10 flex flex-col items-center justify-center text-center"
              initial={{ y: 0 }}
              animate={
                stage === 'opening' || stage === 'opened'
                  ? { y: -125, zIndex: 30 }
                  : { y: 0, zIndex: 10 }
              }
              transition={{
                delay: 0.8,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="w-full h-full border-[0.5px] border-gold/70 p-3 flex flex-col items-center justify-center">
                <p className="text-gold-dark text-[11px] font-amiri mb-1">
                  بسم الله الرحمن الرحيم
                </p>
                <div className="flex items-center justify-center gap-1.5 my-1">
                  <span className="h-[0.5px] w-6 bg-gold"></span>
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold inline-block"></span>
                  <span className="h-[0.5px] w-6 bg-gold"></span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-brown font-amiri mt-1">
                  {config.groom} & {config.bride}
                </h3>
                <p className="text-[12px] text-brown-soft mt-1">
                  دعوة خطوبة
                </p>
              </div>
            </motion.div>

            {/* 3. Envelope Pocket (Left, Right, Bottom flaps) */}
            <svg
              className="absolute inset-0 w-full h-full z-20 pointer-events-none drop-shadow-sm"
              viewBox="0 0 360 240"
              preserveAspectRatio="none"
            >
              {/* Left flap */}
              <polygon
                points="0,0 180,120 0,240"
                fill="#E8DEC8"
                stroke="#B08D3C"
                strokeWidth="0.75"
              />
              {/* Right flap */}
              <polygon
                points="360,0 180,120 360,240"
                fill="#E5D9C2"
                stroke="#B08D3C"
                strokeWidth="0.75"
              />
              {/* Bottom flap */}
              <polygon
                points="0,240 180,110 360,240"
                fill="#F4ECE0"
                stroke="#B08D3C"
                strokeWidth="0.75"
              />
            </svg>

            {/* 4. Top Flap with 3D Rotate */}
            <motion.div
              className="absolute inset-x-0 top-0 h-[125px] sm:h-[135px] origin-top z-25"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'top center',
              }}
              initial={{ rotateX: 0 }}
              animate={
                stage === 'opening' || stage === 'opened'
                  ? { rotateX: 180, zIndex: 5 }
                  : { rotateX: 0, zIndex: 25 }
              }
              transition={{
                delay: 0.35,
                duration: 0.75,
                ease: 'easeInOut',
              }}
            >
              <svg
                className="w-full h-full drop-shadow-md"
                viewBox="0 0 360 135"
                preserveAspectRatio="none"
              >
                <polygon
                  points="0,0 180,135 360,0"
                  fill="#F0E6D4"
                  stroke="#B08D3C"
                  strokeWidth="0.75"
                />
              </svg>
            </motion.div>

            {/* 5. Wax Seal with Interactive Tap & Split */}
            <div
              className="absolute top-[90px] sm:top-[100px] left-1/2 -translate-x-1/2 z-40"
              style={{ perspective: '600px' }}
            >
              <button
                type="button"
                onClick={handleOpen}
                onKeyDown={handleKeyDown}
                disabled={stage !== 'idle'}
                aria-label="اضغط لفتح الدعوة"
                className="relative group focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 rounded-full cursor-pointer disabled:cursor-default"
                data-testid="wax-seal-button"
              >
                {/* Idle Gentle Pulse */}
                <motion.div
                  className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full"
                  animate={
                    stage === 'idle'
                      ? { scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.08)', 'brightness(1)'] }
                      : {}
                  }
                  transition={{
                    repeat: stage === 'idle' ? Infinity : 0,
                    duration: 2.2,
                    ease: 'easeInOut',
                  }}
                >
                  {/* Left Half of Seal */}
                  <motion.div
                    className="absolute inset-y-0 start-0 w-1/2 overflow-hidden"
                    animate={
                      stage === 'opening' || stage === 'opened'
                        ? { x: -35, y: 25, rotate: -25, opacity: 0 }
                        : { x: 0, y: 0, rotate: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.45, ease: 'easeIn' }}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#C8A24D] via-[#B08D3C] to-[#8D6F2B] border border-[#6B521E] shadow-lg flex items-center justify-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#DFBF70]/60 flex items-center justify-center">
                        <span className="text-cream text-lg font-bold drop-shadow">❦</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Half of Seal */}
                  <motion.div
                    className="absolute inset-y-0 end-0 w-1/2 overflow-hidden"
                    animate={
                      stage === 'opening' || stage === 'opened'
                        ? { x: 35, y: 25, rotate: 25, opacity: 0 }
                        : { x: 0, y: 0, rotate: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.45, ease: 'easeIn' }}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 -ms-7 sm:-ms-8 rounded-full bg-gradient-to-br from-[#C8A24D] via-[#B08D3C] to-[#8D6F2B] border border-[#6B521E] shadow-lg flex items-center justify-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#DFBF70]/60 flex items-center justify-center">
                        <span className="text-cream text-lg font-bold drop-shadow">❦</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </button>
            </div>
          </div>

          {/* Label below the envelope */}
          <motion.div
            className="text-center mt-8"
            animate={stage === 'idle' ? { opacity: [0.7, 1, 0.7] } : { opacity: 0 }}
            transition={{
              duration: 2,
              repeat: stage === 'idle' ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <p className="text-gold-dark font-amiri text-base sm:text-lg font-bold tracking-wide">
              اضغط لفتح الدعوة
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-1.5 opacity-60">
              <span className="h-[0.5px] w-5 bg-gold"></span>
              <span className="w-1 h-1 rotate-45 bg-gold inline-block"></span>
              <span className="h-[0.5px] w-5 bg-gold"></span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
