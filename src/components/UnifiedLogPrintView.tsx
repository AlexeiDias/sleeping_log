'use client';

import UnifiedLogTable from './UnifiedLogTable';
import PrintButton from './PrintButton';
import { FACILITY_INFO } from '@/constants/facility';
import Link from 'next/link';
import SendFullReportButton from '@/components/report-buttons/SendFullReportButton';

export default function UnifiedLogPrintView({
  babyId,
  babyName,
  slug,
}: {
  babyId: number;
  babyName: string;
  slug: string;
}) {
  return (
    <div className="p-6 text-sm print:text-xs print:p-0 print:font-mono">

      <div className="mb-4">
        <Link
          href={`/baby/${slug}`}
          className="inline-block text-blue-600 hover:underline text-sm print:hidden"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">🧾 Full Activity Log</h1>

      {/* 🏢 Facility Info */}
      <div className="bg-white text-black p-4 rounded shadow border mb-6 print:border-black print:shadow-none print:mb-4">
        <h2 className="font-semibold text-md mb-2">📍 Facility Info</h2>
        <p><strong>Name:</strong> {FACILITY_INFO.name}</p>
        <p><strong>Address:</strong> {FACILITY_INFO.address}</p>
        <p><strong>Phone:</strong> {FACILITY_INFO.phone}</p>
        <p><strong>License:</strong> {FACILITY_INFO.license}</p>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap items-center">
        <PrintButton />
        </div>
        <div>
        <SendFullReportButton babyId={babyId} babyName={babyName} />

      </div>
    <div>
       <UnifiedLogTable babyId={babyId} />
    </div>
     
    </div>
  );
}
