import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 py-3 shadow-sm w-full">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        
        {/* Маленький логотип */}
        <Link href="/">
          <img src="/logo.jpg" alt="SCIR" className="h-10 w-auto rounded" />
        </Link>

        {/* Меню-якоря (Черный текст) */}
        <ul className="flex flex-row gap-8 list-none m-0 p-0">
          <li><a href="#hero" className="text-[#1B1F3B] hover:text-scir-amethyst font-extrabold text-lg transition-colors uppercase">Главная</a></li>
          <li><a href="#algorithm" className="text-[#1B1F3B] hover:text-scir-amethyst font-extrabold text-lg transition-colors uppercase">Алгоритм</a></li>
          <li><a href="#contact" className="text-[#1B1F3B] hover:text-scir-amethyst font-extrabold text-lg transition-colors uppercase">Заявка</a></li>
        </ul>
      </div>
    </nav>
  );
}
