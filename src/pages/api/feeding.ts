// src/pages/api/feeding.ts
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { babyId, mealType, menu, quantity, note } = req.body;

  if (!babyId || !mealType || !menu || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await prisma.feedingLog.create({
      data: {
        babyId,
        mealType,
        menu,
        quantity,
        note,
      },
    });

    res.status(201).json({ message: 'Feeding logged successfully' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to log feeding' });
  }
}
