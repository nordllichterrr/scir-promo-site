import Link from 'next/link';

export default function LabPage() {
  return (
    <main className="min-h-screen bg-[#070b16] text-white flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <div className="text-7xl mb-8">🦄</div>
        <p className="text-[#00d1b2] font-bold tracking-[0.3em] mb-4">
          RESEARCH WORKSPACE
        </p>
        <h1 className="text-5xl md:text-7xl font-black mb-6">
          SCIR <span className="text-[#00d1b2]">LAB</span>
        </h1>
        <p className="text-[#94a3c4] text-lg leading-relaxed mb-10">
          Экспериментальная среда для исследования индуктивных
          рекомендательных алгоритмов, оценки качества ранжирования
          и анализа сценариев холодного старта.
        </p>

        <div className="flex justify-center flex-wrap gap-4">
          <Link
            href="/lab/login"
            className="rounded-xl bg-[#00d1b2] px-8 py-4 font-bold text-[#070b16] hover:bg-[#43e8ce] transition"
          >
            Войти в лабораторию
          </Link>
          <Link
            href="/lab/register"
            className="rounded-xl border border-[#ff5b8c] px-8 py-4 font-bold text-[#ff5b8c] hover:bg-[#ff5b8c] hover:text-[#070b16] transition"
          >
            Создать аккаунт
          </Link>
        </div>

        <Link
          href="/"
          className="inline-block mt-10 text-sm text-[#64748b] hover:text-white"
        >
          ← Вернуться на сайт SCIR
        </Link>
      </div>
    </main>
  );
}
