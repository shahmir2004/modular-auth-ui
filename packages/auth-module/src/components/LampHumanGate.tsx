'use client';

import React, { useCallback, useEffect, useRef, memo } from 'react';
import type { LampHumanGateProps } from '../types/auth';

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */
const ANCHOR_X      = 180;
const ANCHOR_Y      = 174;
const REST_BEAD_X   = 183;
const REST_BEAD_Y   = 258;
const STRING_LENGTH = 90;
const SEGMENTS      = 10;
const SEG_LEN       = STRING_LENGTH / SEGMENTS;
const GRAVITY       = 0.3;
const ROPE_DAMPING  = 0.98;
const CONSTRAINT_ITERS = 5;
const THRESHOLD_Y   = 80;
const BEAD_MASS     = 1.6;

/* ═══════════════════════════════════════════
   Verlet rope simulation
   ═══════════════════════════════════════════ */
interface RopePoint {
  x: number; y: number;
  px: number; py: number;
}

function createRope(): RopePoint[] {
  const pts: RopePoint[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const x = ANCHOR_X + (REST_BEAD_X - ANCHOR_X) * t;
    const y = ANCHOR_Y + (REST_BEAD_Y - ANCHOR_Y) * t;
    pts.push({ x, y, px: x, py: y });
  }
  return pts;
}

