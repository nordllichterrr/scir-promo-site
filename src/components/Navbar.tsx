import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 py-4 w-full">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Логотип текстом */}
        <Link href="/" className="text-2xl font-black text-[#1B1F3B] tracking-widest">
          SCIR
        </Link>

        {/* Меню из ТЗ */}
        <ul className="hidden md:flex flex-row gap-6 list-none m-0 p-0 text-sm text-gray-600 font-medium">
          <li><Link href="#" className="hover:text-[#8B5CF6] transition">О проекте</Link></li>
          <li><Link href="/algorithm" className="hover:text-[#8B5CF6] transition">Алгоритм</Link></li>
          <li><Link href="/results" className="hover:text-[#8B5CF6] transition">Результаты</Link></li>
          <li><Link href="#" className="hover:text-[#8B5CF6] transition">Ресурс</Link></li>
          <li><Link href="#" className="hover:text-[#8B5CF6] transition">Документация</Link></li>
          <li><Link href="#" className="hover:text-[#8B5CF6] transition">Блог</Link></li>
          <li><Link href="/contact" className="hover:text-[#8B5CF6] transition">Контакты</Link></li>
        </ul>
      </div>
    </nav>
  );
}
