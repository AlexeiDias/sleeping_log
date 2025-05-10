// src/app/api/reports/pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateSleepPdf } from '@/utils/generateSleepPdf';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const babyId = searchParams.get('babyId');

  if (!slug && !babyId) {
    return NextResponse.json({ error: 'Missing slug or babyId' }, { status: 400 });
  }

  try {
    const identifier = slug ?? babyId!;
    const pdfBuffer = await generateSleepPdf(identifier);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="sleep-report-${identifier}.pdf"`,
      },
    });
  } catch (err) {
    console.error('❌ PDF generation failed:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
