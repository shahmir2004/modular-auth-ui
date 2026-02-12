'use client';

import React, { useState, type FormEvent } from 'react';
import type { SignInData } from '../types/auth';

interface Props {
  onSubmit?: (data: SignInData) => void | Promise<void>;
  onToggle?: () => void;
}

export function SignInForm({ onSubmit, onToggle }: Props) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email format';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handle = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try { await onSubmit?.({ email, password }); }
    catch { /* consumer handles */ }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handle} noValidate>
      <h2 className="ma-heading">Welcome Back</h2>
      <p className="ma-heading-sub">Sign in to your account to continue</p>

      <div className="ma-field">
        <label className="ma-label" htmlFor="ma-si-email">Email</label>
        <input
          id="ma-si-email"
          className="ma-input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        {errors.email && <p className="ma-error">{errors.email}</p>}
      </div>

      <div className="ma-field">
        <label className="ma-label" htmlFor="ma-si-pass">Password</label>
        <input
          id="ma-si-pass"
          className="ma-input"
          type="password"
          placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {errors.password && <p className="ma-error">{errors.password}</p>}
      </div>

      <button className="ma-btn" type="submit" disabled={loading}>
        {loading ? 'Signing in\u2026' : 'Sign In'}
      </button>

      <p className="ma-toggle">
        Don't have an account?{' '}
        <button type="button" className="ma-link" onClick={onToggle}>
          Sign Up
        </button>
      </p>
    </form>
  );
}
