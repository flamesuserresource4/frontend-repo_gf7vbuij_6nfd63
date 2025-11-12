import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative w-full h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full flex items-center justify-center bg-gradient-to-b from-white/60 via-white/40 to-white/10 pointer-events-none">
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900">Minimal Match</h1>
          <p className="mt-4 text-neutral-700 md:text-lg max-w-2xl mx-auto">Flip tiles. Find pairs. Race the clock. A clean, modern memory game with buttery-smooth animations.</p>
        </div>
      </div>
    </section>
  );
}
