// src/components/RequireAuth.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin'); // or your custom sign-in route
    }
  }, [status, router]);

  if (status === 'loading') return <p>Loading...</p>;

  return <>{children}</>;
}
