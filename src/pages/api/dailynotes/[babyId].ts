// src/pages/api/dailynotes/[babyId].ts
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const babyId = parseInt(req.query.babyId as string);
  if (isNaN(babyId)) return res.status(400).json({ error: 'Invalid babyId' });

  const rawDate = (req.query.date as string) || new Date().toISOString().split('T')[0];
  const date = new Date(rawDate);
  date.setHours(0, 0, 0, 0); // normalize

  if (req.method === 'GET') {
    const note = await prisma.dailyNote.findUnique({
      where: { babyId_date: { babyId, date } },
    });
    return res.status(200).json(note || null);
  }

  if (req.method === 'POST') {
    const { content } = req.body;

    const note = await prisma.dailyNote.upsert({
      where: { babyId_date: { babyId, date } },
      update: { content },
      create: { babyId, date, content },
    });

    return res.status(200).json(note);
  }

  return res.status(405).end();
}
