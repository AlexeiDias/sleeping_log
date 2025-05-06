import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import DiaperForm from '@/components/DiaperForm';
import Link from 'next/link';

export default async function DiaperEntryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug);

  const baby = await prisma.baby.findFirst({
    where: {
      name: slug,
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
      <h1 className="text-xl font-bold">💧 Log Diaper for {baby.name}</h1>
      <DiaperForm babyId={baby.id} />
    </div>
  );
}
