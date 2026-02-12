# @modular-auth/ui

A beautiful, interactive authentication UI module for React. Features an animated **lamp pull-string gate** with verlet rope physics, realistic SVG lighting, and modern sign-in/sign-up forms — all in a single, self-contained package.

![React](https://img.shields.io/badge/React-%3E%3D18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Interactive Lamp Gate** — Pull a string bead to reveal auth forms (verlet rope physics simulation)
- **Toggle Behavior** — Pull the string again to hide the form
- **Realistic Lighting** — 6-layer SVG lighting with blur filters and gradients
- **Modern Forms** — Clean sign-in & sign-up forms with validation
- **Self-Contained Styles** — CSS injected at runtime, no external stylesheet needed
- **Fully Themeable** — CSS custom properties for complete visual control
- **Accessible** — Keyboard support (Space/Enter to pull), ARIA labels, reduced-motion support
- **Responsive** — Mobile-first layout that stacks on smaller screens
- **TypeScript** — Full type safety with exported interfaces
- **Tree-Shakeable** — Use the full shell or individual components

---

## 📦 Installation

```bash
npm install @modular-auth/ui
# or
yarn add @modular-auth/ui
# or
pnpm add @modular-auth/ui
```

**Peer dependencies:** `react >= 18` and `react-dom >= 18`

---

## 🚀 Quick Start

Drop in the `<AuthShell />` component — that's it. No CSS imports, no setup.

```tsx
'use client'; // Required for Next.js App Router

import { AuthShell } from '@modular-auth/ui';

export default function LoginPage() {
  return (
    <AuthShell
      mode="sign-in"
      onSignIn={(data) => {
        console.log('Sign in:', data.email, data.password);
        // Call your auth API here
      }}
      onSignUp={(data) => {
        console.log('Sign up:', data.name, data.email, data.password);
        // Call your registration API here
      }}
    />
  );
}
```

---

## 📖 API Reference

### `<AuthShell />`

The all-in-one component: lamp gate on the left, auth forms on the right.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'sign-in' \| 'sign-up'` | `'sign-in'` | Which form to show first |
| `onSignIn` | `(data: SignInData) => void \| Promise<void>` | — | Callback when sign-in form is submitted |
| `onSignUp` | `(data: SignUpData) => void \| Promise<void>` | — | Callback when sign-up form is submitted |
| `theme` | `Partial<AuthTheme>` | — | Theme overrides (see Theming section) |
| `className` | `string` | `''` | Additional CSS class on the root element |
| `requireHumanCheck` | `boolean` | `true` | Whether the lamp-string pull is required before showing forms |

### `<LampHumanGate />`

The standalone lamp pull-string component (use this if you want to build a custom layout).

| Prop | Type | Description |
|------|------|-------------|
| `onUnlocked` | `() => void` | Fires each time the string is pulled past the threshold |
| `isUnlocked` | `boolean` | Controls the lamp's on/off state |

### `<AuthRevealPanel />`

A fade + slide wrapper for content that appears once `visible` is `true`.

| Prop | Type | Description |
|------|------|-------------|
| `visible` | `boolean` | Whether children are shown |
| `children` | `ReactNode` | Content to reveal |

### `<SignInForm />`

| Prop | Type | Description |
|------|------|-------------|
| `onSubmit` | `(data: SignInData) => void \| Promise<void>` | Fires with `{ email, password }` |
| `onToggle` | `() => void` | Fires when user clicks "Sign Up" link |

### `<SignUpForm />`

| Prop | Type | Description |
|------|------|-------------|
| `onSubmit` | `(data: SignUpData) => void \| Promise<void>` | Fires with `{ name, email, password, confirmPassword }` |
| `onToggle` | `() => void` | Fires when user clicks "Sign In" link |

### `usePullGesture(config?)`

A standalone hook for creating custom pull-down interactions.

```tsx
import { usePullGesture } from '@modular-auth/ui';

const { x, y, dragging, done, elRef } = usePullGesture({
  threshold: 80,
  onPulled: () => console.log('Pulled!'),
  disabled: false,
});
```

---

## 🎨 Theming

Pass a `theme` prop to `<AuthShell />` with any of these overrides:

```tsx
<AuthShell
  theme={{
    bgColor: '#0a0e14',
    headingColor: '#ffffff',
    textColor: '#b0bec5',
    accentColor: '#6366f1',
    accentHoverColor: '#818cf8',
    inputBg: 'rgba(255,255,255,0.05)',
    inputBorder: 'rgba(255,255,255,0.1)',
    fontFamily: '"JetBrains Mono", monospace',
  }}
  onSignIn={handleSignIn}
  onSignUp={handleSignUp}
/>
```

| Token | CSS Variable | Default |
|-------|-------------|--------|
| `bgColor` | `--ma-bg` | `#0d1117` |
| `headingColor` | `--ma-heading` | `#e6edf3` |
| `textColor` | `--ma-text` | `#c9d1d9` |
| `accentColor` | `--ma-accent` | `#1a3a2a` |
| `accentHoverColor` | `--ma-accent-hover` | `#1f4a33` |
| `inputBg` | `--ma-input-bg` | `rgba(255,255,255,0.04)` |
| `inputBorder` | `--ma-input-border` | `rgba(255,255,255,0.07)` |
| `fontFamily` | `--ma-font` | `Inter, system-ui, sans-serif` |

---

## 🧩 Using Individual Components

You can import components individually to build a custom layout:

```tsx
import {
  LampHumanGate,
  AuthRevealPanel,
  SignInForm,
  SignUpForm,
} from '@modular-auth/ui';

function CustomAuthPage() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div style={{ display: 'flex' }}>
      <LampHumanGate
        onUnlocked={() => setUnlocked(prev => !prev)}
        isUnlocked={unlocked}
      />
      <AuthRevealPanel visible={unlocked}>
        <SignInForm onSubmit={(data) => login(data)} />
      </AuthRevealPanel>
    </div>
  );
}
```

---

## ⚙️ Framework Integration

### Next.js (App Router)

1. Install the package
2. Add `transpilePackages` to `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@modular-auth/ui'],
};

export default nextConfig;
```

3. Use `'use client'` directive in the page component:

```tsx
'use client';
import { AuthShell } from '@modular-auth/ui';

export default function Page() {
  return <AuthShell onSignIn={handleLogin} onSignUp={handleRegister} />;
}
```

### Next.js (Pages Router)

Works directly — just import and use in any page component.

### Vite / Create React App

No extra configuration needed — just import and use.

```tsx
import { AuthShell } from '@modular-auth/ui';

function App() {
  return <AuthShell onSignIn={handleLogin} onSignUp={handleRegister} />;
}
```

### Remix

```tsx
import { AuthShell } from '@modular-auth/ui';

export default function Login() {
  return <AuthShell onSignIn={handleLogin} onSignUp={handleRegister} />;
}
```

---

## 🏗️ Data Types

```typescript
interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

---

## 🔧 How It Works

- **Verlet Rope Physics**: 11-point chain simulation with gravity, bead mass, damping, and distance constraints iterated 5 times per frame
- **60fps Rendering**: Physics loop updates SVG elements directly via React refs (no re-renders)
- **Self-Contained Styles**: All CSS is injected into `<head>` at runtime via a single `<style>` tag — zero external dependencies
- **Catmull-Rom Splines**: Rope points are converted to smooth cubic bezier SVG paths
- **Multi-Layer Lighting**: 6 SVG layers (ambient glow, light cone, inner glow, bulb hotspot, pole illumination, ground reflection) with gaussian blur filters

---

## 📁 Project Structure

```
packages/auth-module/
├── src/
│   ├── index.ts                  # Barrel exports
│   ├── components/
│   │   ├── AuthShell.tsx          # Main orchestrator
│   │   ├── LampHumanGate.tsx      # Lamp + rope physics
│   │   ├── AuthRevealPanel.tsx    # Fade/slide reveal wrapper
│   │   ├── SignInForm.tsx         # Sign-in form with validation
│   │   └── SignUpForm.tsx         # Sign-up form with validation
│   ├── hooks/
│   │   └── usePullGesture.ts      # Standalone pull gesture hook
│   ├── styles/
│   │   └── inject-styles.ts       # Runtime CSS injection
│   └── types/
│       └── auth.ts                # TypeScript interfaces
├── tsup.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛠️ Development

```bash
# Clone the repo
git clone https://github.com/shahmir2004/modular-auth-ui.git
cd modular-auth-ui

# Install dependencies
npm install

# Start the demo app
npm run dev

# Build the library
npm run build:lib

# Build everything
npm run build
```

---

## 📜 License

MIT © [Muhammad Shahmir Ahmed](https://github.com/shahmir2004)
