/** Data emitted on sign-in form submission */
export interface SignInData {
  email: string;
  password: string;
}

/** Data emitted on sign-up form submission */
export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Theme tokens – every property is optional for partial overrides */
export interface AuthTheme {
  /** Shell background */
  bgColor: string;
  /** Lamp shade fill */
  lampShadeColor: string;
  /** Glow colour when lamp is "on" */
  lampGlowColor: string;
  /** Heading text colour */
  headingColor: string;
  /** Body / label text colour */
  textColor: string;
  /** Primary accent (button background) */
  accentColor: string;
  /** Accent hover state */
  accentHoverColor: string;
  /** Input field background */
  inputBg: string;
  /** Input field border colour */
  inputBorder: string;
  /** Font family stack */
  fontFamily: string;
}

/** Props accepted by the top-level <AuthShell /> component */
export interface AuthShellProps {
  /** Show sign-in or sign-up first (default: 'sign-in') */
  mode?: 'sign-in' | 'sign-up';
  /** Fired when the sign-in form is submitted */
  onSignIn?: (data: SignInData) => void | Promise<void>;
  /** Fired when the sign-up form is submitted */
  onSignUp?: (data: SignUpData) => void | Promise<void>;
  /** Partial theme overrides (CSS custom-property values) */
  theme?: Partial<AuthTheme>;
  /** Additional class name on the root element */
  className?: string;
  /** Require the lamp-string pull before showing forms (default: true) */
  requireHumanCheck?: boolean;
}

/** Props for the standalone lamp gate */
export interface LampHumanGateProps {
  onUnlocked: () => void;
  isUnlocked: boolean;
  theme?: Partial<AuthTheme>;
}
