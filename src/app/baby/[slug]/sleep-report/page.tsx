// src/app/baby/[slug]/sleep-report/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SleepReportView from '@/components/SleepReportView';
import PrintButton from '@/components/PrintButton';

export default async function SleepReportPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
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

  return (
    <div className="p-6 space-y-4">
      <PrintButton />
      <SleepReportView
        babyName={baby.name}
        date={today.toLocaleDateString()}
        facility={{
          name: 'Little Stars Daycare',
          address: '123 Sunshine St, Happy Town, CA',
          phone: '(555) 123-4567',
          license: 'CA-DC-987654',
        }}
        logs={logs}
      />
    </div>
  );
}
