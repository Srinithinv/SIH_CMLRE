'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const creatures = [
  { id: 1, type: 'fish', size: 120, top: '15%', delay: 0, duration: 45, direction: 'right' },
  { id: 2, type: 'jellyfish', size: 80, top: '40%', left: '10%', delay: 5, duration: 25 },
  { id: 3, type: 'fish', size: 90, top: '65%', delay: 15, duration: 35, direction: 'left' },
  { id: 4, type: 'jellyfish', size: 60, top: '75%', left: '80%', delay: 2, duration: 30 },
];

export default function AquaticBackground() {
  const [mounted, setMounted] = useState(false);
  const [randomData, setRandomData] = useState<{
    snow: { left: number; duration: number; delay: number; xTargets: number[] }[];
    bubbles: { left: number; size: number; delay: number; duration: number }[];
  }>({ snow: [], bubbles: [] });

  useEffect(() => {
    // Generate random data once on mount
    const snow = [...Array(15)].map(() => ({
      left: Math.random() * 100,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 10,
      xTargets: [Math.random() * 100, Math.random() * 100 + 5, Math.random() * 100 - 5]
    }));

    const bubbles = [...Array(8)].map((_, i) => ({
      left: (i + 1) * 12, // More stable distribution
      size: Math.random() * 15 + 5,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 10
    }));

    setRandomData({ snow, bubbles });
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-[#fdfdfd] z-0" />;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Marine Snow / Particles */}
      {randomData.snow.map((s, i) => (
        <motion.div
          key={`snow-${i}`}
          className="absolute w-1.5 h-1.5 bg-blue-200/30 rounded-full blur-[1px]"
          initial={{ y: '110vh', x: `${s.left}vw` }}
          animate={{ 
            y: '-10vh',
            x: s.xTargets.map(v => `${v}vw`)
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "linear",
            delay: s.delay
          }}
        />
      ))}

      {/* Bubbles */}
      {randomData.bubbles.map((b, i) => (
        <div 
          key={`bubble-${i}`}
          className="bubble"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`
          }}
        />
      ))}

      {/* Creatures */}
      {creatures.map((c) => (
        <motion.div
          key={c.id}
          className="absolute"
          style={{ top: c.top, left: c.left || '-200px', opacity: 0.12 }}
          animate={c.type === 'fish' ? {
            x: c.direction === 'right' ? ['-200px', '110vw'] : ['110vw', '-200px'],
            y: [0, 20, -20, 0]
          } : {
            y: [0, -40, 0],
            x: [0, 10, -10, 0]
          }}
          transition={{
            x: { duration: c.duration, repeat: Infinity, ease: "linear", delay: c.delay },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {c.type === 'fish' ? (
            <svg width={c.size} height={c.size/2} viewBox="0 0 200 100" className={c.direction === 'left' ? 'scale-x-[-1]' : ''}>
               <path d="M20,50 Q60,20 100,50 T180,50 Q140,80 100,50 T20,50 Z" fill="url(#fishGrad)" />
               <path d="M180,50 L200,30 L200,70 Z" fill="url(#fishGrad)" />
               <defs>
                 <linearGradient id="fishGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                   <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
                 </linearGradient>
               </defs>
            </svg>
          ) : (
            <svg width={c.size} height={c.size*1.2} viewBox="0 0 100 120">
               <path d="M20,50 Q50,10 80,50 L80,80 Q50,60 20,80 Z" fill="url(#jellyGrad)" />
               <path d="M30,80 L30,110 M50,75 L50,115 M70,80 L70,110" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
               <defs>
                 <linearGradient id="jellyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 0.8 }} />
                   <stop offset="100%" style={{ stopColor: '#93c5fd', stopOpacity: 0.5 }} />
                 </linearGradient>
               </defs>
            </svg>
          )}
        </motion.div>
      ))}

      {/* Seaweed at bottom */}
      <div className="absolute bottom-0 w-full flex justify-around opacity-15 px-20">
         {[...Array(5)].map((_, i) => (
           <motion.div
             key={`plant-${i}`}
             animate={{ rotate: [0, 5, -5, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i }}
             style={{ transformOrigin: 'bottom center' }}
           >
              <svg width="60" height="150" viewBox="0 0 60 150">
                <path d="M30,150 Q20,100 30,50 T30,0" fill="none" stroke="#2dd4bf" strokeWidth="8" strokeLinecap="round" />
              </svg>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
