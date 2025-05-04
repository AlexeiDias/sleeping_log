// src/pages/api/bottle.ts
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { babyId, volumeMl, note } = req.body;

  if (!babyId || !volumeMl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await prisma.bottleFeed.create({
      data: {
        babyId,
        volumeMl,
        note,
      },
    });

    res.status(201).json({ message: 'Bottle feed logged successfully' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to log bottle feed' });
  }
}
