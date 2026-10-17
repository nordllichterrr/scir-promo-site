import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 py-3 w-full shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Совсем маленький логотип */}
        <Link href="/">
          <img src="/logo.jpg" alt="SCIR" className="h-8 w-auto rounded" />
        </Link>

        {/* Меню-якоря */}
        <ul className="hidden md:flex flex-row gap-8 list-none m-0 p-0 text-sm text-gray-600 font-bold">
          <li><a href="#hero" className="hover:text-[#8B5CF6] transition">О проекте</a></li>
          <li><a href="#algorithm" className="hover:text-[#8B5CF6] transition">Алгоритм</a></li>
          <li><a href="#results" className="hover:text-[#8B5CF6] transition">Результаты</a></li>
          <li><a href="#audience" className="hover:text-[#8B5CF6] transition">Для кого</a></li>
          <li><a href="#contact" className="hover:text-[#8B5CF6] transition">Контакты</a></li>
        </ul>
      </div>
    </nav>
  );
}
