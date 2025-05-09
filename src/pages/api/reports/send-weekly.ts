// src/pages/api/reports/send-weekly.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import nodemailer from 'nodemailer';

const chartCanvas = new ChartJSNodeCanvas({ width: 600, height: 300 });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const babies = await prisma.baby.findMany({ where: { email: { not: null } } });

  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - ((now.getDay() + 6) % 7)); // previous Monday
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 5); // Friday
  end.setHours(23, 59, 59, 999);

  for (const baby of babies) {
    const [sleepLogs, feedingLogs, bottleFeeds, diaperLogs] = await Promise.all([
      prisma.sleepLog.findMany({ where: { babyId: baby.id, start: { gte: start, lte: end } } }),
      prisma.feedingLog.findMany({ where: { babyId: baby.id, time: { gte: start, lte: end } } }),
      prisma.bottleFeed.findMany({ where: { babyId: baby.id, time: { gte: start, lte: end } } }),
      prisma.diaperLog.findMany({ where: { babyId: baby.id, time: { gte: start, lte: end } } }),
    ]);

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const init = () => Array(5).fill(0);

    // Sleep duration per day
    const sleepData = init();
    sleepLogs.forEach(log => {
      const i = new Date(log.start).getDay() - 1;
      if (i >= 0 && i <= 4) {
        const duration = log.end ? (new Date(log.end).getTime() - new Date(log.start).getTime()) / (1000 * 60 * 60) : 0;
        sleepData[i] += Number(duration.toFixed(2));
      }
    });

    const feedingData = init();
    feedingLogs.forEach(log => {
      const i = new Date(log.time).getDay() - 1;
      if (i >= 0 && i <= 4) feedingData[i]++;
    });

    const bottleData = init();
    bottleFeeds.forEach(log => {
      const i = new Date(log.time).getDay() - 1;
      if (i >= 0 && i <= 4) bottleData[i]++;
    });

    const diaperData = init();
    diaperLogs.forEach(log => {
      const i = new Date(log.time).getDay() - 1;
      if (i >= 0 && i <= 4) diaperData[i]++;
    });

    // 🛏 Sleep Chart
    const sleepChart = await chartCanvas.renderToBuffer({
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Sleep (hours)',
          data: sleepData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        }],
      },
    });

    // 🍽 Feedings Chart
    const feedingChart = await chartCanvas.renderToBuffer({
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Feedings',
          data: feedingData,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
        }],
      },
    });

    // 🍼 Bottles Chart
    const bottleChart = await chartCanvas.renderToBuffer({
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Bottles',
          data: bottleData,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }],
      },
    });

    // 💩 Diapers Chart
    const diaperChart = await chartCanvas.renderToBuffer({
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Diapers',
          data: diaperData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        }],
      },
    });

    // 📧 Email HTML
    const html = `
      <h2>📈 Weekly Activity Report for ${baby.name}</h2>

      <h3>🛏️ Sleep Duration</h3>
      <img src="cid:sleepchart@weekly" style="max-width:100%;" />

      <h3>🍽️ Feedings</h3>
      <img src="cid:feedingchart@weekly" style="max-width:100%;" />

      <h3>🍼 Bottle Feeds</h3>
      <img src="cid:bottlechart@weekly" style="max-width:100%;" />

      <h3>💧 Diaper Changes</h3>
      <img src="cid:diaperchart@weekly" style="max-width:100%;" />
    `;

    await transporter.sendMail({
      from: `"Weekly Report" <${process.env.EMAIL_USER}>`,
      to: baby.email!,
      subject: `📊 ${baby.name}'s Weekly Summary`,
      html,
      attachments: [
        { filename: 'sleep.png', content: sleepChart, cid: 'sleepchart@weekly' },
        { filename: 'feedings.png', content: feedingChart, cid: 'feedingchart@weekly' },
        { filename: 'bottles.png', content: bottleChart, cid: 'bottlechart@weekly' },
        { filename: 'diapers.png', content: diaperChart, cid: 'diaperchart@weekly' },
      ],
    });

    console.log(`✅ Weekly report sent to ${baby.email}`);
  }

  res.status(200).json({ message: '📬 All weekly reports delivered.' });
}
