import { authOptions } from './app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';

// 🧠 This will return the session using headers (automatically handles req/res)
export const auth = () => {
  return getServerSession(authOptions);
};
