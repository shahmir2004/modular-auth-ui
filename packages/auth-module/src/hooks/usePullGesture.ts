'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* ——— tunables ——— */
const THRESHOLD  = 80;
const STIFFNESS  = 0.12;
const DAMPING    = 0.72;

/* ——— public API ——— */
export interface PullGestureConfig {
  /** Distance in px before the pull counts as complete (default 80) */
  threshold?: number;
  /** Fires once when the pull threshold is met */
  onPulled?: () => void;
  /** Disable interaction entirely */
  disabled?: boolean;
}

export interface PullGestureResult {
  x: number;
  y: number;
  dragging: boolean;
  done: boolean;
  elRef: React.MutableRefObject<Element | null>;
}

/* ——— hook ——— */
export function usePullGesture(config: PullGestureConfig = {}): PullGestureResult {
  const { threshold = THRESHOLD, onPulled, disabled = false } = config;

  const elRef = useRef<Element | null>(null);

  const [pos, setPos]         = useState({ x: 0, y: 0 });
  const [dragging, setDrag]   = useState(false);
  const [done, setDone]       = useState(false);

  const dragRef      = useRef(false);
  const doneRef      = useRef(false);
  const originRef    = useRef({ x: 0, y: 0 });
  const curRef       = useRef({ x: 0, y: 0 });
  const velRef       = useRef({ x: 0, y: 0 });
  const springRafRef = useRef(0);   // separate ref – survives effect cleanup
  const cbRef        = useRef(onPulled);

  useEffect(() => { cbRef.current = onPulled; }, [onPulled]);

  /* cancel spring RAF only on full unmount */
  useEffect(() => {
    return () => cancelAnimationFrame(springRafRef.current);
  }, []);

  const springBack = useCallback(() => {
    cancelAnimationFrame(springRafRef.current);

    const tick = () => {
      const { x, y } = curRef.current;
      velRef.current.x = (velRef.current.x + (-x) * STIFFNESS) * DAMPING;
      velRef.current.y = (velRef.current.y + (-y) * STIFFNESS) * DAMPING;
      curRef.current.x += velRef.current.x;
      curRef.current.y += velRef.current.y;

      const still =
        Math.abs(curRef.current.x) < 0.4 &&
        Math.abs(curRef.current.y) < 0.4 &&
        Math.abs(velRef.current.x) < 0.4 &&
        Math.abs(velRef.current.y) < 0.4;

      if (still) {
        curRef.current = { x: 0, y: 0 };
        setPos({ x: 0, y: 0 });
      } else {
        setPos({ x: curRef.current.x, y: curRef.current.y });
        springRafRef.current = requestAnimationFrame(tick);
      }
    };

    springRafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (disabled || doneRef.current) return;
    const el = elRef.current;
    if (!el) return;

    const onDown = (e: Event) => {
      const pe = e as PointerEvent;
      pe.preventDefault();
      (pe.target as Element)?.setPointerCapture?.(pe.pointerId);
      cancelAnimationFrame(springRafRef.current);
      originRef.current = { x: pe.clientX, y: pe.clientY };
      velRef.current = { x: 0, y: 0 };
      dragRef.current = true;
      setDrag(true);
    };

    const onMove = (e: Event) => {
      if (!dragRef.current) return;
      const pe = e as PointerEvent;
      const dx = (pe.clientX - originRef.current.x) * 0.35;
      const dy = Math.max(0, pe.clientY - originRef.current.y);
      curRef.current = { x: dx, y: dy };
      setPos({ x: dx, y: dy });
    };

    const onUp = () => {
      if (!dragRef.current) return;
      dragRef.current = false;
      setDrag(false);

      if (curRef.current.y >= threshold) {
        doneRef.current = true;
        setDone(true);
        cbRef.current?.();
      }

      springBack();
    };

    el.addEventListener('pointerdown', onDown);
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);

    return () => {
      el.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      /* Do NOT cancel springRafRef here — the spring must
         survive this cleanup when `disabled` flips after onPulled */
    };
  }, [disabled, threshold, springBack]);

  return { x: pos.x, y: pos.y, dragging, done, elRef };
}
