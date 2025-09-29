import { authOptions } from "@/lib/auth";
import { getServerSession } from 'next-auth/next';

// 🧠 This will return the session using headers (automatically handles req/res)
export const auth = () => {
  return getServerSession(authOptions);
};
