// src/app/baby/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SleepChart from '@/components/SleepChart';
import FeedingChart from '@/components/FeedingChart';
import BottleChart from '@/components/BottleChart';
import DiaperChart from '@/components/DiaperChart';
import UnifiedLogTable from '@/components/UnifiedLogTable';
import Link from 'next/link';

// Inside your component's return:
<Link
  href="/"
  className="inline-block mb-4 text-blue-600 hover:underline text-sm"
>
  ← Back to Main Page
</Link>

export default async function BabyDashboard({ params }: { params: { slug: string } }) {
  const baby = await prisma.baby.findFirst({
    where: { name: { equals: decodeURIComponent(params.slug) } }
  });

  if (!baby) return notFound();

  const babyId = baby.id;

  return (
    
    <div className="p-6 space-y-6">
        <Link
  href="/"
  className="inline-block mb-4 text-blue-600 hover:underline text-sm"
>
  ← Back to Main Page
</Link>
      <h1 className="text-2xl font-bold">👶 {baby.name}'s Activity Dashboard</h1>

      {/* Visuals */}
      <div className="grid gap-4 md:grid-cols-2">
        <SleepChart babyId={babyId} />
        <FeedingChart babyId={babyId} />
        <BottleChart babyId={babyId} />
        <DiaperChart babyId={babyId} />
      </div>

      {/* Log Summary */}
      <UnifiedLogTable babyId={babyId} />
    </div>
  );
}
