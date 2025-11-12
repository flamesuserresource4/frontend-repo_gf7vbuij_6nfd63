import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BACKEND = import.meta.env.VITE_BACKEND_URL || '';

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function useTimer(running) {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    if (!running) return;
    const start = performance.now() - ms;
    const id = setInterval(() => setMs(performance.now() - start), 16);
    return () => clearInterval(id);
  }, [running]);
  return [ms, setMs];
}

function Tile({ index, value, isFlipped, isMatched, onClick }) {
  return (
    <button
      onClick={() => onClick(index)}
      disabled={isMatched}
      className="relative aspect-square w-full rounded-xl focus:outline-none"
    >
      <motion.div
        className={`absolute inset-0 rounded-xl ${isMatched ? 'bg-rose-500' : 'bg-neutral-100'} shadow-inner`}
        animate={{ scale: isFlipped || isMatched ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
      <motion.div
        className="absolute inset-0 rounded-xl flex items-center justify-center text-2xl font-bold"
        initial={false}
        animate={{ rotateY: isFlipped || isMatched ? 0 : 180, opacity: isFlipped || isMatched ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ backfaceVisibility: 'hidden' }}
      >
        {value}
      </motion.div>
    </button>
  );
}

export default function Game() {
  const symbols = useMemo(() => ['A','B','C','D','E','F','G','H'], []); // 8 pairs -> 4x4 grid
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]); // indexes of currently flipped
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [running, setRunning] = useState(false);
  const [ms, setMs] = useTimer(running);
  const [showPrompt, setShowPrompt] = useState(false);
  const nameRef = useRef(null);

  // setup deck
  useEffect(() => {
    const d = shuffle([...symbols, ...symbols]).map((v, i) => ({ id: i, value: v }));
    setDeck(d);
  }, [symbols]);

  useEffect(() => {
    if (matched.size === symbols.length && symbols.length > 0) {
      setRunning(false);
      setShowPrompt(true);
    }
  }, [matched, symbols.length]);

  const handleClick = (index) => {
    if (showPrompt) return;
    if (!running) setRunning(true);
    if (flipped.includes(index) || matched.has(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [i1, i2] = newFlipped;
      if (deck[i1].value === deck[i2].value) {
        // match
        setTimeout(() => {
          setMatched(new Set([...matched, i1, i2]));
          setFlipped([]);
        }, 300);
      } else {
        // not match
        setTimeout(() => setFlipped([]), 600);
      }
    } else if (newFlipped.length > 2) {
      setFlipped([index]);
    }
  };

  const reset = () => {
    setDeck(shuffle([...symbols, ...symbols]).map((v, i) => ({ id: i, value: v })));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setMs(0);
    setRunning(false);
    setShowPrompt(false);
  };

  const submitScore = async () => {
    const name = nameRef.current?.value?.trim() || 'Anonymous';
    const payload = { name, time_ms: Math.round(ms), moves };
    try {
      await fetch(`${BACKEND}/api/leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setShowPrompt(false);
      reset();
    }
  };

  const gridSize = 4; // 4x4

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Match the Tiles</h2>
            <p className="text-neutral-600">Find all pairs as fast as you can. Fewer moves is better.</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 rounded-full bg-white border">Time: {(ms/1000).toFixed(2)}s</span>
            <span className="px-3 py-1 rounded-full bg-white border">Moves: {moves}</span>
            <button onClick={reset} className="px-3 py-1 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition">Reset</button>
          </div>
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
          {deck.map((card, idx) => (
            <Tile
              key={card.id}
              index={idx}
              value={card.value}
              isFlipped={flipped.includes(idx)}
              isMatched={matched.has(idx)}
              onClick={handleClick}
            />
          ))}
        </div>

        <AnimatePresence>
          {showPrompt && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                initial={{ y: 40, scale: 0.96, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 20, scale: 0.98, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              >
                <h3 className="text-xl font-semibold">Nice! You finished</h3>
                <p className="mt-1 text-neutral-600">Time: {(ms/1000).toFixed(2)}s · Moves: {moves}</p>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-neutral-700">Your Name</label>
                  <input ref={nameRef} className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400" placeholder="Type your name" />
                </div>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button onClick={() => setShowPrompt(false)} className="px-4 py-2 rounded-lg border bg-white hover:bg-neutral-50">Cancel</button>
                  <button onClick={submitScore} className="px-4 py-2 rounded-lg bg-rose-500 text-white shadow hover:bg-rose-600">Submit</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
