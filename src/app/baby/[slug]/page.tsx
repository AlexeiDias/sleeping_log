import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SleepChart from '@/components/SleepChart';
import FeedingChart from '@/components/FeedingChart';
import BottleChart from '@/components/BottleChart';
import DiaperChart from '@/components/DiaperChart';
import UnifiedLogTable from '@/components/UnifiedLogTable';
import Link from 'next/link';
import DailyNoteForm from '@/components/DailyNoteForm';
import SleepTimer from '@/components/SleepTimer';

export default async function BabyDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const baby = await prisma.baby.findFirst({
    where: { name: decodedSlug },
    include: {
      sleepLogs: {
        where: { end: null },
        orderBy: { start: 'desc' },
        take: 1,
      },
    },
  });

  if (!baby) return notFound();

  const babyId = baby.id;
  const activeSleepLogId = baby.sleepLogs[0]?.id ?? null;

  return (
    <section className="space-y-8 px-4 sm:px-6 md:px-8 py-6">
      {/* Navigation */}
      <Link href="/" className="inline-block text-sm text-blue-600 hover:underline">
        ← Back to Main Page
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          👶 {baby.name}'s Activity Dashboard
        </h1>
        <Link
          href={`/baby/${slug}/sleep-report`}
          className="text-sm text-blue-600 hover:underline"
        >
          🖨️ View Printable Sleep Log
        </Link>
      </div>

      {/* Sleep Timer */}
      {activeSleepLogId && (
        <div className="rounded-md border p-4 shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-700">
          <SleepTimer sleepLogId={activeSleepLogId} />
        </div>
      )}

      {/* Unified Log */}
      <div className="rounded-md border p-4 overflow-x-auto bg-white dark:bg-zinc-900 dark:border-zinc-700">
        <UnifiedLogTable babyId={babyId} />
      </div>

      {/* Daily Note Form */}
      <div className="rounded-md border p-4 shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-700">
        <DailyNoteForm babyId={babyId} />
      </div>

      {/* Chart Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-md border p-4 bg-white dark:bg-zinc-900 dark:border-zinc-700">
          <SleepChart babyId={babyId} />
        </div>
        <div className="rounded-md border p-4 bg-white dark:bg-zinc-900 dark:border-zinc-700">
          <FeedingChart babyId={babyId} />
        </div>
        <div className="rounded-md border p-4 bg-white dark:bg-zinc-900 dark:border-zinc-700">
          <BottleChart babyId={babyId} />
        </div>
        <div className="rounded-md border p-4 bg-white dark:bg-zinc-900 dark:border-zinc-700">
          <DiaperChart babyId={babyId} />
        </div>
      </div>

      {/* Log Print Button */}
      <Link
        href={`/baby/${slug}/unified-log`}
        className="inline-block text-sm text-blue-600 hover:underline"
      >
        🖨️ Print Full Activity Log
      </Link>
    </section>
  );
}
