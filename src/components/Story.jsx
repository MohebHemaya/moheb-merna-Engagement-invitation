import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { config } from '../config';
import { useReducedMotion } from '../hooks/useReducedMotion';
import GoldFrame from './GoldFrame';

gsap.registerPlugin(ScrollTrigger);

const defaultStoryItems = [
  {
    year: 'البداية',
    title: 'بدأت من زمان',
    text: 'من أيام الطفولة والذكريات البريئة، بدأت أولى خطوات حكايتنا معاً.',
    image: '/assets/couple-child.webp',
  },
  {
    year: 'اللقاء',
    title: 'أول نبضة',
    text: 'عندما تلاقت الأعين وتحدثت القلوب بدون كلمات، علمنا أننا وجدنا نصفنا الآخر.',
    image: '/assets/couple-child.webp',
  },
  {
    year: 'اليوم',
    title: 'عهد ووفاء',
    text: 'واليوم نتوّج هذه الحكاية بخطوبتنا، وندعوكم لتشاركونا فرحة هذا العهد الجميل.',
    image: '/assets/couple-child.webp',
  },
];

export default function Story() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Ensure at least 3 items exist as specified
  const storyItems = React.useMemo(() => {
    const list = [...(config.story || [])];
    if (list.length < 3) {
      defaultStoryItems.slice(list.length).forEach((item) => list.push(item));
    }
    return list;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Scrub animation for timeline line
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 70%',
              end: 'bottom 85%',
              scrub: 0.5,
            },
          }
        );
      }

      // Animate each milestone
      const items = gsap.utils.toArray('.story-milestone');
      items.forEach((item) => {
        const photo = item.querySelector('.milestone-photo');
        const text = item.querySelector('.milestone-text');
        const dot = item.querySelector('.milestone-dot');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        if (dot) {
          tl.fromTo(
            dot,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
          );
        }

        if (photo) {
          tl.fromTo(
            photo,
            { opacity: 0, filter: 'grayscale(100%)' },
            {
              opacity: 1,
              filter: 'sepia(50%) contrast(1.03)',
              duration: 1.0,
              ease: 'power2.out',
            },
            '-=0.2'
          );
        }

        if (text) {
          tl.fromTo(
            text,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.7'
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, storyItems]);

  return (
    <section
      ref={containerRef}
      className="story-section w-full py-12 px-2 sm:px-4 flex flex-col items-center"
      data-testid="story"
    >
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-dark font-amiri mb-2">
          قصتكم
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="h-[1px] w-12 bg-gold"></span>
          <span className="diamond-shape"></span>
          <span className="h-[1px] w-12 bg-gold"></span>
        </div>
      </div>

      {/* Timeline Wrapper */}
      <div className="relative w-full max-w-lg mx-auto ps-6 sm:ps-8 md:ps-0">
        {/* Timeline Line */}
        <div
          ref={lineRef}
          className="absolute top-0 bottom-0 start-2.5 sm:start-3 w-[2px] bg-gradient-to-b from-gold via-gold-dark to-gold origin-top"
          style={{ transformOrigin: 'top center' }}
        />

        {/* Milestones */}
        <div className="space-y-10 sm:space-y-12">
          {storyItems.map((item, index) => (
            <div
              key={index}
              className="story-milestone relative flex items-start gap-4 sm:gap-6"
            >
              {/* Timeline Dot */}
              <div className="milestone-dot absolute -start-[17px] sm:-start-[19px] top-4 w-4 h-4 rounded-full bg-cream border-2 border-gold shadow-sm flex items-center justify-center z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              </div>

              {/* Milestone Content inside Card */}
              <div className="w-full">
                <GoldFrame innerClassName="p-3 sm:p-5">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    {item.image && (
                      <div className="milestone-photo w-24 h-28 sm:w-28 sm:h-32 flex-shrink-0 border border-gold p-1 bg-cream shadow-sm rounded-sm overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title || 'صورة الذكرى'}
                          width={112}
                          height={128}
                          loading="lazy"
                          className="w-full h-full object-cover rounded-sm"
                          style={{ filter: 'sepia(0.5) contrast(1.03)' }}
                        />
                      </div>
                    )}
                    <div className="milestone-text text-start flex-1">
                      {item.year && (
                        <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-gold/20 text-gold-dark rounded mb-1">
                          {item.year}
                        </span>
                      )}
                      <h3 className="text-lg sm:text-xl font-bold text-brown font-amiri mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-brown-soft leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </GoldFrame>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
