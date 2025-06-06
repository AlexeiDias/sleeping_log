'use client';

import { useState, useTransition } from 'react';

export default function SendFullReportButton({ babyId, babyName }: { babyId: number; babyName: string }) {
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState('');

  const sendReport = async () => {
    setStatusMsg(`📤 Sending Full Activity Report for ${babyName}...`);
    try {
      const res = await fetch(`/api/reports/send-daily?babyId=${babyId}`);
      if (res.ok) {
        setStatusMsg(`✅ Full Activity Report sent for ${babyName}`);
      } else {
        setStatusMsg(`❌ Failed to send report`);
      }
    } catch (err) {
      console.error('❌ Report error:', err);
      setStatusMsg('❌ Error sending report');
    }
    setTimeout(() => setStatusMsg(''), 4000);
  };

  return (
    <div className="space-y-1">
      <button
        onClick={() => startTransition(sendReport)}
        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        disabled={isPending}
      >
        📧 {isPending ? 'Sending...' : 'Send Full Activity Report'}
      </button>

      {statusMsg && (
        <div className="text-blue-400 text-sm">
          {statusMsg}
        </div>
      )}
    </div>
  );
}
