import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#1B1F3B]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 py-3 shadow-xl w-full">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Уменьшенный логотип */}
        <Link href="/">
          <img src="/logo.jpg" alt="SCIR" className="h-10 w-auto rounded" />
        </Link>

        {/* Меню-якоря */}
        <ul className="flex flex-row gap-8 list-none m-0 p-0">
          <li><a href="#hero" className="text-white hover:text-scir-emerald font-bold text-lg transition-colors uppercase">Главная</a></li>
          <li><a href="#algorithm" className="text-white hover:text-scir-emerald font-bold text-lg transition-colors uppercase">Алгоритм</a></li>
          <li><a href="#contact" className="text-white hover:text-scir-emerald font-bold text-lg transition-colors uppercase">Заявка</a></li>
        </ul>
      </div>
    </nav>
  );
}
