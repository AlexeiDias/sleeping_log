// src/pages/api/reports/generate-pdf.ts
import { generateSleepPdf } from '@/utils/generateSleepPdf';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.body;

  if (!slug) {
    return res.status(400).json({ error: 'Missing baby slug' });
  }

  try {
    const pdf = await generateSleepPdf(slug);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="sleep-${slug}.pdf"`);

    return res.send(pdf);
  } catch (error) {
    console.error('[generate-pdf] Failed:', error);
    return res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
