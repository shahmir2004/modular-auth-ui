'use client';

import React from 'react';

interface Props {
  /** Whether the panel content should be visible */
  visible: boolean;
  children: React.ReactNode;
}

/** Wrapper that fades + slides children in once `visible` becomes true. */
export function AuthRevealPanel({ visible, children }: Props) {
  return (
    <div className={`ma-reveal ${visible ? 'ma-reveal--visible' : ''}`}>
      <div className="ma-form-box">
        {children}
      </div>
    </div>
  );
}
