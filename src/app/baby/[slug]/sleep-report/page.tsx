// src/app/baby/[slug]/sleep-report/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SleepReportView from '@/components/SleepReportView';
import PrintButton from '@/components/PrintButton';

export default async function SleepReportPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug); // ✅ FIXED

  const baby = await prisma.baby.findFirst({
    where: { name: slug },
  });

  if (!baby) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        🛏️ Sleep Report for {baby.name}
      </h1>
      <SleepReportView babyId={baby.id} />
      <div className="mt-4">
        <PrintButton />
      </div>
    </div>
  );
}
