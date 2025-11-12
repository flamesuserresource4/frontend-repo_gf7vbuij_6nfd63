import Hero from './components/Hero';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(80,80,255,0.22),transparent_60%)] bg-neutral-950 text-neutral-100">
      <Hero />
      <main className="relative -mt-16 md:-mt-24">
        <div className="max-w-6xl mx-auto">
          <Game />
          <Leaderboard />
          <footer className="py-16 text-center text-neutral-500">Built with love • Minimal Match</footer>
        </div>
      </main>
    </div>
  );
}

export default App
