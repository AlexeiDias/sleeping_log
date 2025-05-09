'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="mt-4 bg-blue-600 text-white text-xs px-2 py-1 rounded sm:text-sm sm:px-3"
    >
      🖨️ Print Report
    </button>
  );
}
