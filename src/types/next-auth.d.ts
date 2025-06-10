// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'ADMIN' | 'STAFF';
      facilityId: number;
    };
  }

  interface User {
    id: number;
    role: 'ADMIN' | 'STAFF';
    facilityId: number;
  }
}