function stepRope(
  pts: RopePoint[],
  beadPinned: boolean,
  beadX?: number,
  beadY?: number,
) {
  for (let i = 1; i < pts.length; i++) {
    if (beadPinned && i === pts.length - 1) continue;
    const p  = pts[i];
    const vx = (p.x - p.px) * ROPE_DAMPING;
    const vy = (p.y - p.py) * ROPE_DAMPING;
    p.px = p.x;
    p.py = p.y;
    const g = i === pts.length - 1 ? GRAVITY * BEAD_MASS : GRAVITY;
    p.x += vx;
    p.y += vy + g;
  }

  pts[0].x = ANCHOR_X;  pts[0].y = ANCHOR_Y;
  pts[0].px = ANCHOR_X; pts[0].py = ANCHOR_Y;

  if (beadPinned && beadX != null && beadY != null) {
    const last = pts[pts.length - 1];
    last.x = beadX;  last.y = beadY;
    last.px = beadX; last.py = beadY;
  }

  for (let iter = 0; iter < CONSTRAINT_ITERS; iter++) {
    pts[0].x = ANCHOR_X; pts[0].y = ANCHOR_Y;

    for (let i = 0; i < pts.length - 1; i++) {
      const a  = pts[i];
      const b  = pts[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const diff = (SEG_LEN - dist) / dist * 0.5;
      const ox = dx * diff;
      const oy = dy * diff;

      const aFixed = (i === 0);
      const bFixed = (beadPinned && i + 1 === pts.length - 1);

      if (!aFixed) { a.x -= ox; a.y -= oy; }
      if (!bFixed) { b.x += ox; b.y += oy; }
    }
  }
}

/* ═══════════════════════════════════════════
   Catmull-Rom → Cubic Bezier smooth path
   ═══════════════════════════════════════════ */
function ropeToPath(pts: RopePoint[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/* ═══════════════════════════════════════════
   Screen → SVG coordinate conversion
   ═══════════════════════════════════════════ */
function toSVG(svg: SVGSVGElement, sx: number, sy: number) {
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: sx, y: sy };
  const pt = new DOMPoint(sx, sy);
  const s  = pt.matrixTransform(ctm.inverse());
  return { x: s.x, y: s.y };
}

/* ═══════════════════════════════════════════
   Memoised static lamp body with
   multi-layer realistic lighting
   ═══════════════════════════════════════════ */
const LampBody = memo(function LampBody({ glowing }: { glowing: boolean }) {
  return (
    <g>
      <defs>
        {/* Lamp material gradients */}
        <linearGradient id="ma-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3f4a" />
          <stop offset="100%" stopColor="#252830" />
        </linearGradient>
        <linearGradient id="ma-pole" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#35383f" />
          <stop offset="50%" stopColor="#4a4d55" />
          <stop offset="100%" stopColor="#35383f" />
        </linearGradient>
        <linearGradient id="ma-base-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3d44" />
          <stop offset="100%" stopColor="#2a2d34" />
        </linearGradient>

        {/* Lighting gradients */}
        <radialGradient id="ma-ambient" cx="50%" cy="38%" r="68%">
          <stop offset="0%"   stopColor="#f5d089" stopOpacity="0.30" />
          <stop offset="35%"  stopColor="#f5c060" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#f5c060" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ma-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffeaaa" stopOpacity="0.26" />
          <stop offset="45%"  stopColor="#ffd97d" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#ffd97d" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ma-bulb" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fff4d6" stopOpacity="0.85" />
          <stop offset="45%"  stopColor="#ffd97d" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffd97d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ma-inner" cx="50%" cy="0%" r="100%">
          <stop offset="0%"   stopColor="#ffeaa0" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#ffeaa0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ma-pole-lit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f5d089" stopOpacity="0.18" />
          <stop offset="35%"  stopColor="#f5d089" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#f5d089" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ma-ground" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#f5d089" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#f5d089" stopOpacity="0" />
        </radialGradient>

        {/* Blur filters for realistic light dispersion */}
        <filter id="ma-blur-lg" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="ma-blur-md" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="ma-blur-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* ═══ LIGHTING LAYERS (behind lamp body) ═══ */}
      <g opacity={glowing ? 1 : 0} style={{ transition: 'opacity 1.2s ease' }}>
        {/* L1 – Wide ambient glow */}
        <ellipse cx="150" cy="240" rx="200" ry="220"
          fill="url(#ma-ambient)" filter="url(#ma-blur-lg)" />

        {/* L2 – Downward light cone */}
        <path d="M 95 178 L 58 440 L 242 440 L 205 178 Z"
          fill="url(#ma-cone)" />

        {/* L3 – Under-shade inner glow */}
        <ellipse cx="150" cy="178" rx="52" ry="22"
          fill="url(#ma-inner)" filter="url(#ma-blur-sm)" />

        {/* L4 – Bright bulb hotspot */}
        <ellipse cx="150" cy="170" rx="18" ry="10"
          fill="url(#ma-bulb)" filter="url(#ma-blur-sm)" />

        {/* L5 – Pole illumination strip */}
        <rect x="146" y="178" width="8" height="120" rx="4"
          fill="url(#ma-pole-lit)" />

        {/* L6 – Ground reflection */}
        <ellipse cx="150" cy="362" rx="80" ry="12"
          fill="url(#ma-ground)" filter="url(#ma-blur-md)" />
      </g>

      {/* ═══ LAMP BODY ═══ */}
      <path d="M 112 88 L 188 88 L 210 174 L 90 174 Z" fill="url(#ma-shade)" />
      <ellipse cx="150" cy="88"  rx="38" ry="5.5" fill="#454a55" />
      <ellipse cx="150" cy="174" rx="60" ry="7"   fill="#1e2128" />

      {/* Face */}
      {glowing ? (
        <>
          <circle cx="134" cy="128" r="3.5" fill="#8b9099" />
          <circle cx="166" cy="128" r="3.5" fill="#8b9099" />
          <circle cx="135.2" cy="127" r="1" fill="#c0c5cc" />
          <circle cx="167.2" cy="127" r="1" fill="#c0c5cc" />
        </>
      ) : (
        <>
          <path d="M 124 132 Q 134 118 144 132"
            stroke="#505662" fill="none" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 156 132 Q 166 118 176 132"
            stroke="#505662" fill="none" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Pole */}
      <rect x="143" y="174" width="14" height="175" rx="7" fill="url(#ma-pole)" />

      {/* Base */}
      <ellipse cx="150" cy="356" rx="50" ry="11" fill="#000" opacity="0.25" />
      <ellipse cx="150" cy="352" rx="46" ry="10" fill="url(#ma-base-g)" />
      <ellipse cx="150" cy="350" rx="42" ry="7"  fill="#32363e" />
    </g>
  );
});

/* ═══════════════════════════════════════════
   Main gate component
   ═══════════════════════════════════════════ */
export function LampHumanGate({ onUnlocked, isUnlocked }: LampHumanGateProps) {
  const svgRef        = useRef<SVGSVGElement>(null);
  const pathRef       = useRef<SVGPathElement>(null);
  const beadCircleRef = useRef<SVGCircleElement>(null);
  const progressRef   = useRef<SVGCircleElement>(null);

  const ropeRef = useRef<RopePoint[]>(createRope());
  const rafRef  = useRef(0);

  const drag = useRef({
    active: false,
    beadSVG: { x: REST_BEAD_X, y: REST_BEAD_Y },
  });

  const glowing = isUnlocked;

  const keyPullRef = useRef(false);

  /* ─── continuous physics + render loop ─── */
  useEffect(() => {
    let running = true;
    const CIRC = 2 * Math.PI * 13;

    const loop = () => {
      if (!running) return;

      const pts    = ropeRef.current;
      const d      = drag.current;
      const pathEl = pathRef.current;
      const beadEl = beadCircleRef.current;
      const progEl = progressRef.current;

      stepRope(
        pts,
        d.active || keyPullRef.current,
        d.active ? d.beadSVG.x : keyPullRef.current ? REST_BEAD_X : undefined,
        d.active ? d.beadSVG.y : keyPullRef.current ? REST_BEAD_Y + 95 : undefined,
      );

      if (pathEl) pathEl.setAttribute('d', ropeToPath(pts));

      const bead = pts[pts.length - 1];
      if (beadEl) {
        beadEl.setAttribute('cx', bead.x.toFixed(1));
        beadEl.setAttribute('cy', bead.y.toFixed(1));
      }

      if (progEl) {
        const dy       = bead.y - REST_BEAD_Y;
        const progress = Math.min(1, Math.max(0, dy / THRESHOLD_Y));

        if ((d.active || keyPullRef.current) && dy > 5) {
          progEl.setAttribute('cx', bead.x.toFixed(1));
          progEl.setAttribute('cy', bead.y.toFixed(1));
          progEl.setAttribute('stroke-dasharray', `${progress * CIRC} ${CIRC}`);
          progEl.setAttribute('transform',
            `rotate(-90 ${bead.x.toFixed(1)} ${bead.y.toFixed(1)})`);
          progEl.setAttribute('stroke', progress >= 1 ? '#5cb875' : '#6b7080');
          progEl.setAttribute('opacity', '0.55');
        } else {
          progEl.setAttribute('opacity', '0');
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  /* ─── pointer events ─── */
  useEffect(() => {
    const svg    = svgRef.current;
    const beadEl = beadCircleRef.current;
    if (!svg || !beadEl) return;

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      beadEl.setPointerCapture(e.pointerId);
      const bead = ropeRef.current[ropeRef.current.length - 1];
      drag.current.beadSVG = { x: bead.x, y: bead.y };
      drag.current.active = true;

      beadEl.setAttribute('r', '8');
      beadEl.setAttribute('fill', '#9ba1ae');
      pathRef.current?.setAttribute('stroke', '#aab0bb');
      pathRef.current?.setAttribute('stroke-width', '2.2');
    };

    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const svgPt = toSVG(svg, e.clientX, e.clientY);
      const dx = Math.max(-70, Math.min(70, (svgPt.x - REST_BEAD_X) * 0.7));
      const dy = Math.max(0, svgPt.y - REST_BEAD_Y + 10);
      drag.current.beadSVG = { x: REST_BEAD_X + dx, y: REST_BEAD_Y + dy };
    };

    const onUp = () => {
      if (!drag.current.active) return;
      drag.current.active = false;

      beadEl.setAttribute('r', '6');
      beadEl.setAttribute('fill', '#6b7080');
      pathRef.current?.setAttribute('stroke', '#6b7080');
      pathRef.current?.setAttribute('stroke-width', '1.6');

      const bead = ropeRef.current[ropeRef.current.length - 1];
      if (bead.y - REST_BEAD_Y >= THRESHOLD_Y) {
        onUnlocked();
      }
    };

    beadEl.addEventListener('pointerdown', onDown);
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);

    return () => {
      beadEl.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
  }, [onUnlocked]);

  /* ─── keyboard alternative ─── */
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (keyPullRef.current) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      keyPullRef.current = true;
      setTimeout(() => {
        keyPullRef.current = false;
        onUnlocked();
      }, 500);
    }
  }, [onUnlocked]);

  return (
    <div className="ma-lamp-wrap">
      <svg
        ref={svgRef}
        viewBox="0 0 300 440"
        className="ma-lamp-svg"
        style={{ width: '100%', maxWidth: 280, height: 'auto' }}
      >
        <LampBody glowing={glowing} />

        {/* Rope string (updated by physics loop via ref) */}
        <path
          ref={pathRef}
          d={ropeToPath(ropeRef.current)}
          stroke="#6b7080"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Progress ring (updated by physics loop via ref) */}
        <circle
          ref={progressRef}
          cx={REST_BEAD_X} cy={REST_BEAD_Y}
          r={13} fill="none" stroke="#6b7080"
          strokeWidth="1.6" opacity="0"
        />

        {/* Bead – drag target */}
        <circle
          ref={beadCircleRef}
          cx={REST_BEAD_X} cy={REST_BEAD_Y}
          r={6} fill="#6b7080"
          tabIndex={0}
          role="button"
          aria-label="Pull the lamp string to toggle"
          onKeyDown={handleKey}
          style={{
            cursor: 'grab',
            touchAction: 'none',
            outline: 'none',
          }}
        />

        {/* Hint arrow */}
        {!isUnlocked && (
          <g className="ma-hint-arrow" opacity="0.45">
            <line
              x1={REST_BEAD_X} y1={REST_BEAD_Y + 16}
              x2={REST_BEAD_X} y2={REST_BEAD_Y + 32}
              stroke="#6b7080" strokeWidth="1.4" strokeLinecap="round"
            />
            <polyline
              points={`${REST_BEAD_X - 4},${REST_BEAD_Y + 28} ${REST_BEAD_X},${REST_BEAD_Y + 34} ${REST_BEAD_X + 4},${REST_BEAD_Y + 28}`}
              stroke="#6b7080" strokeWidth="1.4" fill="none"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </g>
        )}
      </svg>

      {!isUnlocked && (
        <p className="ma-pull-label">Pull the string</p>
      )}
    </div>
  );
}
