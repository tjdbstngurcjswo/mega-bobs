'use client';

import { useState } from 'react';

const EMOJIS = ['🍱', '🍜', '🥗', '🍛', '🍝', '🥘'];
const PARTICLE_COUNT = 28;

type Particle = {
  id: number;
  emoji: string;
  left: string;
  duration: string;
  delay: string;
  size: number;
};

const generateParticles = (): Particle[] =>
  Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    emoji: EMOJIS[i % EMOJIS.length],
    left: `${5 + (i * 90) / PARTICLE_COUNT + (i % 3) * 3}%`,
    duration: `${1.8 + (i % 5) * 0.15}s`,
    delay: `${(i % 7) * 0.06}s`,
    size: 14 + (i % 4) * 3,
  }));

const EasterEggOverlay = () => {
  const [particles] = useState<Particle[]>(generateParticles);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            top: '-30px',
            left: p.left,
            fontSize: `${p.size}px`,
            animation: `fallFade ${p.duration} ${p.delay} ease-in both`,
            lineHeight: 1,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};

export default EasterEggOverlay;
