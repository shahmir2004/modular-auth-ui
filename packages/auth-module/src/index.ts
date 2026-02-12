/* ── public surface ── */

export { AuthShell }        from './components/AuthShell';
export { LampHumanGate }    from './components/LampHumanGate';
export { AuthRevealPanel }  from './components/AuthRevealPanel';
export { SignInForm }       from './components/SignInForm';
export { SignUpForm }       from './components/SignUpForm';
export { usePullGesture }   from './hooks/usePullGesture';

export type {
  AuthShellProps,
  LampHumanGateProps,
  SignInData,
  SignUpData,
  AuthTheme,
} from './types/auth';
