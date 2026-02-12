'use client';

import React, { useState, useEffect } from 'react';
import { LampHumanGate } from './LampHumanGate';
import { AuthRevealPanel } from './AuthRevealPanel';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { injectStyles } from '../styles/inject-styles';
import type { AuthShellProps, AuthTheme } from '../types/auth';

/** Convert a partial theme into CSS custom-property inline styles */
function themeToVars(t?: Partial<AuthTheme>): React.CSSProperties | undefined {
  if (!t) return undefined;
  const vars: Record<string, string> = {};
  if (t.bgColor)          vars['--ma-bg']            = t.bgColor;
  if (t.headingColor)     vars['--ma-heading']       = t.headingColor;
  if (t.textColor)        vars['--ma-text']          = t.textColor;
  if (t.accentColor)      vars['--ma-accent']        = t.accentColor;
  if (t.accentHoverColor) vars['--ma-accent-hover']  = t.accentHoverColor;
  if (t.inputBg)          vars['--ma-input-bg']      = t.inputBg;
  if (t.inputBorder)      vars['--ma-input-border']  = t.inputBorder;
  if (t.fontFamily)       vars['--ma-font']          = t.fontFamily;
  return vars as React.CSSProperties;
}

/**
 * All-in-one auth shell: lamp-gate on the left, sign-in/sign-up on the right.
 *
 * ```tsx
 * <AuthShell
 *   mode="sign-in"
 *   onSignIn={(d) => api.login(d)}
 *   onSignUp={(d) => api.register(d)}
 * />
 * ```
 */
export function AuthShell({
  mode: initialMode = 'sign-in',
  onSignIn,
  onSignUp,
  theme,
  className = '',
  requireHumanCheck = true,
}: AuthShellProps) {
  const [unlocked, setUnlocked] = useState(!requireHumanCheck);
  const [mode, setMode] = useState(initialMode);

  /* inject CSS on first mount */
  useEffect(() => { injectStyles(); }, []);

  return (
    <div className={`ma-shell ${className}`} style={themeToVars(theme)}>
      {/* left: lamp human-gate */}
      <div className="ma-lamp-panel">
        <LampHumanGate
          onUnlocked={() => setUnlocked((prev) => !prev)}
          isUnlocked={unlocked}
        />
      </div>

      {/* right: auth form */}
      <div className="ma-form-panel">
        <AuthRevealPanel visible={unlocked}>
          {mode === 'sign-in' ? (
            <SignInForm
              onSubmit={onSignIn}
              onToggle={() => setMode('sign-up')}
            />
          ) : (
            <SignUpForm
              onSubmit={onSignUp}
              onToggle={() => setMode('sign-in')}
            />
          )}
        </AuthRevealPanel>
      </div>
    </div>
  );
}
