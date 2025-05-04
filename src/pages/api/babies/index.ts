// src/pages/api/babies/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const babies = await prisma.baby.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return res.status(200).json(babies);
  }

  if (req.method === 'POST') {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const baby = await prisma.baby.create({
      data: {
        name,
        email,
      },
    });

    return res.status(201).json(baby);
  }

  return res.status(405).end(); // Method Not Allowed
}
