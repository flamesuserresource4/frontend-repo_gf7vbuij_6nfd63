import { useEffect, useState } from 'react';

const BACKEND = import.meta.env.VITE_BACKEND_URL || '';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/leaderboard`);
        const data = await res.json();
        setScores(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Leaderboard</h2>
          <span className="text-sm text-neutral-500">Top 20</span>
        </div>
        <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white/70 backdrop-blur">
          {loading ? (
            <div className="p-6 text-center text-neutral-500">Loading...</div>
          ) : scores.length === 0 ? (
            <div className="p-6 text-center text-neutral-500">No scores yet. Be the first!</div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {scores.map((s, i) => (
                <li key={s.id} className="grid grid-cols-5 items-center px-4 py-3 text-sm">
                  <span className="font-mono text-neutral-500">#{i + 1}</span>
                  <span className="col-span-2 font-medium">{s.name}</span>
                  <span className="text-right">{(s.time_ms / 1000).toFixed(2)}s</span>
                  <span className="text-right text-neutral-600">{s.moves} moves</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
