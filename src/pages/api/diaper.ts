import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { babyId, type, note } = req.body;

  if (!babyId || !type) return res.status(400).json({ error: 'Missing data' });

  const log = await prisma.diaperLog.create({
    data: {
      babyId: parseInt(babyId),
      type,
      note,
    },
  });

  res.status(200).json(log);
}
