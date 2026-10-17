import Link from 'next/link';

export default function CoverPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="max-w-6xl w-full flex flex-col items-center text-center gap-8">
        
        <img src="/logo.jpg" alt="SCIR Logo" className="w-[90%] md:w-[70%] max-w-4xl h-auto object-contain drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]" />
        
        {/* Увеличенное приветствие */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-2xl">
          Добро пожаловать в <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-scir-emerald to-scir-amethyst">
            SCIR
          </span>
        </h1>
        
        <p className="text-xl md:text-3xl text-gray-200 max-w-3xl font-medium leading-relaxed mt-2 mb-4">
          Индуктивный алгоритм рекомендаций для холодного старта.
        </p>
        
        <Link href="/algorithm" className="mt-6 inline-flex items-center justify-center px-12 py-6 text-2xl font-black text-[#0F1225] bg-scir-emerald rounded-full hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(46,196,166,0.6)]">
          Перейти к алгоритму →
        </Link>
      </div>
    </main>
  );
}
