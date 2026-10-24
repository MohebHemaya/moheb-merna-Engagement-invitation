import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GoldFrame from './GoldFrame';
import { submitGuestMessage } from '../lib/messagesService';
import { audio } from '../lib/audio';
import { useReducedMotion } from '../hooks/useReducedMotion';

const arabicFormatter = new Intl.NumberFormat('ar-EG', { useGrouping: false });

export default function MessageForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot field
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const prefersReducedMotion = useReducedMotion();

  const maxName = 60;
  const maxMessage = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === 'sending') return;

    // Validation
    const trimmedName = name.trim();
    const trimmedMsg = message.trim();

    if (!trimmedName) {
      setErrorMessage('يرجى إدخال اسمك الكريم');
      return;
    }
    if (trimmedName.length > maxName) {
      setErrorMessage(`الاسم لا يمكن أن يتجاوز ${arabicFormatter.format(maxName)} حرفاً`);
      return;
    }
    if (!trimmedMsg) {
      setErrorMessage('يرجى كتابة رسالة التهنئة');
      return;
    }
    if (trimmedMsg.length > maxMessage) {
      setErrorMessage(`الرسالة لا يمكن أن تتجاوز ${arabicFormatter.format(maxMessage)} حرفاً`);
      return;
    }

    setErrorMessage('');
    setStatus('sending');

    // Honeypot check: If bot filled the hidden field, silently pretend success
    if (honeypot) {
      setTimeout(() => {
        setStatus('success');
        audio.play('send');
      }, 600);
      return;
    }

    try {
      const res = await submitGuestMessage({
        name: trimmedName,
        message: trimmedMsg,
      });

      if (res && res.success) {
        audio.play('send');
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('تعذر إرسال الرسالة حالياً، يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      console.error('Error submitting message:', err);
      setStatus('error');
      setErrorMessage('تعذر إرسال الرسالة حالياً، يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <section
      className="message-form-section w-full py-12 px-2 sm:px-4 flex flex-col items-center"
      data-testid="message-form"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-dark font-amiri mb-2">
          اترك كلمة للعروسين
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="h-[1px] w-12 bg-gold"></span>
          <span className="diamond-shape"></span>
          <span className="h-[1px] w-12 bg-gold"></span>
        </div>
        <p className="text-brown-soft text-sm sm:text-base mt-2">
          رسالتكم ستصل إلى العروسين وستبقى ذكرى غالية تسعد قلوبهما
        </p>
      </div>

      <div className="w-full max-w-lg">
        <GoldFrame innerClassName="p-5 sm:p-7">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="thank-you"
                className="relative py-8 text-center overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Floating Gentle Petals */}
                {!prefersReducedMotion && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-gold/40 text-lg sm:text-xl select-none"
                        style={{
                          left: `${(i * 9) % 100}%`,
                          top: '-20px',
                        }}
                        animate={{
                          y: ['0px', '280px'],
                          x: [0, (i % 2 === 0 ? 25 : -25), 0],
                          rotate: [0, 180, 360],
                          opacity: [0, 0.8, 0],
                        }}
                        transition={{
                          duration: 3 + (i % 3),
                          repeat: Infinity,
                          delay: i * 0.25,
                          ease: 'easeInOut',
                        }}
                      >
                        🌸
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="w-12 h-12 mx-auto rounded-full bg-gold/15 border border-gold flex items-center justify-center mb-4">
                  <span className="text-gold text-2xl">❦</span>
                </div>

                <h3 className="text-2xl font-bold text-gold-dark font-amiri mb-2">
                  شكراً لكم من القلب!
                </h3>
                <p className="text-brown font-amiri text-base leading-relaxed">
                  تم استلام كلمتكم الطيبة وتهنئتكم الجميلة بكل حب وامتنان.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setName('');
                    setMessage('');
                    setHoneypot('');
                    setErrorMessage('');
                    setStatus('idle');
                  }}
                  className="mt-6 text-sm text-gold-dark hover:underline font-amiri inline-block cursor-pointer"
                >
                  إرسال رسالة أخرى
                </button>
              </motion.div>
            ) : (
              <form key="form" onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot field (hidden from legitimate users, styled to prevent autofill) */}
                <div style={{ position: 'absolute', opacity: 0, zIndex: -1, pointerEvents: 'none', height: 0, overflow: 'hidden' }} aria-hidden="true">
                  <input
                    type="text"
                    name="preferred_gift_honey"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Name Field */}
                <div>
                  <label
                    htmlFor="guest-name"
                    className="block text-sm font-semibold text-brown font-amiri mb-1.5"
                  >
                    اسمك الكريم <span className="text-gold">*</span>
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    maxLength={maxName}
                    placeholder="مثال: د. محمد علي"
                    disabled={status === 'sending'}
                    className="w-full bg-[#FAF5EC] border border-gold/70 rounded-[3px] px-3.5 py-2.5 text-brown font-amiri placeholder:text-brown/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-base"
                    required
                  />
                </div>

                {/* Message Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="guest-message"
                      className="block text-sm font-semibold text-brown font-amiri"
                    >
                      رسالة التهنئة <span className="text-gold">*</span>
                    </label>
                    <span
                      className={`text-xs font-amiri transition-colors ${
                        message.length >= maxMessage - 20
                          ? 'text-amber-700 font-bold'
                          : 'text-brown-soft'
                      }`}
                    >
                      {arabicFormatter.format(message.length)} / {arabicFormatter.format(maxMessage)}
                    </span>
                  </div>
                  <textarea
                    id="guest-message"
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    maxLength={maxMessage}
                    placeholder="أطيب التهاني وأجمل الأمنيات بمناسبة الخطوبة السعيدة..."
                    disabled={status === 'sending'}
                    className="w-full bg-[#FAF5EC] border border-gold/70 rounded-[3px] px-3.5 py-2.5 text-brown font-amiri placeholder:text-brown/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-base resize-none"
                    required
                  />
                </div>

                {/* Error message display */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 bg-red-50 border border-red-300 rounded text-red-700 text-xs sm:text-sm font-amiri text-center"
                  >
                    {errorMessage}
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-3 bg-gold text-cream font-medium rounded-[3px] hover:bg-gold-dark transition-colors shadow-sm text-base font-amiri flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {status === 'sending' ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin"></span>
                        <span>جاري الإرسال...</span>
                      </span>
                    ) : (
                      'إرسال التهنئة'
                    )}
                  </button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </GoldFrame>
      </div>
    </section>
  );
}
