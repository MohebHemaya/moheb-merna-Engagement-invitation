import React from 'react';

/**
 * GoldFrame
 * Reusable wrapper rendering the classic luxe double gold frame:
 * Outer border: 1.5px solid gold (#B08D3C)
 * Spacing: 5px gap between outer and inner frame
 * Inner border: 0.5px solid gold
 */
export default function GoldFrame({ children, className = '', innerClassName = '' }) {
  return (
    <div
      className={`border-[1.5px] border-gold p-[5px] bg-cream/40 transition-all ${className}`}
      data-testid="gold-frame"
    >
      <div className={`border-[0.5px] border-gold p-4 sm:p-6 ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}
