/**
 * Runtime style injector – inserts the module's CSS into <head> exactly once.
 * This keeps the package fully self-contained (no external CSS import needed).
 */

const STYLE_ID = 'modular-auth-ui-styles';
let injected = false;

export function injectStyles(): void {
  if (injected || typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) { injected = true; return; }

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
  injected = true;
}

/* ———————————————————————————————————————————————————————
   All module styles live here as a single template string.
   CSS custom-properties (--ma-*) allow per-project theming.
   ——————————————————————————————————————————————————————— */

const CSS = /* css */ `
/* ============ Shell Layout ============ */
.ma-shell {
  display: flex;
  min-height: 100vh;
  background: var(--ma-bg, #0d1117);
  color: var(--ma-text, #c9d1d9);
  font-family: var(--ma-font,
    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  overflow: hidden;
}

/* ============ Lamp Panel (left) ============ */
.ma-lamp-panel {
  flex: 0 0 42%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.ma-lamp-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  user-select: none;
  -webkit-user-select: none;
}

.ma-lamp-svg {
  filter: drop-shadow(0 4px 24px rgba(0,0,0,0.35));
  overflow: visible;
}

.ma-pull-label {
  font-size: 0.8rem;
  color: #4a5060;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  animation: ma-pulse 2.2s ease-in-out infinite;
}

/* ============ Form Panel (right) ============ */
.ma-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.ma-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(.4,0,.2,1),
              transform 0.7s cubic-bezier(.4,0,.2,1);
  pointer-events: none;
}
.ma-reveal--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.ma-form-box {
  width: 100%;
  max-width: 370px;
}

/* ============ Typography ============ */
.ma-heading {
  font-size: 1.85rem;
  font-weight: 600;
  color: var(--ma-heading, #e6edf3);
  margin-bottom: 0.45rem;
  letter-spacing: -0.02em;
}

.ma-heading-sub {
  font-size: 0.88rem;
  color: #4a5568;
  margin-bottom: 2.2rem;
  font-weight: 400;
}

/* ============ Form Controls ============ */
.ma-field {
  margin-bottom: 1.35rem;
  position: relative;
}

.ma-label {
  display: block;
  font-size: 0.8rem;
  color: #8b95a5;
  margin-bottom: 0.45rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.ma-input {
  width: 100%;
  padding: 0.82rem 1rem;
  background: var(--ma-input-bg, rgba(255,255,255,0.04));
  border: 1.5px solid var(--ma-input-border, rgba(255,255,255,0.07));
  border-radius: 10px;
  color: var(--ma-text, #c9d1d9);
  font-size: 0.94rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
  -webkit-appearance: none;
}
.ma-input:hover {
  border-color: rgba(255,255,255,0.13);
  background: rgba(255,255,255,0.055);
}
.ma-input:focus {
  border-color: rgba(88,166,255,0.45);
  background: rgba(255,255,255,0.06);
  box-shadow: 0 0 0 3px rgba(88,166,255,0.08), 0 0 20px rgba(88,166,255,0.04);
}
.ma-input::placeholder {
  color: #3d4a5c;
  font-weight: 400;
}

.ma-btn {
  width: 100%;
  padding: 0.85rem 1.2rem;
  margin-top: 1.2rem;
  background: var(--ma-accent, linear-gradient(135deg, #1a5c3a 0%, #1a3a2a 100%));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: #e2efe8;
  font-size: 0.94rem;
  font-weight: 550;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
  position: relative;
  overflow: hidden;
}
.ma-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.ma-btn:hover {
  background: var(--ma-accent-hover, linear-gradient(135deg, #22734a 0%, #1f4a33 100%));
  border-color: rgba(255,255,255,0.14);
  box-shadow: 0 4px 20px rgba(26,92,58,0.25), 0 0 40px rgba(26,92,58,0.08);
  transform: translateY(-1px);
}
.ma-btn:hover::before {
  opacity: 1;
}
.ma-btn:active {
  transform: translateY(0) scale(0.985);
  box-shadow: 0 2px 8px rgba(26,92,58,0.2);
}
.ma-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.ma-toggle {
  margin-top: 1.8rem;
  text-align: center;
  font-size: 0.85rem;
  color: #5a6373;
}

.ma-link {
  background: none;
  border: none;
  color: var(--ma-link, #58a6ff);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  font-family: inherit;
  padding: 0;
  transition: color 0.2s ease;
}
.ma-link:hover {
  color: #79b8ff;
  text-decoration: none;
}

.ma-error {
  color: #f0736e;
  font-size: 0.78rem;
  margin-top: 0.35rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.ma-error::before {
  content: '!';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(240,115,110,0.15);
  font-size: 0.65rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* ============ Divider ============ */
.ma-divider {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 1.4rem 0;
  color: #3d4450;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.ma-divider::before,
.ma-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.06);
}

/* ============ Animations ============ */
@keyframes ma-pulse {
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 0.85; }
}

@keyframes ma-bob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(5px); }
}

.ma-hint-arrow {
  animation: ma-bob 1.6s ease-in-out infinite;
}

/* ============ Responsive ============ */
@media (max-width: 768px) {
  .ma-shell { flex-direction: column; }
  .ma-lamp-panel {
    flex: 0 0 auto;
    padding: 2.5rem 1rem 1rem;
  }
  .ma-form-panel { padding: 1rem 1.2rem 2rem; }
  .ma-lamp-svg  { max-width: 200px !important; }
}

/* ============ Accessibility ============ */
@media (prefers-reduced-motion: reduce) {
  .ma-reveal { transition-duration: 0.01ms !important; }
  .ma-pull-label,
  .ma-hint-arrow { animation: none !important; }
}
`;
