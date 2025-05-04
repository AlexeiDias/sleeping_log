import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const babyId = parseInt(req.query.babyId as string);
  if (isNaN(babyId)) return res.status(400).json({ error: 'Invalid baby ID' });

  if (req.method === 'GET') {
    const logs = await prisma.bottleFeed.findMany({
      where: { babyId },
      orderBy: { time: 'desc' },
    });
    return res.status(200).json(logs);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
