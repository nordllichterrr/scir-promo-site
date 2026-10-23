import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#070b16]/80 backdrop-blur-md border-b border-[#26325a] sticky top-0 z-50 w-full">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-black text-[#e9edff] tracking-widest">
          S<span className="text-[#00d1b2]">C</span>IR
        </Link>
        <div className="hidden md:flex gap-6 text-sm text-[#94a3c4]">
          <a href="#hero" className="hover:text-white transition">О проекте</a>
          <a href="#timeline" className="hover:text-white transition">Исследование</a>
          <a href="#contact" className="hover:text-white transition">Контакты</a>
          <a href="https://zenodo.org/records/22146633" target="_blank" className="hover:text-white transition">Статья</a>
        </div>
      </div>
    </nav>
  );
}
