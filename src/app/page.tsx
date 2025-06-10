export const dynamic = 'force-dynamic';
import SignOutButton from '@/components/SignOutButton';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import React from 'react';
import SleepToggleButton from '@/components/SleepToggleButton';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  // ✅ Get current session
  const session = await getServerSession(authOptions);
  console.log('🔐 Session:', session);

  // 🔐 Redirect to sign-in page if not authenticated
  if (!session || !session.user) {
    redirect('/signin'); // 👈 Your actual custom signin UI route
  }

  // ✅ Load baby data scoped by user's facility
  const babies = await prisma.baby.findMany({
    where: { facilityId: session.user.facilityId },
    orderBy: { createdAt: 'asc' },
    include: {
      sleepLogs: {
        orderBy: { start: 'desc' },
        take: 3,
      },
    },
  });

  return (
    <main className="p-2 sm:p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">🍼 Baby Sleep Overview</h1>

      {babies.map((baby) => {
        const logs = baby.sleepLogs;
        const hasLogs = logs.length > 0;

        return (
          
          <section
          
            key={baby.id}
            className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-black dark:bg-zinc-900 text-white"
          >
             <div className="p-4">
      <h1>Welcome!</h1>
      <SignOutButton />
    </div>
            <div className="px-4 py-2 bg-gray-800 text-lg font-semibold">
              <Link
                href={`/baby/${encodeURIComponent(baby.name.toLowerCase())}`}
                className="hover:underline"
              >
                {baby.name}
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm text-white">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Sleep</th>
                    <th className="px-3 py-2 text-left">Wake</th>
                    <th className="px-3 py-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {hasLogs ? (
                    logs.map((log, idx) => (
                      <React.Fragment key={`${baby.id}-${idx}`}>
                        <tr className="border-t border-gray-600">
                          <td className="px-3 py-2">
                            {log.start
                              ? new Date(log.start).toLocaleDateString()
                              : '-'}
                          </td>
                          <td className="px-3 py-2">
                            {log.start
                              ? new Date(log.start).toLocaleTimeString()
                              : '-'}
                          </td>
                          <td className="px-3 py-2">
                            {log.end
                              ? new Date(log.end).toLocaleTimeString()
                              : '-'}
                          </td>
                          <td className="px-3 py-2">
                            {log.start && log.end
                              ? Math.round(
                                  (new Date(log.end).getTime() -
                                    new Date(log.start).getTime()) / 60000
                                ) + ' min'
                              : '-'}
                          </td>
                        </tr>
                        {log.note && (
                          <tr className="bg-zinc-900 border-t border-zinc-700">
                            <td colSpan={4} className="px-4 py-2 text-sm text-gray-400">
                              📝 {log.note}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr className="border-t border-gray-600">
                      <td colSpan={4} className="px-3 py-2 text-gray-400 italic text-center">
                        No sleep logs yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-t border-gray-300 dark:border-zinc-700">
              <SleepToggleButton babyId={baby.id} />
              <Link
                href={`/baby/${encodeURIComponent(baby.name.toLowerCase())}/diaper`}
                title="Log Diaper"
                className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded"
              >
                💧
              </Link>
              <Link
                href={`/baby/${encodeURIComponent(baby.name.toLowerCase())}/feeding`}
                title="Log Feeding"
                className="bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded"
              >
                🍽️
              </Link>
              <Link
                href={`/baby/${encodeURIComponent(baby.name.toLowerCase())}/bottle`}
                title="Log Bottle Feed"
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
              >
                🍼
              </Link>
            </div>
          </section>
        );
      })}

      <Link
        href="/baby-settings"
        className="inline-block text-blue-600 hover:underline text-sm"
      >
        Manage Babies ⚙️
      </Link>
    </main>
  );
}
