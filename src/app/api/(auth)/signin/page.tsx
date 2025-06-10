'use client';

import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  return (
    <div className="p-6 max-w-md mx-auto text-center space-y-4">
      <h1 className="text-2xl font-bold">👋 Welcome</h1>
      <p className="text-gray-600">Sign in to your daycare dashboard</p>
      <button
        onClick={() => signIn(undefined, { callbackUrl: '/' })}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        📧 Sign in with Email
      </button>
    </div>
  );
}
