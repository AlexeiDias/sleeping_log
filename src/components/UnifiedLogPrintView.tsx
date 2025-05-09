'use client';

import UnifiedLogTable from './UnifiedLogTable';
import PrintButton from './PrintButton';

export default function UnifiedLogPrintView({ babyId }: { babyId: number }) {
  return (
    <div className="p-6 text-sm print:text-xs print:p-0 print:font-mono">
      <h1 className="text-2xl font-bold mb-4">🧾 Full Activity Log</h1>

      <div className="mb-4">
        <PrintButton />
      </div>

      <UnifiedLogTable babyId={babyId} />
    </div>
  );
}
