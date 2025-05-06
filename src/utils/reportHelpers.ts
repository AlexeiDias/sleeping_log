// src/utils/reportHelpers.ts
import { prisma } from '@/lib/prisma';

export async function formatDailyReportHTML(babyId: number) {
  const baby = await prisma.baby.findUnique({ where: { id: babyId } });
  if (!baby) throw new Error('Baby not found');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [sleepLogs, diaperLogs, feedingLogs, bottleFeeds, dailyNote] = await Promise.all([
    prisma.sleepLog.findMany({
      where: { babyId, start: { gte: today } },
    }),
    prisma.diaperLog.findMany({
      where: { babyId, time: { gte: today } },
    }),
    prisma.feedingLog.findMany({
      where: { babyId, time: { gte: today } },
    }),
    prisma.bottleFeed.findMany({
      where: { babyId, time: { gte: today } },
    }),
    prisma.dailyNote.findUnique({
      where: { babyId_date: { babyId, date: today } },
    }),
  ]);

  return `
    <h2>🍼 Daily Report for ${baby.name}</h2>

    ${dailyNote?.content ? `<p><strong>📘 Note:</strong> ${dailyNote.content}</p>` : ''}

    <h3>🛏️ Sleep Logs</h3>
    <ul>${sleepLogs.map(log => `<li>${new Date(log.start).toLocaleTimeString()} - ${log.end ? new Date(log.end).toLocaleTimeString() : 'Ongoing'} | ${log.note || 'No note'}</li>`).join('')}</ul>

    <h3>💧 Diaper Logs</h3>
    <ul>${diaperLogs.map(log => `<li>${new Date(log.time).toLocaleTimeString()} - ${log.type} | ${log.note || 'No note'}</li>`).join('')}</ul>

    <h3>🍽️ Feeding Logs</h3>
    <ul>${feedingLogs.map(log => `<li>${new Date(log.time).toLocaleTimeString()} - ${log.mealType} (${log.menu}, ${log.quantity}g) | ${log.note || 'No note'}</li>`).join('')}</ul>

    <h3>🍼 Bottle Feeds</h3>
    <ul>${bottleFeeds.map(log => `<li>${new Date(log.time).toLocaleTimeString()} - ${log.volumeMl}ml | ${log.note || 'No note'}</li>`).join('')}</ul>
  `;
}
