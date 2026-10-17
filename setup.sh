#!/bin/bash
set -e

mkdir -p src/components
mkdir -p src/app/api/b2b
mkdir -p src/app/algorithm
mkdir -p src/app/results

# 1. layout.tsx (Шрифты и метаданные)
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import { Inter, Jura } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter', display: 'swap' });
const jura = Jura({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600', '700'], variable: '--font-jura', display: 'swap' });

export const metadata: Metadata = {
  title: 'SCIR — Ranking without History',
  description: 'Индуктивный алгоритм рекомендаций для холодного старта.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${jura.variable}`}>
      <body className="font-inter antialiased bg-[#1B1F3B] text-white">{children}</body>
    </html>
  );
}
EOF

# 2. tailwind.config.ts (Цвета из референсов)
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'scir-bg': '#0F1225',      // Глубокий темно-синий (фон)
        'scir-indigo': '#1B1F3B',  // Чуть светлее для карточек
        'scir-emerald': '#2EC4A6', // Бирюзовый (как на фото)
        'scir-amethyst': '#8B5CF6',// Фиолетовый (как на фото)
        'scir-pink': '#F0A6CA',    // Розовый (точка гамма)
        'scir-white': '#F0F4F8',   // Белый
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        jura: ['var(--font-jura)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
EOF

# 3. Компонент формулы LaTeX
cat > src/components/Formula.tsx << 'EOF'
'use client';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

export default function Formula({ latex, block = false }: { latex: string, block?: boolean }) {
  return block ? <BlockMath math={latex} /> : <InlineMath math={latex} />;
}
EOF

# 4. Hero.tsx (Логотип и главный экран)
cat > src/components/Hero.tsx << 'EOF'
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="bg-scir-bg py-24 px-4 border-b border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="mb-10 w-full max-w-2xl">
          <Image 
            src="/logo.png" 
            alt="SCIR Logo" 
            width={800} 
            height={450} 
            className="w-full h-auto object-contain"
            priority
          />
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" rel="noopener noreferrer" className="bg-scir-emerald text-scir-bg px-8 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition">
            Скачать репозиторий
          </a>
          <a href="#b2b" className="border-2 border-scir-amethyst text-scir-amethyst px-8 py-3 rounded-lg font-semibold hover:bg-scir-amethyst hover:text-white transition">
            Оставить заявку
          </a>
        </div>
      </div>
    </section>
  );
}
EOF

# 5. KeyMetrics.tsx
cat > src/components/KeyMetrics.tsx << 'EOF'
const metrics = [
  { value: '0.548', label: 'HR@10 на MovieLens-25M', color: 'border-scir-emerald' },
  { value: '0.1243', label: 'nDCG@10 на MovieLens-25M', color: 'border-scir-amethyst' },
  { value: '1.8 мс', label: 'Задержка на CPU', color: 'border-scir-pink' },
  { value: '3400×', label: 'Быстрее кросс-энкодера', color: 'border-scir-emerald' },
];

export default function KeyMetrics() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="font-jura text-3xl font-bold mb-8 text-white">Цифры проекта</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className={`bg-scir-indigo rounded-xl p-6 border-l-4 ${m.color} shadow-lg`}>
            <div className="text-3xl font-bold text-white mb-2">{m.value}</div>
            <div className="text-sm text-gray-400">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
EOF

# 6. AlgorithmSection.tsx (Формула)
cat > src/components/AlgorithmSection.tsx << 'EOF'
import Formula from './Formula';

