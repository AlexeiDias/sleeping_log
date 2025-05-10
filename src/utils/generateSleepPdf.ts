import puppeteer from 'puppeteer';
import { Buffer } from 'buffer'; // ✅ Required for Buffer conversion

export async function generateSleepPdf(babySlug: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true, // ✅ Safe for all environments + TS types
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // ✅ Dynamically detect prod or dev
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  await page.goto(`${baseUrl}/baby/${encodeURIComponent(babySlug)}/sleep-report`, {
    waitUntil: 'networkidle0',
  });

  // 📝 Puppeteer returns Uint8Array → we convert to Buffer for compatibility
  const pdfData = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  await browser.close();

  return Buffer.from(pdfData); // ✅ This fixes your build error!
}
