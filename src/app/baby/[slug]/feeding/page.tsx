import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import FeedingForm from '@/components/FeedingForm';
import Link from 'next/link';

export default async function FeedingEntryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
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

      <h1 className="text-xl font-bold">🍽️ Log Feeding for {baby.name}</h1>
      <FeedingForm babyId={baby.id} />
    </div>
  );
}
