// src/app/baby/[slug]/bottle/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BottleForm from '@/components/BottleForm';
import Link from 'next/link';

export default async function BottleEntryPage({
  params,
}: {
  params: { slug: string };
}) {
  const baby = await prisma.baby.findFirst({
    where: {
      name: decodeURIComponent(params.slug),
    },
  });

  if (!baby) return notFound();

  return (
    <div className="p-6 space-y-4">
      <Link
        href="/"
        className="inline-block text-blue-600 hover:underline text-sm"
      >
        ← Back to Main Page
      </Link>

      <h1 className="text-xl font-bold">🍼 Log Bottle Feed for {baby.name}</h1>
      <BottleForm babyId={baby.id} />
    </div>
  );
}
