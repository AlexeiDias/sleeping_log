import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

// Auth options with typings
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        secure: false, // ✅ TLS for port 587 (Gmail)
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASS,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // @ts-ignore - custom fields
        session.user.role = user.role;
        // @ts-ignore - custom fields
        session.user.facilityId = user.facilityId;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // ✅ Always redirect to homepage after login
      return baseUrl;
    },
  },

  pages: {
    signIn: '/signin',
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: true, // ✅ Enables helpful logs
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
