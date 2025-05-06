import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SleepChart from '@/components/SleepChart';

export default async function BabyStatsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const id = parseInt(params.slug);
  if (isNaN(id)) return notFound();

  const baby = await prisma.baby.findUnique({
    where: { id },
  });

  if (!baby) return notFound();

  // ✅ THIS WAS MISSING
  const logs = await prisma.sleepLog.findMany({
    where: { babyId: id },
    orderBy: { start: 'desc' },
  });

  return (
    <div className="p-6">
      <Link href="/" className="text-blue-600 hover:underline text-sm mb-2 block">
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-4">🛏️ Sleep Stats for {baby.name}</h1>

      <div className="overflow-x-auto mt-4">
      <SleepChart logs={logs} />

<div className="overflow-x-auto mt-4">
  <table className="min-w-full text-sm text-left border-collapse">
    <thead>
      <tr className="bg-gray-100">
        <th className="px-2 py-1">Date</th>
        <th className="px-2 py-1">Sleep</th>
        <th className="px-2 py-1">Wake</th>
        <th className="px-2 py-1">Duration</th>
        <th className="px-2 py-1">Note</th>
      </tr>
    </thead>
    <tbody>
      {logs.map((log) => {
        const isOngoing = log.start && !log.end;
        const duration = isOngoing
          ? Math.round((Date.now() - new Date(log.start).getTime()) / 60000)
          : log.end
          ? Math.round((new Date(log.end).getTime() - new Date(log.start).getTime()) / 60000)
          : null;

        return (
          <tr key={log.id} className="border-t">
            <td className="px-2 py-1">{log.start ? new Date(log.start).toLocaleDateString() : '-'}</td>
            <td className="px-2 py-1">{log.start ? new Date(log.start).toLocaleTimeString() : '-'}</td>
            <td className="px-2 py-1">{log.end ? new Date(log.end).toLocaleTimeString() : isOngoing ? '🟡 Ongoing' : '-'}</td>
            <td className="px-2 py-1">
              {duration !== null ? `${duration} min` : '-'}
            </td>
            <td className="px-2 py-1">
              {log.end ? (
                log.note || <span className="text-gray-400 italic">No note</span>
              ) : (
                <form
                  action={`/api/sleep/${log.babyId}/note`}
                  method="POST"
                  className="flex gap-1"
                >
                  <input type="hidden" name="logId" value={log.id} />
                  <input
                    name="note"
                    type="text"
                    placeholder="Add note"
                    className="border px-1 py-0.5 text-xs"
                  />
                  <button
                    type="submit"
                    className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded"
                  >
                    💾
                  </button>
                </form>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

      </div>
    </div>
  );
}
