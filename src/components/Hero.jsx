import React from 'react';
import { config } from '../config';
import GoldFrame from './GoldFrame';

/**
 * Hero component placeholder (Implemented in Phase 2)
 */
export default function Hero() {
  return (
    <section className="hero-section py-8 px-4 flex flex-col items-center justify-center text-center" data-testid="hero">
      <GoldFrame className="max-w-md w-full my-4">
        <p className="text-gold-dark text-sm sm:text-base mb-2 font-normal">
          بسم الله الرحمن الرحيم
        </p>
        <p className="text-brown text-base sm:text-lg mb-4">
          يتشرفان بدعوتكم لحضور خطوبتهما
        </p>

        {/* Diamond divider */}
        <div className="flex items-center justify-center gap-3 my-4">
          <span className="h-[1px] w-12 bg-gold"></span>
          <span className="diamond-shape"></span>
          <span className="h-[1px] w-12 bg-gold"></span>
        </div>

        {/* Names */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-dark my-3">
          <span>{config.groom}</span>
          <span className="text-gold mx-2">&</span>
          <span>{config.bride}</span>
        </h1>
      </GoldFrame>
    </section>
  );
}
