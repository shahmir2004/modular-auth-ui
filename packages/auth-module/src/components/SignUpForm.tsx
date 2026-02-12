'use client';

import React, { useState, type FormEvent } from 'react';
import type { SignUpData } from '../types/auth';

interface Props {
  onSubmit?: (data: SignUpData) => void | Promise<void>;
  onToggle?: () => void;
}

export function SignUpForm({ onSubmit, onToggle }: Props) {
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [loading, setLoading]     = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email format';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Minimum 8 characters';
    if (password !== confirm) e.confirm = 'Passwords don\u2019t match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handle = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit?.({ name, email, password, confirmPassword: confirm });
    } catch { /* consumer handles */ }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handle} noValidate>
      <h2 className="ma-heading">Create Account</h2>
      <p className="ma-heading-sub">Start your journey with us today</p>

      <div className="ma-field">
        <label className="ma-label" htmlFor="ma-su-name">Name</label>
        <input
          id="ma-su-name"
          className="ma-input"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        {errors.name && <p className="ma-error">{errors.name}</p>}
      </div>

      <div className="ma-field">
        <label className="ma-label" htmlFor="ma-su-email">Email</label>
        <input
          id="ma-su-email"
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
        <label className="ma-label" htmlFor="ma-su-pass">Password</label>
        <input
          id="ma-su-pass"
          className="ma-input"
          type="password"
          placeholder="Min 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        {errors.password && <p className="ma-error">{errors.password}</p>}
      </div>

      <div className="ma-field">
        <label className="ma-label" htmlFor="ma-su-confirm">Confirm Password</label>
        <input
          id="ma-su-confirm"
          className="ma-input"
          type="password"
          placeholder="Repeat password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
        />
        {errors.confirm && <p className="ma-error">{errors.confirm}</p>}
      </div>

      <button className="ma-btn" type="submit" disabled={loading}>
        {loading ? 'Creating account\u2026' : 'Create Account'}
      </button>

      <p className="ma-toggle">
        Already have an account?{' '}
        <button type="button" className="ma-link" onClick={onToggle}>
          Sign In
        </button>
      </p>
    </form>
  );
}
