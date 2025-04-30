export const dynamic = 'force-dynamic';

import SleepToggleButton from '@/components/SleepToggleButton';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  const babies = await prisma.baby.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      sleepLogs: {
        orderBy: { start: 'desc' },
        take: 3,
      },
    },
  });

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">🍼 Baby Sleep Overview</h1>

      <div className="overflow-x-auto text-sm">
        <table className="min-w-full border-collapse text-gray-800">
          <thead>
            <tr className="bg-gray-800 text-white text-left">
              <th className="px-2 py-1">Baby</th>
              <th className="px-2 py-1">Date</th>
              <th className="px-2 py-1">Sleep Time</th>
              <th className="px-2 py-1">Wake Time</th>
              <th className="px-2 py-1">Duration</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {babies.map((baby) => {
              const hasLogs = baby.sleepLogs.length > 0;
              const logs = hasLogs ? baby.sleepLogs : [{}];

              return logs.map((log, idx) => (
                <tr key={`${baby.id}-${idx}`} className="border-t">
                  <td className="px-2 py-1">
                    {idx === 0 ? (
                      <Link
                        href={`/baby/${baby.id}/stats`}
                        className="text-blue-600 hover:underline"
                      >
                        {baby.name}
                      </Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="px-2 py-1">
                    {log?.start
                      ? new Date(log.start).toLocaleDateString()
                      : hasLogs
                      ? '-'
                      : <span className="text-gray-500 italic">No logs yet</span>}
                  </td>
                  <td className="px-2 py-1">
                    {log?.start
                      ? new Date(log.start).toLocaleTimeString()
                      : '-'}
                  </td>
                  <td className="px-2 py-1">
                    {log?.end
                      ? new Date(log.end).toLocaleTimeString()
                      : '-'}
                  </td>
                  <td className="px-2 py-1">
                    {log?.start && log?.end
                      ? Math.round(
                          (new Date(log.end).getTime() -
                            new Date(log.start).getTime()) /
                            60000
                        )
                      : '-'}
                  </td>
                  <td className="px-2 py-1">
  {idx === 0 && (
    <div className="flex flex-col gap-1">
      <SleepToggleButton babyId={baby.id} />
    </div>
  )}
</td>

                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      <Link
        href="/baby-settings"
        className="inline-block mt-6 text-blue-600 hover:underline text-sm"
      >
        Manage Babies ⚙️
      </Link>
    </main>
  );
}
