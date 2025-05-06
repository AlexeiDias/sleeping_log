// src/pages/api/babies/[slug].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query.slug as string;
  const id = parseInt(slug); // still numeric for now

  if (isNaN(id)) return res.status(400).json({ error: 'Invalid slug (expected numeric ID)' });

  if (req.method === 'GET') {
    const baby = await prisma.baby.findUnique({ where: { id } });
    return res.status(200).json(baby);
  }

  if (req.method === 'PUT') {
    const { name, email } = req.body;
  
    const updated = await prisma.baby.update({
      where: { id },
      data: {
        name,
        email,
      },
    });
  
    return res.status(200).json(updated);
  }
  

  if (req.method === 'DELETE') {
    await prisma.baby.delete({ where: { id } });
    return res.status(204).end();
  }

  return res.status(405).end();
}
