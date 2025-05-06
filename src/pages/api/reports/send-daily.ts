import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { generateSleepPdf } from '@/utils/generateSleepPdf';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const babies = await prisma.baby.findMany({
    select: { id: true, name: true, email: true },
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  for (const baby of babies) {
    if (!baby.email) continue;

    try {
      const pdfBuffer = await generateSleepPdf(baby.name);

      await transporter.sendMail({
        from: `"Sleep Log App" <${process.env.EMAIL_USER}>`,
        to: baby.email,
        subject: `🛏️ ${baby.name}'s Daily Sleep Report`,
        text: `Attached is the official sleep log for ${baby.name}.`,
        attachments: [
          {
            filename: `${baby.name}_sleep_report.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      console.log(`✅ PDF sent to ${baby.email}`);
    } catch (err) {
      console.error(`❌ Failed to send report for ${baby.name}`, err);
    }
  }

  res.status(200).json({ message: '✅ All PDFs processed and sent' });
}
