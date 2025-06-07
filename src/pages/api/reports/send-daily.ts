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

  for (const baby of targetBabies) {
    if (!baby.email) continue;

    try {
      const [sleepLogs, diaperLogs, feedingLogs, bottleFeeds, dailyNote] = await Promise.all([
        prisma.sleepLog.findMany({
          where: { babyId: baby.id, start: { gte: todayStart } },
          orderBy: { start: 'asc' }
        }),
        prisma.diaperLog.findMany({
          where: { babyId: baby.id, time: { gte: todayStart } },
          orderBy: { time: 'asc' }
        }),
        prisma.feedingLog.findMany({
          where: { babyId: baby.id, time: { gte: todayStart } },
          orderBy: { time: 'asc' }
        }),
        prisma.bottleFeed.findMany({
          where: { babyId: baby.id, time: { gte: todayStart } },
          orderBy: { time: 'asc' }
        }),
        prisma.dailyNote.findUnique({
          where: { babyId_date: { babyId: baby.id, date: todayStart } },
        }),
      ]);

      const formatTime = (date: Date) =>
        new Date(date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

      const html = `
        <h2>📋 Full Activity Report for ${baby.name}</h2>

        <h3>📝 Daily Note</h3>
        <p>${dailyNote?.content || 'No note submitted for today.'}</p>

        <h3>🛏️ Sleep Logs</h3>
        <ul>
          ${
            sleepLogs.length
              ? sleepLogs
                  .map(
                    (log) =>
                      `<li>${formatTime(log.start)} - ${
                        log.end ? formatTime(log.end) : 'Ongoing'
                      } | ${log.note || '-'}</li>`
                  )
                  .join('')
              : '<li>No sleep logs for today.</li>'
          }
        </ul>

        <h3>💧 Diaper Logs</h3>
        <ul>
          ${
            diaperLogs.length
              ? diaperLogs
                  .map(
                    (log) =>
                      `<li>${formatTime(log.time)} - ${log.type} | ${
                        log.note || '-'
                      }</li>`
                  )
                  .join('')
              : '<li>No diaper logs for today.</li>'
          }
        </ul>

        <h3>🍽️ Feeding Logs</h3>
        <ul>
          ${
            feedingLogs.length
              ? feedingLogs
                  .map(
                    (log) =>
                      `<li>${formatTime(log.time)} - ${log.mealType} (${log.menu}, ${
                        log.quantity
                      }g) | ${log.note || '-'}</li>`
                  )
                  .join('')
              : '<li>No feeding logs for today.</li>'
          }
        </ul>

        <h3>🍼 Bottle Feeds</h3>
        <ul>
          ${
            bottleFeeds.length
              ? bottleFeeds
                  .map(
                    (log) =>
                      `<li>${formatTime(log.time)} - ${log.volumeMl}ml | ${
                        log.note || '-'
                      }</li>`
                  )
                  .join('')
              : '<li>No bottle feeds for today.</li>'
          }
        </ul>
      `;

      await transporter.sendMail({
        from: `"Daily Report" <${process.env.EMAIL_USER}>`,
        to: baby.email,
        subject: `🍼 ${baby.name}'s Full Activity Report`,
        html,
      });

      console.log(`✅ Report sent to ${baby.email}`);
    } catch (err) {
      console.error(`❌ Failed for ${baby.name}:`, err);
    }
  }

  res
    .status(200)
    .json({ message: babyId ? '✅ Single report sent.' : '✅ All reports sent.' });
}
