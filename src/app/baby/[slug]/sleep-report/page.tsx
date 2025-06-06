import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SleepReportView from '@/components/SleepReportView';
import PrintButton from '@/components/PrintButton';

import Link from 'next/link';
import { FACILITY_INFO } from '@/constants/facility';

export default async function SleepReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // ✅ Await the promise
  const decodedSlug = decodeURIComponent(slug);

  const baby = await prisma.baby.findFirst({
    where: { name: decodedSlug },
  });

  if (!baby) return notFound();

  const babyId = baby.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logs = await prisma.sleepLog.findMany({
    where: {
      babyId,
      start: { gte: today },
    },
    include: {
      sleepChecks: true,
    },
    orderBy: { start: 'asc' },
  });

  const serializedLogs = logs.map(log => ({
    ...log,
    start: log.start.toISOString(),
    end: log.end ? log.end.toISOString() : null,
    createdAt: log.createdAt.toISOString(),
    sleepChecks: log.sleepChecks.map(check => ({
      ...check,
      checkedAt: check.checkedAt.toISOString(),
    })),
  }));

  return (
    <div className="p-6 space-y-4">
      <div>
        <Link
          href={`/baby/${slug}`}
          className="inline-block text-blue-600 hover:underline text-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="flex gap-2 items-center">
        <PrintButton />
        </div>

        

      <SleepReportView
        babyName={baby.name}
        date={today.toLocaleDateString()}
        facility={FACILITY_INFO}
        logs={serializedLogs}
      />
    </div>
  );
}
