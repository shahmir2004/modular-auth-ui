'use client';

import { AuthShell } from '@modular-auth/ui';

export default function Home() {
  return (
    <AuthShell
      mode="sign-in"
      onSignIn={(data) => {
        console.log('Sign-in:', data);
        alert(`Signed in as ${data.email}`);
      }}
      onSignUp={(data) => {
        console.log('Sign-up:', data);
        alert(`Account created for ${data.email}`);
      }}
    />
  );
}
