'use client';

import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔐 Sign In</h1>
      <p className="mb-6 text-sm text-gray-600">Enter your email to receive a login link.</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const email = e.currentTarget.email.value;
          await signIn('email', { email });
        }}
        className="space-y-4"
      >
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          📩 Send Magic Link
        </button>
      </form>
    </main>
  );
}
