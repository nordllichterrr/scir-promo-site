'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLabAuth } from './LabAuth';

const links = [
  { href: '/lab/dashboard', label: 'Обзор' },
  { href: '/lab/experiments/new', label: 'Новый эксперимент' },
];

export default function LabShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useLabAuth();
  const router = useRouter();

  async function handleSignOut() {
    try {
      await signOut();
      router.replace('/lab/login');
    } catch {
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#070b16] text-white">
      <header className="border-b border-[#26325a] bg-[#0b1122]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link href="/lab" className="flex items-center gap-3">
            <span className="text-3xl">🦄</span>
            <span>
              <span className="block font-black tracking-[0.2em] text-xl">SCIR LAB</span>
              <span className="block text-xs text-[#00d1b2]">Research workspace</span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-5 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#94a3c4] hover:text-[#00d1b2] transition"
              >
                {link.label}
              </Link>
            ))}
            <span className="text-[#94a3c4]">{user?.username}</span>
            <button
              onClick={handleSignOut}
              className="text-[#ff5b8c] hover:text-white transition"
            >
              Выйти
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>

      <footer className="border-t border-[#26325a] px-6 py-6 text-center text-xs text-[#64748b]">
        SCIR Lab · Research environment · Ranking without History
      </footer>
    </div>
  );
}
