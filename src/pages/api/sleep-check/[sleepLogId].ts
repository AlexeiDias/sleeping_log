// src/pages/api/sleep-check/[sleepLogId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sleepLogId = parseInt(req.query.sleepLogId as string);

  if (isNaN(sleepLogId)) {
    return res.status(400).json({ error: 'Invalid sleepLogId' });
  }

  if (req.method === 'POST') {
    const check = await prisma.sleepCheck.create({
      data: { sleepLogId },
    });

    return res.status(201).json(check);
  }

  if (req.method === 'GET') {
    const checks = await prisma.sleepCheck.findMany({
      where: { sleepLogId },
      orderBy: { checkedAt: 'asc' },
    });

    return res.status(200).json(checks);
  }

  return res.status(405).end(); // Method Not Allowed
}
