import React from 'react';
import GoldFrame from '../components/GoldFrame';

export default function Admin() {
  return (
    <div className="min-h-screen bg-cream text-brown font-amiri p-4 sm:p-8 flex items-center justify-center">
      <GoldFrame className="max-w-lg w-full">
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gold-dark mb-2">
            لوحة الإدارة - رسائل التهنئة
          </h1>
          <p className="text-sm text-brown-soft">
            هذه الصفحة مخصصة فقط لصاحب الدعوة لقراءة رسائل الضيوف
          </p>
        </header>

        <div className="border border-gold/40 rounded p-4 text-center bg-cream/70 my-4">
          <p className="text-brown">
            سيتم تفعيل تسجيل الدخول وإدارة الرسائل في المرحلة الخامسة (Phase 5).
          </p>
        </div>
      </GoldFrame>
    </div>
  );
}
