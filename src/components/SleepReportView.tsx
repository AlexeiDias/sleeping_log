'use client';

import React from 'react';

type SleepLog = {
  id: number;
  start: string;
  end: string | null;
  note: string | null;
  sleepChecks: { id: number; checkedAt: string }[]; // ✅ FIXED
};

type Props = {
  babyName: string;
  date: string;
  facility: {
    name: string;
    address: string;
    phone: string;
    license: string;
  };
  logs: SleepLog[];
};

export default function SleepReportView({ babyName, date, facility, logs }: Props) {
  return (
    <div className="p-6 text-sm print:text-xs print:p-0 print:font-mono">
      <h1 className="text-2xl font-bold mb-2">🛏️ Sleep Log Report</h1>
      <p className="mb-1 font-medium">Baby: <span className="font-normal">{babyName}</span></p>
      <p className="mb-1">Date: {date}</p>

      <div className="mt-4 mb-6 border border-gray-300 p-3 rounded text-gray-800 bg-gray-50 print:border-none">
        <h2 className="font-semibold">📍 Facility Info</h2>
        <p><strong>Name:</strong> {facility.name}</p>
        <p><strong>Address:</strong> {facility.address}</p>
        <p><strong>Phone:</strong> {facility.phone}</p>
        <p><strong>License:</strong> {facility.license}</p>
      </div>

      <h2 className="font-semibold mt-4 mb-2">🕒 Sleep Sessions</h2>
      <table className="w-full border text-left text-sm mb-6">
        <thead className="bg-gray-100 text-gray-800 print:bg-white">
          <tr>
            <th className="border px-2 py-1">Start</th>
            <th className="border px-2 py-1">End</th>
            <th className="border px-2 py-1">Note</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="border px-2 py-1">{new Date(log.start).toLocaleTimeString()}</td>
              <td className="border px-2 py-1">
                {log.end ? new Date(log.end).toLocaleTimeString() : 'Ongoing'}
              </td>
              <td className="border px-2 py-1">{log.note || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="font-semibold mb-2">🔁 15-Minute Checks</h2>
      {logs.map((log) => (
        <div key={log.id} className="mb-4">
          <ul className="list-disc ml-6">
            {log.sleepChecks.map((check) => (
              <li key={check.id}>
                Sleep check performed at {new Date(check.checkedAt).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
