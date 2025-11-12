import Hero from './components/Hero';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 text-neutral-900">
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