export default function AlgorithmSection() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="font-jura text-3xl font-bold mb-8 text-white">Как работает алгоритм</h2>
      <div className="bg-scir-indigo text-white p-8 rounded-xl overflow-x-auto mb-8 border border-white/10 shadow-lg flex justify-center">
        <Formula
          block
          latex={String.raw`s(u,i) = (1 - \gamma(u)) \cdot \langle u, e_i \rangle + \gamma(u) \cdot \frac{\log(1+\text{pop}_i)}{\max_{j \in I} \log(1+\text{pop}_j)}`}
        />
      </div>
      <div className="text-gray-300 leading-relaxed space-y-4 max-w-4xl">
        <p>
          SCIR объединяет два сигнала: смысловой (эмбеддинги Sentence-BERT)
          и статистический (популярность товаров по закону Ципфа). Баланс
          между ними настраивается автоматически через параметр{' '}
          <span className="text-scir-pink font-bold"><Formula latex={String.raw`\gamma(u)`} /></span>, 
          который зависит от длины истории пользователя.
        </p>
        <p>
          Параметр гейтинга вычисляется как{' '}
          <Formula latex={String.raw`\gamma(u) = \frac{\gamma_{\text{base}}}{1 + 0.05 \cdot \min(|H_u|, 20)}`} />,
          где <Formula latex={String.raw`\gamma_{\text{base}} = 0.45`} /> и{' '}
          <Formula latex={String.raw`|H_u|`} /> — длина истории пользователя.
        </p>
      </div>
    </section>
  );
}
EOF

# 7. ResultsTable.tsx
cat > src/components/ResultsTable.tsx << 'EOF'
const rows = [
  { model: 'MF-SVD', hr: '0.234', ndcg: '0.0425', latency: '—' },
  { model: 'EASE', hr: '0.210', ndcg: '0.0404', latency: '—' },
  { model: 'DropoutNet', hr: '0.110', ndcg: '0.0218', latency: '—' },
  { model: 'SCIR', hr: '0.548', ndcg: '0.1243', latency: '1.8 мс', highlight: true },
];

