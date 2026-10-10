import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { config } from '../config';
import Hero from '../components/Hero';
import Envelope from '../components/Envelope';
import Countdown from '../components/Countdown';
import Story from '../components/Story';
import EventDetails from '../components/EventDetails';
import Gallery from '../components/Gallery';
import VideoBlock from '../components/VideoBlock';
import MessageForm from '../components/MessageForm';
import AudioToggle from '../components/AudioToggle';
import Preloader from '../components/Preloader';
import Particles from '../components/Particles';

export default function Invitation() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const contentRef = useRef(null);

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpen(true);
    // Accessibility: Move focus to the revealed invitation content
    setTimeout(() => {
      contentRef.current?.focus();
    }, 100);
  };

  return (
    <main
      className="min-h-screen bg-cream text-brown font-amiri relative selection:bg-gold selection:text-cream overflow-x-hidden"
    >
      {/* Background ambient particles (Phase 7) */}
      <Particles />

      {/* Floating Audio Toggle (Phase 6) */}
      <AudioToggle />

      {/* Preloader (Phase 7) */}
      <Preloader />

      {/* Envelope Intro (Phase 1) */}
      {!isEnvelopeOpen && (
        <Envelope onOpen={handleEnvelopeOpen} />
      )}

      {/* Main Invitation Content */}
      <motion.div
        ref={contentRef}
        tabIndex={-1}
        id="invitation-content"
        className="max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center outline-none"
        initial={{ opacity: 0, y: 20 }}
        animate={isEnvelopeOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      >
        {/* Hero Section with Gold Frame (Phase 2) */}
        <Hero />

        {/* Live Countdown (Phase 2) */}
        <Countdown />

        {/* Story Scroll Timeline (Phase 3) */}
        <Story />

        {/* Event Details, Map & Calendar (Phase 4) */}
        <EventDetails />

        {/* Media Block & Gallery (Phase 6) */}
        <VideoBlock />
        <Gallery />

        {/* Guest Messages Form (Phase 5) */}
        <MessageForm />

        {/* Subtle Footer */}
        <footer className="text-center text-brown-soft text-sm mt-12 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-[0.5px] w-8 bg-gold/60"></span>
            <span className="diamond-shape scale-75"></span>
            <span className="h-[0.5px] w-8 bg-gold/60"></span>
          </div>
          <p>نتشرف بحضوركم ومشاركتكم فرحتنا</p>
          <p className="text-xs text-gold-dark mt-1 font-sans">
            {config.groom} & {config.bride}
          </p>
        </footer>
      </motion.div>
    </main>
  );
}
