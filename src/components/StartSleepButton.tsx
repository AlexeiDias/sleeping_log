'use client';

export default function StartSleepButton({ babyId }: { babyId: number }) {
  const handleStartSleep = async () => {
    console.log('⏱ Start Sleep clicked for baby ID:', babyId);

    const response = await fetch('/api/sleep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        babyId,
        start: new Date().toISOString(),
      }),
    });

    const result = await response.json();
    console.log('✅ Sleep Log Response:', result);

    location.reload();
  };

  return (
    <button
      onClick={handleStartSleep}
      className="bg-green-600 text-white px-3 py-1 text-xs rounded"
    >
      Start Sleep
    </button>
  );
}
