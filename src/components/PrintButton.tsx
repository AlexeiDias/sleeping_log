'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="mt-4 bg-blue-600 text-white px-4 py-1 rounded text-sm"
    >
      🖨️ Print Report
    </button>
  );
}
