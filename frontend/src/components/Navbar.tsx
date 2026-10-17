import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#1B1F3B]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 py-4 shadow-xl w-full">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-center">
        <ul className="nav-list">
          <li><Link href="/" className="nav-link">Главная</Link></li>
          <li><Link href="/algorithm" className="nav-link">Алгоритм</Link></li>
          <li><Link href="/results" className="nav-link">Результаты</Link></li>
          <li><Link href="/contact" className="nav-link">Заявка</Link></li>
        </ul>
      </div>
    </nav>
  );
}
