// src/pages/api/babies/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const babies = await prisma.baby.findMany({ orderBy: { createdAt: 'asc' } });
    return res.status(200).json(babies);
  }

  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const newBaby = await prisma.baby.create({ data: { name } });
    return res.status(201).json(newBaby);
  }

  return res.status(405).end(); // Method Not Allowed
}
