// src/app/baby/[slug]/unified-log/page.tsx

import UnifiedLogPrintView from '@/components/UnifiedLogPrintView';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function UnifiedLogPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const decodedSlug = decodeURIComponent(slug);

  const baby = await prisma.baby.findFirst({
    where: { name: decodedSlug },
  });

  if (!baby) return notFound();

  return <UnifiedLogPrintView babyId={baby.id} babyName={baby.name} slug={slug} />;
}
