// src/pages/api/reports/send-daily.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const { babyId } = req.query;
  let targetBabies;

  if (babyId) {
    const baby = await prisma.baby.findUnique({
      where: { id: parseInt(babyId as string, 10) },
    });
    if (!baby) return res.status(404).json({ error: 'Baby not found' });
    targetBabies = [baby];
  } else {
    targetBabies = await prisma.baby.findMany();
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  for (const baby of targetBabies) {
    if (!baby.email) continue;

    try {
      const [sleepLogs, diaperLogs, feedingLogs, bottleFeeds, dailyNote] = await Promise.all([
        prisma.sleepLog.findMany({
          where: { babyId: baby.id, start: { gte: todayStart, lte: todayEnd } },
        }),
        prisma.diaperLog.findMany({
          where: { babyId: baby.id, time: { gte: todayStart, lte: todayEnd } },
        }),
        prisma.feedingLog.findMany({
          where: { babyId: baby.id, time: { gte: todayStart, lte: todayEnd } },
        }),
        prisma.bottleFeed.findMany({
          where: { babyId: baby.id, time: { gte: todayStart, lte: todayEnd } },
        }),
        prisma.dailyNote.findUnique({
          where: { babyId_date: { babyId: baby.id, date: todayStart } },
        }),
      ]);

      const html = `
        <h2>📋 Daily Activity Summary for ${baby.name}</h2>

        <h3>📝 Daily Note</h3>
        <p>${dailyNote?.content || 'No note submitted for today.'}</p>

        <h3>🛏️ Sleep Logs</h3>
        <ul>
          ${sleepLogs.map(log =>
            `<li>${new Date(log.start).toLocaleTimeString()} - ${log.end ? new Date(log.end).toLocaleTimeString() : 'Ongoing'} | ${log.note || '-'}</li>`
          ).join('')}
        </ul>

        <h3>💧 Diaper Logs</h3>
        <ul>
          ${diaperLogs.map(log =>
            `<li>${new Date(log.time).toLocaleTimeString()} - ${log.type} | ${log.note || '-'}</li>`
          ).join('')}
        </ul>

        <h3>🍽️ Feeding Logs</h3>
        <ul>
          ${feedingLogs.map(log =>
            `<li>${new Date(log.time).toLocaleTimeString()} - ${log.mealType} (${log.menu}, ${log.quantity}g) | ${log.note || '-'}</li>`
          ).join('')}
        </ul>

        <h3>🍼 Bottle Feeds</h3>
        <ul>
          ${bottleFeeds.map(log =>
            `<li>${new Date(log.time).toLocaleTimeString()} - ${log.volumeMl}ml | ${log.note || '-'}</li>`
          ).join('')}
        </ul>
      `;

      await transporter.sendMail({
        from: `"Daily Report" <${process.env.EMAIL_USER}>`,
        to: baby.email,
        subject: `🍼 ${baby.name}'s Daily Report`,
        html,
      });

      console.log(`✅ Report sent to ${baby.email}`);
    } catch (err) {
      console.error(`❌ Failed for ${baby.name}:`, err);
    }
  }

  res.status(200).json({ message: babyId ? '✅ Single report sent.' : '✅ All reports sent.' });
}
