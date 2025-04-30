// src/pages/api/sleep/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { babyId, start, end, note } = req.body;

  if (!babyId || !start) {
    return res.status(400).json({ error: 'Missing babyId or start' });
  }

  try {
    // ✅ Check for existing open sleep session (no end)
    const existingOpen = await prisma.sleepLog.findFirst({
      where: {
        babyId: parseInt(babyId),
        end: null,
      },
    });

    if (existingOpen) {
      return res
        .status(400)
        .json({ error: 'This baby is already marked as sleeping. Stop the current session first.' });
    }

    // ✅ Create new sleep log
    const log = await prisma.sleepLog.create({
      data: {
        babyId: parseInt(babyId),
        start: new Date(start),
        end: end ? new Date(end) : undefined,
        note,
      },
    });

    return res.status(201).json(log);
  } catch (err: any) {
    console.error('❌ Error creating sleep log:', err);
    return res.status(500).json({ error: 'Failed to create sleep log' });
  }
}
