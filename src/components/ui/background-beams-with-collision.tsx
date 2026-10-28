"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type RefObject } from "react";

type BeamOptions = {
  initialX: number;
  duration: number;
  delay?: number;
  repeatDelay?: number;
  className?: string;
};

const beams: BeamOptions[] = [
  { initialX: 10, duration: 7, repeatDelay: 3, delay: 2 },
  { initialX: 600, duration: 3, repeatDelay: 3, delay: 4 },
  { initialX: 100, duration: 7, repeatDelay: 7, className: "h-6" },
  { initialX: 400, duration: 5, repeatDelay: 14, delay: 4 },
  { initialX: 800, duration: 11, repeatDelay: 2, className: "h-20" },
  { initialX: 1000, duration: 4, repeatDelay: 2, className: "h-12" },
  { initialX: 1200, duration: 6, repeatDelay: 4, delay: 2, className: "h-6" },
];

const START_Y = -200;
const END_Y = 1800;
const RESET_AFTER_MS = 2000;
const EXPLOSION_LIFETIME_MS = 3500;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(reducedMotionQuery);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** Beams are skipped on the server and for users who prefer reduced motion. */
function useBeamsEnabled() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => !window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
}

export function BackgroundBeamsWithCollision({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const enabled = useBeamsEnabled();

  return (
    <div ref={parentRef} className={`relative w-full overflow-hidden ${className}`}>
      {enabled &&
        beams.map((beam) => (
          <CollisionBeam key={beam.initialX} beam={beam} parentRef={parentRef} floorRef={floorRef} />
        ))}

      {children}

      {/* Surface the beams collide with */}
      <div ref={floorRef} className="pointer-events-none absolute inset-x-0 bottom-0" aria-hidden />
    </div>
  );
}

type Spark = { id: number; dx: number; dy: number; duration: number };
type Explosion = { id: number; x: number; y: number; sparks: Spark[] };

function CollisionBeam({
  beam,
  parentRef,
  floorRef,
}: {
  beam: BeamOptions;
  parentRef: RefObject<HTMLDivElement | null>;
  floorRef: RefObject<HTMLDivElement | null>;
}) {
  const beamRef = useRef<HTMLDivElement>(null);
  const [explosions, setExplosions] = useState<Explosion[]>([]);

  useEffect(() => {
    const el = beamRef.current;
    if (!el) return;

    const { duration, delay = 0, repeatDelay = 0 } = beam;
    const cycle = (duration + repeatDelay) * 1000;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let animation: Animation | null = null;
    let collided = false;

    // Fall for `duration`, then wait `repeatDelay` before looping
    const start = () => {
      animation?.cancel();
      animation = el.animate(
        [
          { transform: `translate(${beam.initialX}px, ${START_Y}px)` },
          { transform: `translate(${beam.initialX}px, ${END_Y}px)`, offset: (duration * 1000) / cycle },
          { transform: `translate(${beam.initialX}px, ${END_Y}px)` },
        ],
        { duration: cycle, delay: delay * 1000, iterations: Infinity, easing: "linear" },
      );
    };

    const checkCollision = () => {
      const parent = parentRef.current;
      const floor = floorRef.current;
      if (collided || !parent || !floor) return;

      const beamRect = el.getBoundingClientRect();
      const floorRect = floor.getBoundingClientRect();
      if (beamRect.bottom < floorRect.top) return;

      collided = true;
      const parentRect = parent.getBoundingClientRect();
      const id = Date.now();

      setExplosions((prev) => [
        ...prev,
        {
          id,
          x: beamRect.left - parentRect.left + beamRect.width / 2,
          y: beamRect.bottom - parentRect.top,
          sparks: Array.from({ length: 20 }, (_, i) => ({
            id: i,
            dx: Math.floor(Math.random() * 80 - 40),
            dy: Math.floor(Math.random() * -50 - 10),
            duration: Math.random() * 1.5 + 0.5,
          })),
        },
      ]);

      timeouts.push(
        setTimeout(() => {
          collided = false;
          start();
        }, RESET_AFTER_MS),
        setTimeout(() => setExplosions((prev) => prev.filter((e) => e.id !== id)), EXPLOSION_LIFETIME_MS),
      );
    };

    start();
    const interval = setInterval(checkCollision, 50);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
      animation?.cancel();
    };
  }, [beam, parentRef, floorRef]);

  return (
    <>
      <div
        ref={beamRef}
        className={`absolute top-20 left-0 h-14 w-px bg-linear-to-t from-lime-600 via-lime-600/50 to-transparent ${beam.className ?? ""}`}
        style={{ transform: `translate(${beam.initialX}px, ${START_Y}px)` }}
        aria-hidden
      />
      {explosions.map((e) => (
        <div
          key={e.id}
          className="pointer-events-none absolute z-50 size-2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: e.x, top: e.y }}
          aria-hidden
        >
          <div className="absolute -inset-x-10 top-0 m-auto h-2 w-10 animate-beam-glow bg-linear-to-r from-transparent via-lime-600 to-transparent opacity-0 blur-sm" />
          {e.sparks.map((s) => (
            <span
              key={s.id}
              className="absolute size-1 animate-beam-spark rounded-xs bg-linear-to-b from-lime-600 to-lime-700"
              style={{ "--dx": `${s.dx}px`, "--dy": `${s.dy}px`, animationDuration: `${s.duration}s` } as CSSProperties}
            />
          ))}
        </div>
      ))}
    </>
  );
}
