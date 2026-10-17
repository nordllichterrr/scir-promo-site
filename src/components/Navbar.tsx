import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#1B1F3B] text-[#F0F4F8] sticky top-0 z-50 shadow-md w-full">
      <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-[4px]">
          S<span className="text-[#F0A6CA]">C</span>IR
        </Link>
        <div className="hidden md:flex gap-6 text-sm">
          <a href="#hero" className="opacity-85 hover:opacity-100 hover:text-[#2EC4A6] transition">О проекте</a>
          <a href="#algorithm" className="opacity-85 hover:opacity-100 hover:text-[#2EC4A6] transition">Алгоритм</a>
          <a href="#results" className="opacity-85 hover:opacity-100 hover:text-[#2EC4A6] transition">Результаты</a>
          <a href="https://zenodo.org/records/22146633" target="_blank" className="opacity-85 hover:opacity-100 hover:text-[#2EC4A6] transition">Статья</a>
          <a href="#contact" className="opacity-85 hover:opacity-100 hover:text-[#2EC4A6] transition">Контакты</a>
        </div>
      </div>
    </nav>
  );
}
