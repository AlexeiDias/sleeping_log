import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { logId, note } = req.body;

  try {
    const updated = await prisma.sleepLog.update({
      where: { id: parseInt(logId) },
      data: { note },
    });

    return res.status(200).json(updated);
  } catch (err: any) {
    console.error('❌ Failed to update note', err);
    return res.status(500).json({ error: 'Could not save note' });
  }
}
