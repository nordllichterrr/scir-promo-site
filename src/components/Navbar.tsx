import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#070b16]/85 backdrop-blur-md border-b border-[#26325a] sticky top-0 z-50 w-full animate-rise">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Логотип-картинка (единорог) */}
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="/logo.jpg" 
            alt="SCIR Logo" 
            className="h-10 w-auto rounded-md shadow-[0_0_15px_rgba(0,209,178,0.3)] object-contain" 
          />
          <span className="text-xl font-black text-[#e9edff] tracking-widest hidden sm:block">
            S<span className="text-[#00d1b2]">C</span>IR
          </span>
        </Link>
        
        {/* Меню */}
        <div className="hidden md:flex gap-8 text-sm font-semibold text-[#94a3c4]">
          <a href="#hero" className="hover:text-white transition">О проекте</a>
          <a href="#algorithm" className="hover:text-white transition">Алгоритм</a>
          <a href="#results" className="hover:text-white transition">Результаты</a>
          <a href="https://zenodo.org/records/22146633" target="_blank" className="hover:text-white transition">Статья</a>
          <a href="#contact" className="hover:text-white transition">Контакты</a>
        </div>
      </div>
    </nav>
  );
}
