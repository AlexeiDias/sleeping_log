// src/pages/api/reports/send-daily.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { formatDailyReportHTML } from '@/utils/reportHelpers';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const babies = await prisma.baby.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  for (const baby of babies) {
    if (!baby.email) continue;

    try {
      const html = await formatDailyReportHTML(baby.id);

      await transporter.sendMail({
        from: `"Baby Logger" <${process.env.EMAIL_USER}>`,
        to: baby.email,
        subject: `🍼 ${baby.name}'s Daily Report`,
        html,
      });

      console.log(`✅ Email sent to ${baby.email}`);
    } catch (err) {
      console.error(`❌ Failed to send email to ${baby.email}`, err);
    }
  }

  res.status(200).json({ message: '✅ All emails processed with Nodemailer' });
}
