import puppeteer from 'puppeteer';

export async function generateSleepPdf(babySlug: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.goto(`http://localhost:3000/baby/${encodeURIComponent(babySlug)}/sleep-report`, {
    waitUntil: 'networkidle0',
  });

  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

  await browser.close();
  return pdfBuffer;
}
