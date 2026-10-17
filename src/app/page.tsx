import Link from 'next/link';
import Formula from '@/components/Formula';
import B2BForm from '@/components/B2BForm';

export default function HomePage() {
  const rows = [
    { model: 'MF-SVD', hr: '0.234', ndcg: '0.0425', latency: '—' },
    { model: 'EASE', hr: '0.210', ndcg: '0.0404', latency: '—' },
    { model: 'DropoutNet', hr: '0.110', ndcg: '0.0218', latency: '—' },
    { model: 'SCIR', hr: '0.548', ndcg: '0.1243', latency: '1.8 мс', highlight: true },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-[#F0F4F8]">
      
      {/* HERO SECTION (Темно-синий блок) */}
      <section className="bg-[#1B1F3B] w-full pt-12 pb-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-[#2EC4A6]/30 via-[#8B5CF6]/30 to-transparent flex items-center justify-center relative flex-shrink-0 border border-white/10">
            <img src="/logo.jpg" alt="SCIR" className="w-32 h-32 object-cover rounded-full" />
            <span className="absolute -top-2 -right-2 bg-[#F0A6CA] text-[#1B1F3B] font-bold rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg">γ</span>
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-black tracking-widest text-white mb-2">SCIR</h1>
            <p className="text-[#2EC4A6] text-xl font-bold mb-8">Ranking without History</p>
            <div className="flex gap-4 justify-center md:justify-start flex-wrap">
              <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="bg-[#F0A6CA] text-[#1B1F3B] px-6 py-3 rounded-lg font-bold hover:bg-pink-400 transition shadow-md">
                Скачать репозиторий
              </a>
              <Link href="#contact" className="border-2 border-[#2EC4A6] text-[#2EC4A6] px-6 py-3 rounded-lg font-bold hover:bg-[#2EC4A6] hover:text-[#1B1F3B] transition shadow-md">
                Оставить заявку
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК ЦИФРЫ ПРОЕКТА */}
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-black mb-8 text-[#1B1F3B] border-l-4 border-[#8B5CF6] pl-4 flex items-center">
            Цифры проекта
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border-t-4 border-[#2EC4A6] shadow-sm">
              <div className="text-3xl font-black text-[#8B5CF6] mb-2">0.548</div>
              <div className="text-sm text-gray-500 font-medium">HR@10 на MovieLens-25M</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border-t-4 border-[#8B5CF6] shadow-sm">
              <div className="text-3xl font-black text-[#8B5CF6] mb-2">0.1243</div>
              <div className="text-sm text-gray-500 font-medium">nDCG@10 на MovieLens-25M</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border-t-4 border-[#F0A6CA] shadow-sm">
              <div className="text-3xl font-black text-[#8B5CF6] mb-2">1.8 мс</div>
              <div className="text-sm text-gray-500 font-medium">Задержка на CPU</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border-t-4 border-[#2EC4A6] shadow-sm">
              <div className="text-3xl font-black text-[#8B5CF6] mb-2">3400×</div>
              <div className="text-sm text-gray-500 font-medium">Быстрее кросс-энкодера</div>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК АЛГОРИТМА */}
      <section className="w-full bg-white py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-black mb-8 text-[#1B1F3B] border-l-4 border-[#8B5CF6] pl-4 flex items-center">
            Как работает алгоритм
          </h2>
          <div className="bg-[#1B1F3B] text-[#2EC4A6] p-8 rounded-xl font-mono text-sm md:text-lg overflow-x-auto mb-8 shadow-md">
             <Formula block latex={String.raw`s(u,i) = (1 - \gamma(u)) \cdot \langle u, e_i \rangle + \gamma(u) \cdot \frac{\log(1+\text{pop}_i)}{\max_{j \in I} \log(1+\text{pop}_j)}`} />
          </div>
          <p className="text-gray-600 leading-relaxed text-lg max-w-4xl">
            SCIR объединяет два сигнала: смысловой (эмбеддинги Sentence-BERT) и статистический (популярность товаров по закону Ципфа). Баланс между ними настраивается автоматически через параметр γ(u), который зависит от длины истории пользователя.
          </p>
        </div>
      </section>

      {/* БЛОК РЕЗУЛЬТАТОВ (Таблица) */}
      <section className="w-full bg-white py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-black mb-8 text-[#1B1F3B] border-l-4 border-[#8B5CF6] pl-4 flex items-center">
            Результаты
          </h2>
          
          <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200 bg-white text-black">
            <table className="w-full text-base md:text-lg text-left border-collapse">
              <thead className="bg-[#1B1F3B] text-white">
                <tr>
                  <th className="px-6 py-4 font-bold">Модель</th>
                  <th className="px-6 py-4 font-bold">HR@10</th>
                  <th className="px-6 py-4 font-bold">nDCG@10</th>
                  <th className="px-6 py-4 font-bold">Задержка</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((r) => (
                  <tr key={r.model} className={r.highlight ? 'bg-[#F0A6CA] font-bold text-[#1B1F3B]' : 'hover:bg-gray-50 transition-colors text-gray-700'}>
                    <td className="px-6 py-4">{r.model}</td>
                    <td className="px-6 py-4">{r.hr}</td>
                    <td className="px-6 py-4">{r.ndcg}</td>
                    <td className="px-6 py-4">{r.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* БЛОК ДЛЯ КОГО (Карточки) */}
      <section className="w-full bg-white py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-black mb-8 text-[#1B1F3B] border-l-4 border-[#8B5CF6] pl-4 flex items-center">
            Для кого этот проект
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-[#2EC4A6]">
              <div className="text-3xl font-black text-[#8B5CF6] mb-1">01</div>
              <div className="text-sm text-gray-600 font-medium">Исследователи ML</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-[#8B5CF6]">
              <div className="text-3xl font-black text-[#8B5CF6] mb-1">02</div>
              <div className="text-sm text-gray-600 font-medium">Инженеры продакшена</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-[#F0A6CA]">
              <div className="text-3xl font-black text-[#8B5CF6] mb-1">03</div>
              <div className="text-sm text-gray-600 font-medium">Продуктовые аналитики</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-[#2EC4A6]">
              <div className="text-3xl font-black text-[#8B5CF6] mb-1">04</div>
              <div className="text-sm text-gray-600 font-medium">Корпоративные клиенты</div>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК CTA (Темный) */}
      <section className="w-full bg-[#1B1F3B] py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white mb-4 border-l-4 border-[#8B5CF6] pl-4 inline-block">Готовы попробовать SCIR?</h2>
          <p className="text-gray-300 mb-8 mt-2">Оставьте заявку на пилот или скачайте репозиторий</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="#contact" className="bg-[#F0A6CA] text-[#1B1F3B] px-8 py-3 rounded-lg font-bold hover:bg-pink-400 transition shadow-md">
              Оставить заявку
            </Link>
            <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="border-2 border-[#2EC4A6] text-[#2EC4A6] px-8 py-3 rounded-lg font-bold hover:bg-[#2EC4A6] hover:text-[#1B1F3B] transition shadow-md">
              Скачать репозиторий
            </a>
          </div>
        </div>
      </section>

      {/* БЛОК ФОРМЫ */}
      <section id="contact" className="w-full bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <B2BForm />
        </div>
      </section>

      {/* FOOTER (Темный, как на скрине) */}
      <footer className="bg-[#1B1F3B] text-white py-12 rounded-t-3xl">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-black text-[#2EC4A6] mb-3">SCIR</h4>
            <p className="text-sm text-gray-400">Ranking without History</p>
          </div>
          <div>
            <h4 className="font-black text-[#2EC4A6] mb-3">Разделы</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-white transition">О проекте</a></li>
              <li><a href="/algorithm" className="hover:text-white transition">Алгоритм</a></li>
              <li><a href="/results" className="hover:text-white transition">Результаты</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[#2EC4A6] mb-3">Ресурсы</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-white transition">Репозиторий</a></li>
              <li><a href="#" className="hover:text-white transition">Документация</a></li>
              <li><a href="#" className="hover:text-white transition">Блог</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[#2EC4A6] mb-3">Контакты</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>lemdyasova68@gmail.com</li>
              <li>zmanovskiy.n.v@gmail.com</li>
            </ul>
          </div>
        </div>
      </footer>

    </main>
  );
}
