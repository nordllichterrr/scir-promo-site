import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#1B1F3B] border-b-2 border-scir-emerald sticky top-0 z-50 py-4 shadow-2xl w-full">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-center">
        <ul className="flex flex-row flex-wrap justify-center gap-8 md:gap-12 list-none m-0 p-0">
          <li><Link href="/" className="text-white hover:text-scir-emerald font-black text-xl tracking-widest transition-colors uppercase drop-shadow-md">Главная</Link></li>
          <li><Link href="/algorithm" className="text-white hover:text-scir-emerald font-black text-xl tracking-widest transition-colors uppercase drop-shadow-md">Алгоритм и результаты</Link></li>
          <li><Link href="/contact" className="text-white hover:text-scir-emerald font-black text-xl tracking-widest transition-colors uppercase drop-shadow-md">Заявка</Link></li>
        </ul>
      </div>
    </nav>
  );
}
