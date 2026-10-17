import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 py-5 w-full shadow-sm">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-center">
        <ul className="top-menu">
          <li><a href="#hero">О проекте</a></li>
          <li><a href="#algorithm">Алгоритм</a></li>
          <li><a href="#results">Результаты</a></li>
          <li><a href="#audience">Для кого</a></li>
          <li><a href="#contact">Контакты</a></li>
        </ul>
      </div>
    </nav>
  );
}
