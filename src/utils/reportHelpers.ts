// src/utils/reportHelpers.ts
import { prisma } from '@/lib/prisma';

export async function formatDailyReportHTML(babyId: number): Promise<string> {
  const baby = await prisma.baby.findUnique({ where: { id: babyId } });
  if (!baby) throw new Error(`Baby not found for ID ${babyId}`);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [sleepLogs, diaperLogs, feedingLogs, bottleFeeds] = await Promise.all([
    prisma.sleepLog.findMany({
      where: { babyId, start: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.diaperLog.findMany({
      where: { babyId, time: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.feedingLog.findMany({
      where: { babyId, time: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.bottleFeed.findMany({
      where: { babyId, time: { gte: todayStart, lte: todayEnd } },
    }),
  ]);

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 1rem; color: #333">
      <h2>🍼 Daily Report for <strong>${baby.name}</strong></h2>

      <h3>🛏️ Sleep Logs</h3>
      <ul>
        ${sleepLogs.map(log => `
          <li>
            ${new Date(log.start).toLocaleTimeString()} - ${log.end ? new Date(log.end).toLocaleTimeString() : 'Ongoing'}
            <br/>
            ${log.note ? `<em>${log.note}</em>` : '<em>No note</em>'}
          </li>
        `).join('')}
      </ul>

      <h3>💧 Diaper Changes</h3>
      <ul>
        ${diaperLogs.map(log => `
          <li>
            ${new Date(log.time).toLocaleTimeString()} - ${log.type}
            <br/>
            ${log.note ? `<em>${log.note}</em>` : '<em>No note</em>'}
          </li>
        `).join('')}
      </ul>

      <h3>🍽️ Feedings</h3>
      <ul>
        ${feedingLogs.map(log => `
          <li>
            ${new Date(log.time).toLocaleTimeString()} - ${log.mealType} (${log.menu}, ${log.quantity}g)
            <br/>
            ${log.note ? `<em>${log.note}</em>` : '<em>No note</em>'}
          </li>
        `).join('')}
      </ul>

      <h3>🍼 Bottles</h3>
      <ul>
        ${bottleFeeds.map(log => `
          <li>
            ${new Date(log.time).toLocaleTimeString()} - ${log.volumeMl}ml
            <br/>
            ${log.note ? `<em>${log.note}</em>` : '<em>No note</em>'}
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  return html;
}
