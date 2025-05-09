import UnifiedLogPrintView from '@/components/UnifiedLogPrintView';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function UnifiedLogPage({ params }: { params: { slug: string } }) {
  const { slug } = await params; // ✅ Async unwrap for Next 15
  const decodedSlug = decodeURIComponent(slug);

  const baby = await prisma.baby.findFirst({
    where: { name: decodedSlug }
  });

  if (!baby) return notFound();

  return <UnifiedLogPrintView babyId={baby.id} />;
}
