import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#1B1F3B]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 py-3 shadow-xl w-full">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/">
          <img src="/logo.jpg" alt="SCIR" className="h-10 w-auto rounded shadow-md" />
        </Link>
        <ul className="flex flex-row gap-6 md:gap-10 list-none m-0 p-0">
          <li><Link href="/" className="text-white hover:text-scir-emerald font-bold text-sm md:text-base transition-colors uppercase tracking-wider">Главная</Link></li>
          <li><Link href="/algorithm" className="text-white hover:text-scir-emerald font-bold text-sm md:text-base transition-colors uppercase tracking-wider">Алгоритм</Link></li>
          <li><Link href="/results" className="text-white hover:text-scir-emerald font-bold text-sm md:text-base transition-colors uppercase tracking-wider">Результаты</Link></li>
          <li><Link href="/contact" className="text-white hover:text-scir-emerald font-bold text-sm md:text-base transition-colors uppercase tracking-wider">Заявка</Link></li>
        </ul>
      </div>
    </nav>
  );
}
