// src/pages/api/sleep/[slug].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query.slug as string;
  const babyId = parseInt(slug);

  if (isNaN(babyId)) return res.status(400).json({ error: 'Invalid slug' });

  if (req.method === 'GET') {
    const logs = await prisma.sleepLog.findMany({
      where: { babyId },
      orderBy: { start: 'desc' },
    });
    return res.status(200).json(logs);
  }

  if (req.method === 'PUT') {
    const babyId = parseInt(req.query.slug as string);
    const { end } = req.body;
  
    const openLog = await prisma.sleepLog.findFirst({
      where: {
        babyId,
        end: null,
      },
      orderBy: { start: 'desc' },
    });
  
    if (!openLog) return res.status(404).json({ error: 'No active sleep session' });
  
    const updated = await prisma.sleepLog.update({
      where: { id: openLog.id },
      data: { end: new Date(end) },
    });
  
    return res.status(200).json(updated);
  }
  

  return res.status(405).end();
}