export default function ResultsTable() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="font-jura text-3xl font-bold mb-8 text-white">Результаты</h2>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-white/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-scir-indigo text-gray-300 uppercase">
            <tr>
              <th className="p-4">Модель</th>
              <th className="p-4">HR@10</th>
              <th className="p-4">nDCG@10</th>
              <th className="p-4">Задержка</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-[#151933]">
            {rows.map((r) => (
              <tr key={r.model} className={r.highlight ? 'bg-scir-emerald/20 font-bold text-scir-emerald' : 'text-gray-300 hover:bg-white/5'}>
                <td className="p-4">{r.model}</td>
                <td className="p-4">{r.hr}</td>
                <td className="p-4">{r.ndcg}</td>
                <td className="p-4">{r.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-4">5 зёрен, N = 500. Значимость: p &lt; 10⁻¹⁵ (тест Уилкоксона).</p>
    </section>
  );
}
EOF

# 8. AudienceSection.tsx
cat > src/components/AudienceSection.tsx << 'EOF'
const audiences = [
  { num: '01', label: 'Исследователи ML', color: 'border-scir-emerald' },
  { num: '02', label: 'Инженеры продакшена', color: 'border-scir-amethyst' },
  { num: '03', label: 'Продуктовые аналитики', color: 'border-scir-pink' },
  { num: '04', label: 'Корпоративные клиенты', color: 'border-scir-emerald' },
];

export default function AudienceSection() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="font-jura text-3xl font-bold mb-8 text-white">Для кого этот проект</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {audiences.map((a) => (
          <div key={a.num} className={`bg-scir-indigo rounded-xl p-6 border-l-4 ${a.color} shadow-lg`}>
            <div className="text-3xl font-bold text-white mb-2">{a.num}</div>
            <div className="text-sm text-gray-400">{a.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
EOF

# 9. CtaSection.tsx
cat > src/components/CtaSection.tsx << 'EOF'
export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-scir-indigo to-[#151933] text-center px-4 border-y border-white/10">
      <h2 className="font-jura text-3xl font-bold text-white mb-4">Готовы попробовать SCIR?</h2>
      <p className="text-gray-400 mb-8">Оставьте заявку на пилот или скачайте репозиторий</p>
      <div className="flex justify-center gap-4 flex-wrap">
        <a href="#b2b" className="bg-scir-pink text-scir-bg px-8 py-3 rounded-lg font-semibold hover:bg-pink-300 transition shadow-[0_0_15px_rgba(240,166,202,0.4)]">Оставить заявку</a>
        <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" rel="noopener noreferrer" className="border-2 border-scir-emerald text-scir-emerald px-8 py-3 rounded-lg font-semibold hover:bg-scir-emerald hover:text-scir-bg transition">Скачать репозиторий</a>
      </div>
    </section>
  );
}
EOF

# 10. B2BForm.tsx
cat > src/components/B2BForm.tsx << 'EOF'
'use client';

import { useState } from 'react';

export default function B2BForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('success');
        e.currentTarget.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="b2b" className="py-16 px-4 max-w-2xl mx-auto">
      <h2 className="font-jura text-3xl font-bold text-center mb-8 text-white">Оставить заявку на пилот</h2>
      {status === 'success' && (<div className="bg-scir-emerald/20 border border-scir-emerald text-scir-emerald px-4 py-3 rounded mb-6">Заявка успешно отправлена!</div>)}
      {status === 'error' && (<div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-6">Произошла ошибка. Попробуйте позже.</div>)}
      <form onSubmit={handleSubmit} className="space-y-4 bg-scir-indigo p-8 rounded-xl shadow-lg border border-white/10">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Имя *</label>
          <input name="name" required minLength={2} maxLength={100} className="w-full p-3 bg-[#0F1225] border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-scir-emerald" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Компания *</label>
          <input name="company" required minLength={2} maxLength={150} className="w-full p-3 bg-[#0F1225] border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-scir-emerald" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Email *</label>
          <input type="email" name="email" required className="w-full p-3 bg-[#0F1225] border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-scir-emerald" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Сообщение *</label>
          <textarea name="message" required minLength={10} maxLength={1000} rows={4} className="w-full p-3 bg-[#0F1225] border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-scir-emerald" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-scir-amethyst text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition disabled:opacity-50 shadow-[0_0_15px_rgba(139,92,246,0.3)]">{loading ? 'Отправка...' : 'Отправить заявку'}</button>
      </form>
    </section>
  );
}
EOF

# 11. Footer.tsx
cat > src/components/Footer.tsx << 'EOF'
export default function Footer() {
  return (
    <footer className="bg-[#0F1225] text-gray-400 py-12 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-jura text-white font-bold mb-3">SCIR</h4>
          <p className="text-sm">Ranking without History</p>
        </div>
        <div>
          <h4 className="font-jura text-scir-emerald font-bold mb-3">Разделы</h4>
          <ul className="text-sm space-y-2">
            <li><a href="#" className="hover:text-white transition">О проекте</a></li>
            <li><a href="/algorithm" className="hover:text-white transition">Алгоритм</a></li>
            <li><a href="/results" className="hover:text-white transition">Результаты</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-jura text-scir-emerald font-bold mb-3">Ресурсы</h4>
          <ul className="text-sm space-y-2">
            <li><a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="hover:text-white transition">Репозиторий</a></li>
            <li><a href="#" className="hover:text-white transition">Документация</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-jura text-scir-emerald font-bold mb-3">Контакты</h4>
          <ul className="text-sm space-y-2">
            <li>lemdyasova68@gmail.com</li>
            <li>zmanovskiy.n.v@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/5 text-xs text-center">© 2026 SCIR. DOI: 10.5281/zenodo.18772321</div>
    </footer>
  );
}
EOF

# 12. page.tsx
cat > src/app/page.tsx << 'EOF'
import Hero from '@/components/Hero';
import KeyMetrics from '@/components/KeyMetrics';
import AlgorithmSection from '@/components/AlgorithmSection';
import ResultsTable from '@/components/ResultsTable';
import AudienceSection from '@/components/AudienceSection';
import CtaSection from '@/components/CtaSection';
import B2BForm from '@/components/B2BForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-scir-bg">
      <Hero />
      <KeyMetrics />
      <AlgorithmSection />
      <ResultsTable />
      <AudienceSection />
      <CtaSection />
      <B2BForm />
      <Footer />
    </main>
  );
}
EOF

# 13. api/b2b/route.ts
cat > src/app/api/b2b/route.ts << 'EOF'
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.company || !body.email || !body.message) return NextResponse.json({ error: 'Заполните поля' }, { status: 400 });
    if (body.message.length < 10) return NextResponse.json({ error: 'Сообщение короткое' }, { status: 400 });
    console.log('[B2B]', body);
    return NextResponse.json({ status: 'ok' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Ошибка' }, { status: 400 });
  }
}
EOF

echo "✅ Все файлы обновлены в стиле референсов!"
