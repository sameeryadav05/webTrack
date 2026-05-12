import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Full-viewport background for the landing page: soft chart-style grid,
 * cursor-linked spotlight (analytics “focus” metaphor), and slow ambient orbs.
 */
export function LandingBackdrop() {
  const rootRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const apply = (xPct, yPct) => {
      root.style.setProperty('--wt-mx', `${xPct}%`);
      root.style.setProperty('--wt-my', `${yPct}%`);
    };

    apply(50, 50);
    if (reduceMotion) return undefined;

    let raf = 0;
    const onMove = (e) => {
      const x = (e.clientX / Math.max(window.innerWidth, 1)) * 100;
      const y = (e.clientY / Math.max(window.innerHeight, 1)) * 100;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => apply(x, y));
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, [reduceMotion]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden [--wt-mx:50%] [--wt-my:50%]"
      aria-hidden
    >
      {/* Light chart grid — suggests dashboards / data */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.09]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />

      {/* Primary spotlight follows pointer */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(52vw circle at var(--wt-mx) var(--wt-my), hsl(var(--primary) / 0.11), transparent 52%)',
        }}
      />

      {/* Cool accent — subtle depth without looking playful */}
      <div
        className="absolute inset-0 opacity-90 dark:opacity-100"
        style={{
          background:
            'radial-gradient(28vw circle at var(--wt-mx) var(--wt-my), hsl(217 91% 60% / 0.08), transparent 48%)',
        }}
      />

      {/* Ambient drift — independent of cursor */}
      <motion.div
        className="absolute -left-[12%] -top-[18%] h-[42vmin] w-[42vmin] rounded-full bg-primary/12 blur-[100px]"
        animate={reduceMotion ? false : { x: [0, 28, 0], y: [0, 18, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-[16%] -right-[10%] h-[38vmin] w-[38vmin] rounded-full blur-[110px] bg-blue-500/10"
        animate={reduceMotion ? false : { x: [0, -22, 0], y: [0, -14, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-[35%] top-[55%] h-[30vmin] w-[30vmin] rounded-full blur-[90px] bg-violet-500/8"
        animate={reduceMotion ? false : { opacity: [0.35, 0.55, 0.35], scale: [1, 1.06, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
