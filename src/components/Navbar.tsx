import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#1B1F3B] sticky top-0 z-50 py-4 shadow-md w-full">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black text-white tracking-widest">
          SCIR
        </Link>
        <ul className="hidden md:flex flex-row gap-6 list-none m-0 p-0 text-sm text-gray-300 font-medium">
          <li><Link href="#" className="hover:text-white transition">О проекте</Link></li>
          <li><Link href="/algorithm" className="hover:text-white transition">Алгоритм</Link></li>
          <li><Link href="/results" className="hover:text-white transition">Результаты</Link></li>
          <li><Link href="#" className="hover:text-white transition">Ресурс</Link></li>
          <li><Link href="#" className="hover:text-white transition">Документация</Link></li>
          <li><Link href="#" className="hover:text-white transition">Блог</Link></li>
          <li><Link href="/contact" className="hover:text-white transition">Контакты</Link></li>
        </ul>
      </div>
    </nav>
  );
}
